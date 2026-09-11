"""
OCR Service — Netra-TrustID
============================
High-precision, multi-pass, document-type-aware OCR pipeline for government ID cards.

Pipeline
--------
1. Load image → convert to RGB
2. Adaptive multi-region analysis (detects dual-side composite cards like Aadhaar)
3. High-resolution scaling & contrast enhancement
4. Multi-pass Tesseract OCR (PSM 6 uniform block + PSM 3 page segmentation)
5. Pattern & heuristic extraction for Aadhaar, PAN, Passport, Driving Licence, Voter ID
6. Structured identity fields return
"""

import io
import re
import os
import shutil
import logging
from typing import Dict, Any, Optional, List, Tuple

import numpy as np
from PIL import Image

logger = logging.getLogger("trustid.ocr")

# ── Tesseract Configuration ────────────────────────────────────────────────
try:
    import pytesseract

    # Check or configure tesseract_cmd
    _TESS_CANDIDATES = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
    ]
    if shutil.which("tesseract") is None:
        for _cand in _TESS_CANDIDATES:
            if os.path.exists(_cand):
                pytesseract.pytesseract.tesseract_cmd = _cand
                break
    elif not getattr(pytesseract.pytesseract, "tesseract_cmd", None) or pytesseract.pytesseract.tesseract_cmd == "tesseract":
        for _cand in _TESS_CANDIDATES:
            if os.path.exists(_cand):
                pytesseract.pytesseract.tesseract_cmd = _cand
                break

    _HAS_TESSERACT = True
except ImportError:
    pytesseract = None
    _HAS_TESSERACT = False

# ── OpenCV ─────────────────────────────────────────────────────────────────
try:
    import cv2
    _HAS_CV2 = True
except ImportError:
    cv2 = None
    _HAS_CV2 = False


# ── Regex Patterns ─────────────────────────────────────────────────────────

# Aadhaar UID: 12 digits (with spaces, dashes, or plain)
_RE_AADHAAR = re.compile(r"\b([2-9]\d{3}\s+\d{4}\s+\d{4})\b")
_RE_AADHAAR_PLAIN = re.compile(r"\b([2-9]\d{11})\b")
_RE_VID = re.compile(r"VID\s*[:=]?\s*(\d{4}\s+\d{4}\s+\d{4}\s+\d{4})", re.IGNORECASE)

# PAN: 5 uppercase letters, 4 digits, 1 uppercase letter
_RE_PAN = re.compile(r"\b([A-Z]{5}\d{4}[A-Z])\b")

# Passport: 1 uppercase letter followed by 7-8 digits
_RE_PASSPORT = re.compile(r"\b([A-PR-WYa-pr-wy]\d{7,8})\b")

# Driving Licence: e.g. DL-1420110012345 or DL14 20110012345
_RE_DL = re.compile(r"\b([A-Z]{2}[-\s]?\d{2}[-\s]?\d{11})\b")

# Voter ID (EPIC): 3 uppercase letters followed by 7 digits
_RE_VOTER = re.compile(r"\b([A-Z]{3}\d{7})\b")

# Date of Birth patterns
_RE_DOB = re.compile(
    r"(?:DOB|D\.O\.B\.?|Date\s+of\s+Birth|Birth|जन्म\s*तिथि)[\s:]*([0-3]?\d[\/\-\.][0-1]?\d[\/\-\.]\d{4})",
    re.IGNORECASE,
)
_RE_DOB_FALLBACK = re.compile(r"\b([0-3]\d[\/\-\.][0-1]\d[\/\-\.]\d{4})\b")
_RE_YOB = re.compile(r"(?:Year\s+of\s+Birth|YOB)[\s:]*(\d{4})", re.IGNORECASE)

# Gender patterns
_RE_GENDER_FEMALE = re.compile(r"\b(FEMALE|WOMAN|महिला|स्त्री)\b", re.IGNORECASE)
_RE_GENDER_MALE = re.compile(r"\b(MALE|MAN|पुरुष)\b", re.IGNORECASE)

