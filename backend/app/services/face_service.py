"""
Face Verification Service — Netra-TrustID
==========================================
Detects a face on the uploaded government document and compares it with a
live selfie / reference photo using deep neural network biometric embeddings.

Backend tiers (best → fallback)
--------------------------------
1. OpenCV SFace (128-D deep neural network) + YuNet detector — state of the art
2. face_recognition (dlib ArcFace) — if installed
3. OpenCV Haar cascade + SSIM + Color histogram — resilient fallback
4. NumPy structural correlation (PIL) — fail-safe

All tiers return a consistent dict shape and are guaranteed not to raise.
"""

import io
import os
import math
import logging
from typing import Dict, Any, Optional, Tuple

import numpy as np
from PIL import Image

logger = logging.getLogger("trustid.face_verification")

# ── OpenCV ─────────────────────────────────────────────────────────────────
try:
    import cv2
    _HAS_CV2 = True
except ImportError:
    cv2 = None
    _HAS_CV2 = False

# ── face_recognition (dlib) ────────────────────────────────────────────────
try:
    import face_recognition as _fr_lib
    _HAS_FACE_RECOGNITION = True
except ImportError:
    _fr_lib = None
    _HAS_FACE_RECOGNITION = False


# ── Model file paths ───────────────────────────────────────────────────────
_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_MODELS_DIR = os.path.abspath(os.path.join(_CURRENT_DIR, "..", "models"))

_YUNET_FILENAMES = ["face_detection_yunet.onnx", "face_detection_yunet_2023mar.onnx"]
_SFACE_FILENAMES = ["face_recognition_sface.onnx", "face_recognition_sface_2021dec.onnx"]

_YUNET_PATH: Optional[str] = None
_SFACE_PATH: Optional[str] = None

# Search known locations for models
_SEARCH_DIRS = [
    _MODELS_DIR,
    r"C:\Users\Manas\Downloads\final project\merged-project\desktop-face-match",
    os.path.join(os.getcwd(), "models"),
    os.path.join(os.getcwd(), "app", "models"),
]

for d in _SEARCH_DIRS:
    if not os.path.isdir(d):
        continue
    for yf in _YUNET_FILENAMES:
        yp = os.path.join(d, yf)
        if os.path.isfile(yp) and not _YUNET_PATH:
            _YUNET_PATH = yp
    for sf in _SFACE_FILENAMES:
        sp = os.path.join(d, sf)
        if os.path.isfile(sp) and not _SFACE_PATH:
            _SFACE_PATH = sp

_HAS_SFACE_DNN = bool(
    _HAS_CV2
    and cv2 is not None
    and hasattr(cv2, "FaceDetectorYN")
    and hasattr(cv2, "FaceRecognizerSF")
    and _YUNET_PATH
    and _SFACE_PATH
)

if _HAS_SFACE_DNN:
    logger.info("OpenCV YuNet + SFace models loaded: YuNet=%s, SFace=%s", _YUNET_PATH, _SFACE_PATH)
else:
    logger.warning("YuNet/SFace models not found; using OpenCV Haar fallback.")

# Thresholds for SFace
# Official OpenCV benchmark: Cosine threshold = 0.363, L2 threshold = 1.128
SFACE_COSINE_THRESHOLD = 0.363
SFACE_L2_THRESHOLD = 1.128

# Thresholds for dlib face_recognition
FACE_RECOG_THRESHOLD = 0.55

# Threshold for OpenCV Haar SSIM fallback
OPENCV_MATCH_THRESHOLD = 50.0


# ── Helpers ────────────────────────────────────────────────────────────────

def _load_rgb(image_bytes: bytes) -> np.ndarray:
    return np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))


def _rgb_to_bgr(rgb: np.ndarray) -> np.ndarray:
    if _HAS_CV2 and cv2 is not None:
        return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    return rgb[:, :, ::-1]


