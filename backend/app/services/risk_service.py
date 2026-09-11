"""
Risk scoring service.
Combines OCR / validation / tampering / face-verification into a single 0-100 risk score.
"""

import logging
from typing import Dict, Any

logger = logging.getLogger("trustid.risk_score")

WEIGHT_VALIDATION = 0.30
WEIGHT_TAMPERING = 0.40
WEIGHT_FACE_MATCH = 0.30

REJECT_THRESHOLD = 70
REVIEW_THRESHOLD = 35


def _validation_risk(validation_data: Dict[str, Any]) -> float:
    """0 = no risk, 100 = max risk based on validation issues."""
    if validation_data.get("is_valid"):
        return 0.0
    issue_count = len(validation_data.get("issues", []))
    return min(100.0, issue_count * 25.0)


def _tampering_risk(tamper_data: Dict[str, Any]) -> float:
    """Tamper score is already 0-100 risk, pass through directly."""
    return float(tamper_data.get("tamper_score", 0.0))


def _face_match_risk(face_data: Dict[str, Any]) -> float:
    """0 = confirmed match, 100 = confirmed mismatch."""
    match = face_data.get("match")
    similarity = face_data.get("similarity_score")

    if match is None or similarity is None:
        return 20.0  # mild uncertainty penalty

    return round(max(0.0, 100.0 - similarity), 2)


def calculate_risk(
    ocr_data: Dict[str, Any],
    validation_data: Dict[str, Any],
    tamper_data: Dict[str, Any],
    face_data: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Compute composite weighted risk score and recommendation.
    """
    validation_risk = _validation_risk(validation_data)
    tampering_risk = _tampering_risk(tamper_data)
    face_match_risk = _face_match_risk(face_data)

    composite_score = (
        validation_risk * WEIGHT_VALIDATION
        + tampering_risk * WEIGHT_TAMPERING
        + face_match_risk * WEIGHT_FACE_MATCH
    )
    score_int = int(round(composite_score))

    if score_int >= REJECT_THRESHOLD:
        recommendation = "Reject"
    elif score_int >= REVIEW_THRESHOLD:
        recommendation = "Manual Review"
    else:
        recommendation = "Approve"

    result = {
        "score": score_int,
        "recommendation": recommendation,
        "breakdown": {
            "validation_risk": round(validation_risk, 2),
            "tampering_risk": round(tampering_risk, 2),
            "face_match_risk": round(face_match_risk, 2),
        },
    }

    logger.info(
        "Risk score computed: score=%s (%s), breakdown=%s",
        score_int,
        recommendation,
        result["breakdown"],
    )
    return result