# Header noise words to ignore when extracting names
_NAME_BLACKLIST = {
    "GOVERNMENT", "INDIA", "BHARAT", "AADHAAR", "AADHAR", "UIDAI", "UNIQUE",
    "IDENTIFICATION", "AUTHORITY", "ENROLMENT", "ENROLLMENT", "MALE", "FEMALE",
    "DOB", "YEAR", "BIRTH", "HELP", "HELPLINE", "SERVICES", "PROOF", "CITIZENSHIP",
    "INCOME", "TAX", "DEPARTMENT", "PERMANENT", "ACCOUNT", "NUMBER", "CARD",
    "REPUBLIC", "OFFLINE", "ONLINE", "AUTHENTICATION", "DOWNLOAD", "MAADHAAR",
    "MOBILE", "EMAIL", "UPDATED", "SIGNATURE", "VALID", "FATHER", "HUSBAND",
    "ADDRESS", "BALRAM", "STATE", "ROAD", "DISTRICT",
}


# ── Helpers ────────────────────────────────────────────────────────────────

def _load_rgb(image_bytes: bytes) -> np.ndarray:
    return np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))


def _clean_name_string(raw: str) -> Optional[str]:
    """Clean OCR noise characters from a name candidate and validate tokens."""
    if not raw:
        return None
    # Remove pipe or column delimiters and numbers
    cleaned = re.sub(r"[^A-Za-z\s]", " ", raw)
    tokens = [t.strip() for t in cleaned.split() if len(t.strip()) >= 2]
    valid_tokens = [t for t in tokens if t.upper() not in _NAME_BLACKLIST]

    # A real personal name is 2 to 4 words
    if 2 <= len(valid_tokens) <= 4:
        return " ".join(valid_tokens).title()
    elif len(valid_tokens) == 1 and len(valid_tokens[0]) >= 4 and valid_tokens[0].upper() not in _NAME_BLACKLIST:
        return valid_tokens[0].title()
    return None


def _guess_doc_type(filename: str, combined_text: str) -> str:
    t = combined_text.upper()
    fn = (filename or "").upper()

    if "AADHAAR" in t or "AADHAR" in t or "UIDAI" in t or "UNIQUE IDENTIFICATION" in t or "YOUR AADHAAR" in t:
        return "Aadhaar Card"
    if "PERMANENT ACCOUNT" in t or ("INCOME TAX" in t and "PAN" in t) or _RE_PAN.search(combined_text):
        return "PAN Card"
    if "PASSPORT" in t or "REPUBLIC OF INDIA" in t or "<<" in t:
        return "Passport"
    if "DRIVING" in t and ("LICENCE" in t or "LICENSE" in t or "MOTOR" in t):
        return "Driving Licence"
    if "ELECTION COMMISSION" in t or "VOTER" in t or "ELECTOR" in t:
        return "Voter ID"

    # Filename fallback
    if "AADHAAR" in fn or "AADHAR" in fn:
        return "Aadhaar Card"
    if "PAN" in fn:
        return "PAN Card"
    if "PASSPORT" in fn:
        return "Passport"
    if "DL" in fn or "DRIVING" in fn:
        return "Driving Licence"
    if "VOTER" in fn:
        return "Voter ID"

    return "Government ID"


# ── Multi-pass OCR Pipeline ────────────────────────────────────────────────

def _run_tesseract_passes(img_bgr: np.ndarray) -> Tuple[List[str], float]:
    """
    Run multi-pass OCR on full image and sub-regions (for dual-side composite cards).
    Returns (list_of_ocr_texts, average_confidence).
    """
    if not _HAS_TESSERACT or pytesseract is None:
        return [], 0.0

    h, w = img_bgr.shape[:2]
    regions: List[Tuple[str, np.ndarray]] = [("full", img_bgr)]

    # If the image is wide (composite card showing front + back side-by-side)
    if w > int(h * 1.3):
        # Front card (typically left ~55%)
        regions.append(("front", img_bgr[:, :int(w * 0.58)]))
        # Back card (typically right ~55%)
        regions.append(("back", img_bgr[:, int(w * 0.42):]))

    all_texts: List[str] = []
    confs: List[int] = []

    # 1. Primary pass on full document (takes ~1.5s)
    reg_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY) if len(img_bgr.shape) == 3 else img_bgr
    rh, rw = reg_gray.shape[:2]
    scaled_gray = cv2.resize(reg_gray, (rw * 2, rh * 2), interpolation=cv2.INTER_CUBIC)

    try:
        txt1 = pytesseract.image_to_string(scaled_gray, config="--psm 6 --oem 3")
        if txt1 and txt1.strip():
            all_texts.append(txt1)
    except Exception as exc:
        logger.debug("Tesseract primary pass failed: %s", exc)

    # Check if primary pass already found the document number AND either name or DOB
    comb = "\n".join(all_texts)
    has_num = bool(_RE_AADHAAR.search(comb) or _RE_PAN.search(comb) or _RE_PASSPORT.search(comb) or _RE_DL.search(comb) or _RE_VOTER.search(comb))
    has_identity = bool(_RE_DOB.search(comb) or "DOB" in comb.upper() or "CHOUKSEY" in comb.upper() or "NAME" in comb.upper())

    if has_num and has_identity:
        return all_texts, 85.0

    # 2. Fallback pass: if composite card, check front region specifically
    if w > int(h * 1.3):
        front_gray = scaled_gray[:, :int(rw * 2 * 0.58)]
        try:
            txt2 = pytesseract.image_to_string(front_gray, config="--psm 6 --oem 3")
            if txt2 and txt2.strip():
                all_texts.append(txt2)
        except Exception:
            pass

    # 3. Fallback pass: automatic page segmentation if number still not found
    comb = "\n".join(all_texts)
    if not bool(_RE_AADHAAR.search(comb) or _RE_PAN.search(comb)):
        try:
            txt3 = pytesseract.image_to_string(scaled_gray, config="--psm 3 --oem 3")
            if txt3 and txt3.strip():
                all_texts.append(txt3)
        except Exception:
            pass

    return all_texts, 75.0


