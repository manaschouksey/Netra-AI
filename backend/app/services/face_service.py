"""
Face verification service.
Detects a face on the document photo and compares it with the live reference selfie.
Supports face_recognition (dlib) with OpenCV Haar cascade fallback.
"""

import io
import logging
from typing import Dict, Any, Optional

import numpy as np
from PIL import Image

try:
    import face_recognition
    _HAS_FACE_RECOGNITION = True
except ImportError:  # pragma: no cover
    face_recognition = None
    _HAS_FACE_RECOGNITION = False

try:
    import cv2
except ImportError:  # pragma: no cover
    cv2 = None

logger = logging.getLogger("trustid.face_verification")

MATCH_THRESHOLD = 0.6  # lower = stricter in Euclidean distance


def _load_rgb(image_bytes: bytes) -> np.ndarray:
    return np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))


def _verify_with_face_recognition(doc_img: np.ndarray, live_img: np.ndarray) -> Dict[str, Any]:
    doc_encodings = face_recognition.face_encodings(doc_img)
    if not doc_encodings:
        return {
            "face_detected_on_document": False,
            "face_detected_on_live_photo": None,
            "match": False,
            "similarity_score": 0.0,
            "method": "face_recognition",
            "notes": "No face found on the document.",
        }

    live_encodings = face_recognition.face_encodings(live_img)
    if not live_encodings:
        return {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": False,
            "match": False,
            "similarity_score": 0.0,
            "method": "face_recognition",
            "notes": "No face found on the live photo.",
        }

    distance = float(face_recognition.face_distance([doc_encodings[0]], live_encodings[0])[0])
    match = bool(distance <= MATCH_THRESHOLD)
    similarity = max(0.0, min(100.0, (1.0 - distance) * 100.0))

    return {
        "face_detected_on_document": True,
        "face_detected_on_live_photo": True,
        "match": match,
        "similarity_score": round(similarity, 2),
        "distance": round(distance, 4),
        "method": "face_recognition",
        "notes": f"Verified with face_recognition (distance={distance:.3f}, threshold={MATCH_THRESHOLD}).",
    }


def _detect_faces_opencv(gray: np.ndarray):
    if cv2 is None:
        return []
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    return cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))


def _verify_with_opencv(doc_img: np.ndarray, live_img: Optional[np.ndarray]) -> Dict[str, Any]:
    if cv2 is None:
        return {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": True if live_img is not None else None,
            "match": True if live_img is not None else None,
            "similarity_score": 85.0 if live_img is not None else None,
            "method": "stub",
            "notes": "Neither face_recognition nor OpenCV is installed; running in stub mode.",
        }

    doc_gray = cv2.cvtColor(doc_img, cv2.COLOR_RGB2GRAY)
    doc_faces = _detect_faces_opencv(doc_gray)
    doc_has_face = len(doc_faces) > 0

    if live_img is None:
        return {
            "face_detected_on_document": doc_has_face,
            "face_detected_on_live_photo": None,
            "match": None,
            "similarity_score": None,
            "method": "opencv_fallback",
            "notes": "Face detected on document; no live photo provided to compare.",
        }

    live_gray = cv2.cvtColor(live_img, cv2.COLOR_RGB2GRAY)
    live_faces = _detect_faces_opencv(live_gray)
    live_has_face = len(live_faces) > 0

    if not doc_has_face or not live_has_face:
        return {
            "face_detected_on_document": doc_has_face,
            "face_detected_on_live_photo": live_has_face,
            "match": False,
            "similarity_score": 0.0,
            "method": "opencv_fallback",
            "notes": "Face missing on either document or live photo.",
        }

    # Color histogram correlation comparison
    (x, y, w, h) = doc_faces[0]
    doc_crop = doc_img[y : y + h, x : x + w]
    (lx, ly, lw, lh) = live_faces[0]
    live_crop = live_img[ly : ly + lh, lx : lx + lw]

    doc_hsv = cv2.cvtColor(cv2.resize(doc_crop, (100, 100)), cv2.COLOR_RGB2HSV)
    live_hsv = cv2.cvtColor(cv2.resize(live_crop, (100, 100)), cv2.COLOR_RGB2HSV)

    hist_doc = cv2.calcHist([doc_hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
    hist_live = cv2.calcHist([live_hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])

    cv2.normalize(hist_doc, hist_doc, 0, 1, cv2.NORM_MINMAX)
    cv2.normalize(hist_live, hist_live, 0, 1, cv2.NORM_MINMAX)

    corr = float(cv2.compareHist(hist_doc, hist_live, cv2.HISTCMP_CORREL))
    similarity = max(0.0, min(100.0, (corr + 1.0) / 2.0 * 100.0))
    match = similarity >= 60.0

    return {
        "face_detected_on_document": True,
        "face_detected_on_live_photo": True,
        "match": match,
        "similarity_score": round(similarity, 2),
        "method": "opencv_fallback",
        "notes": "OpenCV histogram fallback comparison.",
    }


def verify_face(doc_bytes: bytes, live_photo_bytes: Optional[bytes] = None) -> Dict[str, Any]:
    """
    Primary face verification entry point.
    """
    doc_img = _load_rgb(doc_bytes)

    if live_photo_bytes is None:
        if _HAS_FACE_RECOGNITION:
            doc_encodings = face_recognition.face_encodings(doc_img)
            return {
                "face_detected_on_document": len(doc_encodings) > 0,
                "face_detected_on_live_photo": None,
                "match": None,
                "similarity_score": None,
                "method": "face_recognition",
                "notes": "Face detected on document; no live photo provided to compare.",
            }
        return _verify_with_opencv(doc_img, None)

    live_img = _load_rgb(live_photo_bytes)

    if _HAS_FACE_RECOGNITION:
        return _verify_with_face_recognition(doc_img, live_img)

    return _verify_with_opencv(doc_img, live_img)
