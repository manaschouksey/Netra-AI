"""
Risk Scoring Service — Netra-TrustID
======================================
Combines OCR / validation / tampering / face-verification results into a
single 0-100 composite risk score and a human-readable recommendation.

Weights
-------
  Tampering    40 %   (highest weight — ELA evidence is hard to fake)
  Face match   35 %   (biometric mismatch is a strong fraud signal)
  Validation   25 %   (rules-based; can legitimately fail on unusual docs)

Thresholds
----------
  score >= 70  →  Reject
  score >= 35  →  Manual Review
  score  < 35  →  Approve
"""

import logging
from typing import Dict, Any

logger = logging.getLogger("trustid.risk_score")

WEIGHT_VALIDATION  = 0.25
WEIGHT_TAMPERING   = 0.40
WEIGHT_FACE_MATCH  = 0.35

REJECT_THRESHOLD = 70
REVIEW_THRESHOLD = 35


def _validation_risk(validation_data: Dict[str, Any]) -> float:
    """
    Convert validation issues into a 0-100 risk contribution.

    Proportional per-issue scoring rather than a flat ×25 multiplier:
      0 issues              →   0 pts
      1 issue (soft)        →  15 pts  (e.g. DOB missing)
      1 issue (hard field)  →  30 pts  (e.g. no identifier)
      2 issues              →  50 pts
      3+ issues             →  75 pts
    """
    if validation_data.get("is_valid"):
        return 0.0

    issues = validation_data.get("issues", [])
    n = len(issues)

    if n == 0:
        return 0.0
    if n == 1:
        # Downweight soft warnings (DOB missing, low confidence) vs hard misses
        issue_text = issues[0].lower()
        if "date of birth not found" in issue_text:
            return 12.0   # very soft — some Aadhaar show YOB only
        if "confidence" in issue_text:
            return 20.0   # moderate — OCR may still have good fields
        return 30.0       # hard field missing
    if n == 2:
        return 50.0
    return min(100.0, 65.0 + (n - 3) * 10.0)


def _tampering_risk(tamper_data: Dict[str, Any]) -> float:
    """Tamper score is already 0-100; pass through directly."""
    return float(tamper_data.get("tamper_score", 0.0))


def _face_match_risk(face_data: Dict[str, Any]) -> float:
    """
    Convert face match result into 0-100 risk.
      - Confirmed match (score >= threshold) → 0
      - No live photo provided               → 15 (mild uncertainty only)
      - Mismatch                             → 100 - score
    """
    match      = face_data.get("match")
    similarity = face_data.get("similarity_score")

    # No live photo provided — mild penalty, not a hard failure
    if match is None or similarity is None:
        return 15.0

    # Penalise proportionally to how far below 100% the score is
    return round(max(0.0, 100.0 - float(similarity)), 2)


def calculate_risk(
    ocr_data:        Dict[str, Any],
    validation_data: Dict[str, Any],
    tamper_data:     Dict[str, Any],
    face_data:       Dict[str, Any],
) -> Dict[str, Any]:
    """
    Compute composite weighted risk score.

    Returns:
        {
            "score":          int,    # 0-100
            "recommendation": str,   # "Approve" | "Manual Review" | "Reject"
            "breakdown": {
                "validation_risk":  float,
                "tampering_risk":   float,
                "face_match_risk":  float,
            }
        }
    """
    validation_risk  = _validation_risk(validation_data)
    tampering_risk   = _tampering_risk(tamper_data)
    face_match_risk  = _face_match_risk(face_data)

    composite = (
        validation_risk  * WEIGHT_VALIDATION
        + tampering_risk * WEIGHT_TAMPERING
        + face_match_risk * WEIGHT_FACE_MATCH
    )
    score = int(round(min(100.0, composite)))

    if score >= REJECT_THRESHOLD:
        recommendation = "Reject"
    elif score >= REVIEW_THRESHOLD:
        recommendation = "Manual Review"
    else:
        recommendation = "Approve"

    result = {
        "score":          score,
        "recommendation": recommendation,
        "breakdown": {
            "validation_risk":  round(validation_risk,  2),
            "tampering_risk":   round(tampering_risk,   2),
            "face_match_risk":  round(face_match_risk,  2),
        },
    }

    logger.info(
        "Risk: score=%d (%s) | validation=%.1f tampering=%.1f face=%.1f",
        score, recommendation, validation_risk, tampering_risk, face_match_risk,
    )
    return result