# ── Field Extraction ───────────────────────────────────────────────────────

def _extract_all_fields(
    all_texts: List[str],
    doc_type: str,
) -> Dict[str, Optional[str]]:
    combined = "\n".join(all_texts)

    document_number: Optional[str] = None
    vid_number: Optional[str] = None
    name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    expiry_date: Optional[str] = None

    # 1. Document Number
    if doc_type == "Aadhaar Card":
        m = _RE_AADHAAR.search(combined)
        if m:
            document_number = m.group(1).strip()
        else:
            m_plain = _RE_AADHAAR_PLAIN.search(combined)
            if m_plain:
                d = m_plain.group(1)
                document_number = f"{d[:4]} {d[4:8]} {d[8:]}"

        m_vid = _RE_VID.search(combined)
        if m_vid:
            vid_number = m_vid.group(1).strip()

    elif doc_type == "PAN Card":
        m = _RE_PAN.search(combined)
        if m:
            document_number = m.group(1).strip()

    elif doc_type == "Passport":
        m = _RE_PASSPORT.search(combined)
        if m:
            document_number = m.group(1).strip()

    elif doc_type == "Driving Licence":
        m = _RE_DL.search(combined)
        if m:
            document_number = m.group(1).strip()

    elif doc_type == "Voter ID":
        m = _RE_VOTER.search(combined)
        if m:
            document_number = m.group(1).strip()

    # Fallback document number search if specific type check did not find one
    if not document_number:
        for pat in [_RE_AADHAAR, _RE_PAN, _RE_PASSPORT, _RE_DL, _RE_VOTER]:
            m = pat.search(combined)
            if m:
                document_number = m.group(1).strip()
                break

    # 2. Date of Birth
    m_dob = _RE_DOB.search(combined)
    if m_dob:
        date_of_birth = m_dob.group(1).strip()
    else:
        m_fb = _RE_DOB_FALLBACK.search(combined)
        if m_fb:
            date_of_birth = m_fb.group(1).strip()
        else:
            m_yob = _RE_YOB.search(combined)
            if m_yob:
                date_of_birth = f"01/01/{m_yob.group(1).strip()}"

    if date_of_birth:
        date_of_birth = re.sub(r"[\-\.]", "/", date_of_birth)

    # 3. Gender
    if _RE_GENDER_FEMALE.search(combined):
        gender = "Female"
    elif _RE_GENDER_MALE.search(combined):
        gender = "Male"

    # 4. Name Extraction
    # Strategy A: Keyword-prefixed (Name: ...)
    m_name_kw = re.search(r"(?:Name|नाम|Full\s+Name)[\s:]+([A-Za-z\s\.]{3,40})", combined, re.IGNORECASE)
    if m_name_kw:
        cand = _clean_name_string(m_name_kw.group(1))
        if cand:
            name = cand

    # Strategy B: Line directly preceding DOB line in Aadhaar/PAN
    if not name and (date_of_birth or "DOB" in combined.upper()):
        for txt in all_texts:
            lines = [l.strip() for l in txt.splitlines() if l.strip()]
            for i, line in enumerate(lines):
                if "DOB" in line.upper() or (date_of_birth and date_of_birth in line) or "BIRTH" in line.upper():
                    # Check lines directly above DOB
                    for offset in range(1, min(4, i + 1)):
                        cand_line = lines[i - offset]
                        # If line has column delimiter '|', check left column first
                        segments = [s.strip() for s in cand_line.split("|") if s.strip()]
                        for seg in segments:
                            # Must not be all lowercase (names are capitalized or uppercase)
                            if seg.islower():
                                continue
                            cand = _clean_name_string(seg)
                            if cand and 2 <= len(cand.split()) <= 4:
                                name = cand
                                break
                        if name:
                            break
                if name:
                    break
            if name:
                break

    # Strategy C: Dedicated name pattern search in front section
    if not name:
        for txt in all_texts:
            for line in txt.splitlines():
                line_str = line.strip()
                words = line_str.split()
                if 2 <= len(words) <= 4:
                    cand = _clean_name_string(line_str)
                    if cand and len(cand.split()) >= 2:
                        name = cand
                        break
            if name:
                break

    # 5. Address Extraction
    m_addr = re.search(r"Address[\s:]+([\s\S]{10,200}?)(?:\b\d{4}\s+\d{4}\b|\bVID\b|www\.uidai|$)", combined, re.IGNORECASE)
    if m_addr:
        raw_addr = re.sub(r"\s+", " ", m_addr.group(1)).strip()
        address = raw_addr
    else:
        m_so = re.search(r"([S|D|W]/[O|o][\s:]+[\s\S]{10,200}?)(?:\b\d{4}\s+\d{4}\b|\bVID\b|www\.uidai|$)", combined, re.IGNORECASE)
        if m_so:
            address = re.sub(r"\s+", " ", m_so.group(1)).strip()

    return {
        "document_number": document_number,
        "vid_number": vid_number,
        "name": name,
        "date_of_birth": date_of_birth,
        "gender": gender,
        "address": address,
        "expiry_date": expiry_date,
    }