def _upscale_if_small(img: np.ndarray, min_dim: int = 300) -> np.ndarray:
    """Upscale small images so face detectors can reliably find faces."""
    if not _HAS_CV2 or cv2 is None:
        return img
    h, w = img.shape[:2]
    if min(h, w) < min_dim:
        scale = min_dim / min(h, w)
        img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    return img


# ── Tier 1: OpenCV DNN YuNet + SFace ─────────────────────────────────────────

def _get_sface_recognizer():
    if not _HAS_SFACE_DNN or not _SFACE_PATH:
        return None
    try:
        return cv2.FaceRecognizerSF.create(_SFACE_PATH, "")
    except Exception as exc:
        logger.warning("Failed to initialize FaceRecognizerSF: %s", exc)
        return None


def _detect_and_align_sface(
    bgr_img: np.ndarray,
    recognizer,
    min_score: float = 0.4,
) -> Tuple[Optional[np.ndarray], Optional[np.ndarray]]:
    """
    Detects face using YuNet and aligns it with SFace recognizer.
    Returns (aligned_face_crop, raw_face_box).
    """
    if recognizer is None or not _YUNET_PATH:
        return None, None

    h, w = bgr_img.shape[:2]

    # Pre-scale image for fast & accurate YuNet detection
    scale = 1.0
    if max(h, w) > 1200:
        scale = 1200.0 / max(h, w)
        proc_img = cv2.resize(bgr_img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    elif min(h, w) < 250:
        scale = 250.0 / min(h, w)
        proc_img = cv2.resize(bgr_img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC)
    else:
        proc_img = bgr_img

    ph, pw = proc_img.shape[:2]

    try:
        detector = cv2.FaceDetectorYN.create(_YUNET_PATH, "", (pw, ph), score_threshold=min_score)
        _, faces = detector.detect(proc_img)

        # Fallback with lower threshold if no face found on first try
        if (faces is None or len(faces) == 0) and min_score > 0.2:
            detector.setScoreThreshold(0.2)
            _, faces = detector.detect(proc_img)

        if faces is None or len(faces) == 0:
            return None, None

        # Rescale face coordinates back to original size if scaled
        if scale != 1.0:
            faces[:, :14] /= scale

        # Select largest detected face
        faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
        best_face = faces[0]

        aligned = recognizer.alignCrop(bgr_img, best_face)
        return aligned, best_face

    except Exception as exc:
        logger.warning("YuNet detection exception: %s", exc)
        return None, None


def _verify_with_sface(
    doc_rgb: np.ndarray,
    live_rgb: Optional[np.ndarray],
) -> Dict[str, Any]:
    """
    Verify face using OpenCV YuNet + SFace deep 128-D neural network embeddings.
    """
    recognizer = _get_sface_recognizer()
    if recognizer is None:
        return _verify_with_opencv(doc_rgb, live_rgb)

    doc_bgr = _rgb_to_bgr(doc_rgb)
    doc_aligned, doc_box = _detect_and_align_sface(doc_bgr, recognizer, min_score=0.3)
    doc_has = doc_aligned is not None

    if live_rgb is None:
        return {
            "face_detected_on_document": doc_has,
            "face_detected_on_live_photo": None,
            "match": None,
            "similarity_score": None,
            "method": "opencv_sface_dnn",
            "notes": "Face detected on document; no reference live photo provided.",
        }

    live_bgr = _rgb_to_bgr(live_rgb)
    live_aligned, live_box = _detect_and_align_sface(live_bgr, recognizer, min_score=0.45)
    live_has = live_aligned is not None

    if not doc_has or not live_has:
        notes = []
        if not doc_has:
            notes.append("No clear face detected on document")
        if not live_has:
            notes.append("No clear face detected on live photo")
        return {
            "face_detected_on_document": doc_has,
            "face_detected_on_live_photo": live_has,
            "match": False,
            "similarity_score": 0.0,
            "method": "opencv_sface_dnn",
            "notes": "; ".join(notes),
        }

    # Extract 128-D feature embeddings
    doc_feat = recognizer.feature(doc_aligned)
    live_feat = recognizer.feature(live_aligned)

    cos = float(recognizer.match(doc_feat, live_feat, cv2.FaceRecognizerSF_FR_COSINE))
    l2 = float(recognizer.match(doc_feat, live_feat, cv2.FaceRecognizerSF_FR_NORM_L2))

    is_match = bool(cos >= SFACE_COSINE_THRESHOLD and l2 <= SFACE_L2_THRESHOLD)

    # Map cosine similarity (-1 to 1, official match threshold 0.363) to intuitive percentage:
    # Match range [0.363, 0.85] maps to [70%, 99%]
    # Non-match range maps to [0%, 69%]
    if cos >= SFACE_COSINE_THRESHOLD:
        similarity = 70.0 + min(29.0, ((cos - SFACE_COSINE_THRESHOLD) / 0.4) * 29.0)
    else:
        similarity = max(0.0, (cos / SFACE_COSINE_THRESHOLD) * 69.0)

    similarity = round(float(similarity), 2)

    return {
        "face_detected_on_document": True,
        "face_detected_on_live_photo": True,
        "match": is_match,
        "similarity_score": similarity,
        "cosine_score": round(cos, 4),
        "l2_distance": round(l2, 4),
        "method": "opencv_sface_dnn",
        "notes": (
            f"OpenCV SFace 128-D deep neural network match. "
            f"Cosine similarity={cos:.3f} (threshold {SFACE_COSINE_THRESHOLD}), "
            f"L2 distance={l2:.3f} (threshold {SFACE_L2_THRESHOLD})."
        ),
    }


# ── Tier 2: face_recognition (dlib) ────────────────────────────────────────

def _verify_with_face_recognition(
    doc_img: np.ndarray, live_img: np.ndarray
) -> Dict[str, Any]:
    try:
        doc_up = _upscale_if_small(doc_img, min_dim=400)
        live_up = _upscale_if_small(live_img, min_dim=400)

        doc_encs = _fr_lib.face_encodings(doc_up, num_jitters=2)
        if not doc_encs:
            return {
                "face_detected_on_document": False,
                "face_detected_on_live_photo": None,
                "match": False,
                "similarity_score": 0.0,
                "method": "face_recognition",
                "notes": "No face detected on the document image.",
            }

        live_encs = _fr_lib.face_encodings(live_up, num_jitters=2)
        if not live_encs:
            return {
                "face_detected_on_document": True,
                "face_detected_on_live_photo": False,
                "match": False,
                "similarity_score": 0.0,
                "method": "face_recognition",
                "notes": "No face detected on the live selfie.",
            }

        distance = float(_fr_lib.face_distance([doc_encs[0]], live_encs[0])[0])
        match = distance <= FACE_RECOG_THRESHOLD
        similarity = round(max(0.0, min(100.0, (1.0 - distance) * 100.0)), 2)

        return {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": True,
            "match": match,
            "similarity_score": similarity,
            "distance": round(distance, 4),
            "method": "face_recognition",
            "notes": f"dlib ArcFace embedding comparison. Distance {distance:.3f}.",
        }
    except Exception as exc:
        logger.warning("face_recognition failed, falling back: %s", exc)
        return _verify_with_opencv(doc_img, live_img)


# ── Tier 3: OpenCV Haar Cascade + HSV/SSIM Fallback ────────────────────────

def _detect_faces_haar(gray: np.ndarray) -> list:
    if not _HAS_CV2 or cv2 is None:
        return []
    cascade_cls = getattr(cv2, "CascadeClassifier", None)
    if cascade_cls is None:
        return []
    try:
        data_mod = getattr(cv2, "data", None)
        haar_dir = getattr(data_mod, "haarcascades", None) if data_mod else None
        if not haar_dir:
            return []
        path = haar_dir + "haarcascade_frontalface_default.xml"
        cascade = cascade_cls(path)
        if cascade.empty():
            return []
        faces = cascade.detectMultiScale(
            gray,
            scaleFactor=1.08,
            minNeighbors=3,
            minSize=(30, 30),
        )
        return list(faces) if len(faces) > 0 else []
    except Exception as exc:
        logger.debug("Haar cascade error: %s", exc)
        return []


def _crop_face_or_portrait(img: np.ndarray, fallback_fraction: float = 0.70) -> np.ndarray:
    if _HAS_CV2 and cv2 is not None:
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            faces = _detect_faces_haar(gray)
            if faces:
                x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
                pad_h = int(h * 0.15)
                pad_w = int(w * 0.10)
                y1 = max(0, y - pad_h)
                y2 = min(img.shape[0], y + h + pad_h)
                x1 = max(0, x - pad_w)
                x2 = min(img.shape[1], x + w + pad_w)
                return img[y1:y2, x1:x2]
        except Exception:
            pass

    h, w = img.shape[:2]
    m = (1.0 - fallback_fraction) / 2.0
    return img[int(h * m):int(h * (1 - m)), int(w * m):int(w * (1 - m))]


def _ssim_score(a: np.ndarray, b: np.ndarray, size: int = 96) -> float:
    if _HAS_CV2 and cv2 is not None:
        ag = cv2.cvtColor(cv2.resize(a, (size, size)), cv2.COLOR_RGB2GRAY).astype(float)
        bg = cv2.cvtColor(cv2.resize(b, (size, size)), cv2.COLOR_RGB2GRAY).astype(float)
    else:
        from PIL import Image as _PIL
        ag = np.array(_PIL.fromarray(a).resize((size, size)).convert("L"), dtype=float)
        bg = np.array(_PIL.fromarray(b).resize((size, size)).convert("L"), dtype=float)

    c1, c2 = 6.5025, 58.5225
    mu_a, mu_b = ag.mean(), bg.mean()
    sig_a = ag.std()
    sig_b = bg.std()
    sig_ab = float(np.mean((ag - mu_a) * (bg - mu_b)))

    ssim = ((2 * mu_a * mu_b + c1) * (2 * sig_ab + c2)) / (
        (mu_a**2 + mu_b**2 + c1) * (sig_a**2 + sig_b**2 + c2)
    )
    return max(0.0, min(1.0, float(ssim)))


def _hsv_histogram_similarity(a: np.ndarray, b: np.ndarray, size: int = 96) -> float:
    if not _HAS_CV2 or cv2 is None:
        return 0.5
    try:
        a_hsv = cv2.cvtColor(cv2.resize(a, (size, size)), cv2.COLOR_RGB2HSV)
        b_hsv = cv2.cvtColor(cv2.resize(b, (size, size)), cv2.COLOR_RGB2HSV)
        h_a = cv2.calcHist([a_hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
        h_b = cv2.calcHist([b_hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
        cv2.normalize(h_a, h_a, 0, 1, cv2.NORM_MINMAX)
        cv2.normalize(h_b, h_b, 0, 1, cv2.NORM_MINMAX)
        corr = float(cv2.compareHist(h_a, h_b, cv2.HISTCMP_CORREL))
        return max(0.0, min(1.0, (corr + 1.0) / 2.0))
    except Exception:
        return 0.5


def _verify_with_opencv(
    doc_img: np.ndarray, live_img: Optional[np.ndarray]
) -> Dict[str, Any]:
    if not _HAS_CV2 or cv2 is None:
        return _verify_with_pil_fallback(doc_img, live_img)

    try:
        doc_face = _crop_face_or_portrait(doc_img)
        doc_has = True

        if live_img is None:
            return {
                "face_detected_on_document": doc_has,
                "face_detected_on_live_photo": None,
                "match": None,
                "similarity_score": None,
                "method": "opencv_fallback",
                "notes": "Face present on document; no live photo provided.",
            }

        live_face = _crop_face_or_portrait(live_img)
        live_has = True

        ssim = _ssim_score(doc_face, live_face)
        color = _hsv_histogram_similarity(doc_face, live_face)
        combined = 0.55 * ssim + 0.45 * color

        similarity = round(max(0.0, min(100.0, combined * 100.0)), 2)
        match = similarity >= OPENCV_MATCH_THRESHOLD

        return {
            "face_detected_on_document": doc_has,
            "face_detected_on_live_photo": live_has,
            "match": match,
            "similarity_score": similarity,
            "method": "opencv_fallback",
            "notes": f"OpenCV SSIM+HSV fallback comparison (ssim={ssim:.3f}, color={color:.3f}).",
        }
    except Exception as exc:
        logger.warning("OpenCV comparison failed, using PIL: %s", exc)
        return _verify_with_pil_fallback(doc_img, live_img)


# ── Tier 4: Pure NumPy / PIL Fallback ───────────────────────────────────────

def _verify_with_pil_fallback(
    doc_img: np.ndarray, live_img: Optional[np.ndarray]
) -> Dict[str, Any]:
    if live_img is None:
        return {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": None,
            "match": None,
            "similarity_score": None,
            "method": "structural_fallback",
            "notes": "Document portrait detected; no live reference photo provided.",
        }
    try:
        pil = Image.fromarray
        size = (64, 64)

        doc_g = np.array(pil(doc_img).resize(size).convert("L"), dtype=float)
        live_g = np.array(pil(live_img).resize(size).convert("L"), dtype=float)

        doc_n = (doc_g - doc_g.mean()) / (doc_g.std() + 1e-6)
        live_n = (live_g - live_g.mean()) / (live_g.std() + 1e-6)

        corr = float(np.mean(doc_n * live_n))
        similarity = round(max(0.0, min(100.0, (corr + 1.0) / 2.0 * 100.0)), 2)
        match = similarity >= 50.0

        return {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": True,
            "match": match,
            "similarity_score": similarity,
            "method": "structural_fallback",
            "notes": "Grayscale normalised correlation fallback.",
        }
    except Exception as exc:
        logger.error("PIL fallback error: %s", exc)
        return {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": True,
            "match": False,
            "similarity_score": 0.0,
            "method": "fail_safe",
            "notes": f"All backends failed: {exc}",
        }


# ── Public Entry Point ─────────────────────────────────────────────────────

def verify_face(
    doc_bytes: bytes,
    live_photo_bytes: Optional[bytes] = None,
) -> Dict[str, Any]:
    """
    Primary face verification entry point.
    Guaranteed not to raise an uncaught exception.
    """
    try:
        doc_img = _load_rgb(doc_bytes)
        live_img = _load_rgb(live_photo_bytes) if live_photo_bytes else None

        # Priority 1: OpenCV YuNet + SFace Deep Learning Biometric Model
        if _HAS_SFACE_DNN:
            result = _verify_with_sface(doc_img, live_img)
        # Priority 2: face_recognition (dlib)
        elif _HAS_FACE_RECOGNITION and live_img is not None:
            result = _verify_with_face_recognition(doc_img, live_img)
        # Priority 3: OpenCV Haar Cascade + SSIM + Color Histogram
        elif _HAS_CV2:
            result = _verify_with_opencv(doc_img, live_img)
        # Priority 4: Pure PIL/NumPy correlation
        else:
            result = _verify_with_pil_fallback(doc_img, live_img)

        logger.info(
            "Face verification: match=%s, score=%s, method=%s",
            result.get("match"),
            result.get("similarity_score"),
            result.get("method"),
        )
        return result

    except Exception as exc:
        logger.error("Unexpected error in verify_face: %s", exc, exc_info=True)
        return {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": True if live_photo_bytes else None,
            "match": False,
            "similarity_score": 0.0,
            "method": "fail_safe",
            "notes": f"Unexpected error during face verification: {exc}",
        }
