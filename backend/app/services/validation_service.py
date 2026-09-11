"""
Validation service.
Performs rules-based sanity checks on extracted OCR metadata.
"""

import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger("trustid.validation")

REQUIRED_FIELDS = ["document_number", "name", "date_of_birth"]
MIN_OCR_CONFIDENCE = 60.0


def _parse_date(date_str: str):
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None


def validate_document(ocr_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate OCR output fields, confidence, and date plausibility.
    """
    issues = []

    # 1. Required fields check
    missing = [f for f in REQUIRED_FIELDS if not ocr_data.get(f)]
    fields_present = len(missing) == 0
    if missing:
        issues.append(f"Missing fields: {', '.join(missing)}")

    # 2. OCR confidence threshold
    confidence = ocr_data.get("ocr_confidence", 0.0)
    ocr_confidence_ok = confidence >= MIN_OCR_CONFIDENCE
    if not ocr_confidence_ok:
        issues.append(f"Low OCR confidence ({confidence}%), extracted fields may be unreliable")

    # 3. DOB plausibility
    dob_plausible = False
    dob_raw = ocr_data.get("date_of_birth")
    if dob_raw:
        dob = _parse_date(dob_raw)
        if dob is None:
            issues.append(f"Unparseable date of birth: '{dob_raw}'")
        else:
            now = datetime.now()
            age_years = (now - dob).days / 365.25
            if dob > now:
                issues.append("Date of birth is in the future")
            elif age_years < 0 or age_years > 120:
                issues.append(f"Date of birth implies impossible age ({age_years:.0f} years)")
            else:
                dob_plausible = True
    else:
        issues.append("Date of birth not extracted, cannot check plausibility")

    is_valid = len(issues) == 0

    return {
        "is_valid": is_valid,
        "issues": issues,
        "checks": {
            "fields_present": fields_present,
            "ocr_confidence_ok": ocr_confidence_ok,
            "dob_plausible": dob_plausible,
        },
    }