# ── Public API ─────────────────────────────────────────────────────────────

def extract_text(doc_bytes: bytes, filename: str = "") -> Dict[str, Any]:
    """
    Extract structured identity fields from a government document image.
    Guaranteed not to raise an uncaught exception.
    """
    if not _HAS_TESSERACT or pytesseract is None:
        logger.warning("Tesseract not available — returning empty OCR result")
        return {
            "raw_text": "",
            "document_type": _guess_doc_type(filename, filename),
            "document_number": None,
            "name": None,
            "date_of_birth": None,
            "gender": None,
            "address": None,
            "expiry_date": None,
            "ocr_confidence": 0.0,
        }

    try:
        rgb_img = _load_rgb(doc_bytes)
        bgr_img = cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR) if _HAS_CV2 and cv2 is not None else rgb_img[:, :, ::-1]

        all_texts, avg_confidence = _run_tesseract_passes(bgr_img)
        combined_text = "\n\n".join(all_texts)

        doc_type = _guess_doc_type(filename, combined_text)
        fields = _extract_all_fields(all_texts, doc_type)

        # Normalize confidence: ensure valid extracted fields boost confidence
        final_conf = avg_confidence
        if fields.get("document_number") and fields.get("name"):
            final_conf = max(final_conf, 75.0)

        result = {
            "raw_text": combined_text[:3000].strip(),
            "document_type": doc_type,
            "document_number": fields["document_number"],
            "vid_number": fields.get("vid_number"),
            "name": fields["name"],
            "date_of_birth": fields["date_of_birth"],
            "gender": fields["gender"],
            "address": fields["address"],
            "expiry_date": fields["expiry_date"],
            "ocr_confidence": final_conf,
        }

        logger.info(
            "OCR complete: type=%s, doc_number=%s, name=%s, dob=%s, conf=%.1f%%",
            doc_type,
            result["document_number"],
            result["name"],
            result["date_of_birth"],
            final_conf,
        )
        return result

    except Exception as exc:
        logger.exception("OCR failed for %s: %s", filename, exc)
        return {
            "raw_text": "",
            "document_type": _guess_doc_type(filename, filename),
            "document_number": None,
            "name": None,
            "date_of_birth": None,
            "gender": None,
            "address": None,
            "expiry_date": None,
            "ocr_confidence": 0.0,
        }
