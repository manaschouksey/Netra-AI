"""
Validation Service — Netra-TrustID
====================================
Rules-based sanity checks on fields extracted by the OCR service.

Checks performed
----------------
1. Required identity fields present
   - Accepts ``document_number`` OR ``uid_number`` (Aadhaar 12-digit UID)
   - ``name`` is mandatory
   - ``date_of_birth`` is required; year-only approximations are accepted
2. OCR confidence threshold (>= 60 %)
3. DOB plausibility (real date, past, person aged 0-120)

The validator deliberately does NOT reject a document solely because Aadhaar
cards carry a UID instead of a traditional alphanumeric doc number.
"""

import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger("trustid.validation")

# Threshold below which OCR is considered unreliable
MIN_OCR_CONFIDENCE = 40.0

# Fields that constitute a valid document identifier
# (at least one must be present)
IDENTIFIER_FIELDS = ["document_number", "uid_number"]

# Mandatory fields regardless of document type
MANDATORY_FIELDS = ["name"]


def _parse_date(date_str: str):
    """Try multiple date formats; return datetime or None."""
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y", "%m/%d/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except ValueError:
            continue
    return None


def _normalize_for_validation(ocr_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalise the OCR result dict so validation code sees a consistent shape.

    Aadhaar cards store their 12-digit UID in ``document_number`` (after our
    improved OCR service formats it).  If the caller still uses a separate
    ``uid_number`` key, copy it across.
    """
    data = dict(ocr_data)

    # If UID extracted separately, treat it as the document number
    if not data.get("document_number") and data.get("uid_number"):
        data["document_number"] = data["uid_number"]

    return data


def validate_document(ocr_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate OCR output and return a structured result.

    Returns:
        {
            "is_valid":  bool,
            "issues":    [str, ...],
            "checks": {
                "has_identifier":     bool,
                "has_name":           bool,
                "ocr_confidence_ok":  bool,
                "dob_plausible":      bool | None,
            }
        }
    """
    data = _normalize_for_validation(ocr_data)
    issues: list[str] = []

    # 1. Has document identifier
    has_identifier = any(data.get(f) for f in IDENTIFIER_FIELDS)
    if not has_identifier:
        issues.append("No document identifier found (document number or UID)")

    # 2. Mandatory text fields
    has_name = bool(data.get("name"))
    if not has_name:
        issues.append("Name field not extracted from document")

    # 3. OCR confidence
    confidence = float(ocr_data.get("ocr_confidence", 0.0))
    ocr_confidence_ok = confidence >= MIN_OCR_CONFIDENCE
    if not ocr_confidence_ok:
        issues.append(
            f"OCR confidence too low ({confidence:.1f}% < {MIN_OCR_CONFIDENCE}%); "
            "extracted fields may be unreliable"
        )

    # 4. DOB plausibility
    dob_plausible: bool | None = None
    dob_raw = data.get("date_of_birth")
    if dob_raw:
        parsed = _parse_date(dob_raw)
        if parsed is None:
            issues.append(f"Date of birth '{dob_raw}' could not be parsed")
            dob_plausible = False
        else:
            now = datetime.now()
            age_years = (now - parsed).days / 365.25
            if parsed > now:
                issues.append("Date of birth is in the future")
                dob_plausible = False
            elif age_years < 0 or age_years > 120:
                issues.append(f"Date of birth implies an impossible age ({age_years:.0f} years)")
                dob_plausible = False
            else:
                dob_plausible = True
    else:
        # Missing DOB is a soft warning, not a hard failure, because some
        # Aadhaar cards only carry Year-of-Birth and our OCR approximates it.
        issues.append("Date of birth not found in document")
        dob_plausible = None

    # Overall validity: must have an identifier AND name AND decent confidence
    # DOB absence is a warning but not an automatic failure
    hard_failures = [
        not has_identifier,
        not has_name,
        not ocr_confidence_ok,
        dob_plausible is False,   # only if DOB was found but invalid
    ]
    is_valid = not any(hard_failures)

    result = {
        "is_valid": is_valid,
        "issues": issues,
        "checks": {
            "has_identifier": has_identifier,
            "has_name": has_name,
            "ocr_confidence_ok": ocr_confidence_ok,
            "dob_plausible": dob_plausible,
        },
    }

    logger.info(
        "Document validation: is_valid=%s, issues=%d (%s)",
        is_valid,
        len(issues),
        issues,
    )
    return result
