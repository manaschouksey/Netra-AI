"""
OCR Service.
Uses Tesseract (pytesseract) to extract raw text from document image,
and applies regex heuristics to extract structured fields.
"""

import io
import re
import logging
from typing import Dict, Any

import numpy as np
from PIL import Image

try:
    import pytesseract
except ImportError:  # pragma: no cover
    pytesseract = None

try:
    import cv2
except ImportError:  # pragma: no cover
    cv2 = None

logger = logging.getLogger("trustid.ocr")

DOC_NUMBER_PATTERN = re.compile(r"\b([A-Z]{1,2}\d{6,9})\b")
DOB_PATTERN = re.compile(r"\b(\d{2}[\/\-.]\d{2}[\/\-.]\d{4})\b")
NAME_LINE_PATTERN = re.compile(r"(?:NAME|Name)[:\s]+([A-Za-z\s]{3,40})")


def _load_image(doc_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(doc_bytes)).convert("RGB")
    return np.array(image)


def _preprocess(img: np.ndarray) -> np.ndarray:
    """Basic preprocessing to improve OCR accuracy: grayscale + adaptive threshold."""
    if cv2 is None:
        return img
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 11
    )
    return thresh


def _guess_document_type(filename: str, text: str) -> str:
    text_upper = text.upper()
    if "PASSPORT" in text_upper:
        return "Passport"
    if "DRIVING" in text_upper or "LICENCE" in text_upper or "LICENSE" in text_upper:
        return "Driving Licence"
    if "AADHAAR" in text_upper or "AADHAR" in text_upper:
        return "Aadhaar Card"
    if "PAN" in text_upper:
        return "PAN Card"
    return "Passport / ID"


def extract_text(doc_bytes: bytes, filename: str = "") -> Dict[str, Any]:
    """
    Extract raw text and structured fields from a document image.
    """
    if pytesseract is None:
        logger.warning("pytesseract is not installed. Returning fallback mock OCR output.")
        return {
            "raw_text": f"MOCK SCAN FOR {filename}",
            "document_type": _guess_document_type(filename, filename),
            "document_number": "DOC-9823412",
            "name": "SAMPLE CITIZEN",
            "date_of_birth": "01/01/1990",
            "ocr_confidence": 88.5,
        }

    try:
        img = _load_image(doc_bytes)
        processed = _preprocess(img)

        raw_text = pytesseract.image_to_string(processed)
        data = pytesseract.image_to_data(processed, output_type=pytesseract.Output.DICT)
        confidences = [
            int(c)
            for c in data.get("conf", [])
            if str(c).lstrip("-").isdigit() and int(c) >= 0
        ]
        ocr_confidence = (
            round(sum(confidences) / len(confidences), 2) if confidences else 0.0
        )

        doc_number_match = DOC_NUMBER_PATTERN.search(raw_text)
        dob_match = DOB_PATTERN.search(raw_text)
        name_match = NAME_LINE_PATTERN.search(raw_text)

        result = {
            "raw_text": raw_text.strip(),
            "document_type": _guess_document_type(filename, raw_text),
            "document_number": doc_number_match.group(1) if doc_number_match else None,
            "name": name_match.group(1).strip() if name_match else None,
            "date_of_birth": dob_match.group(1) if dob_match else None,
            "ocr_confidence": ocr_confidence,
        }

        logger.info(
            "OCR extracted fields: doc_number=%s, confidence=%s",
            result["document_number"],
            result["ocr_confidence"],
        )
        return result
    except Exception as exc:
        logger.exception("OCR extraction encountered an error: %s", exc)
        raise
