"""
Tampering detection service.
Uses Error Level Analysis (ELA) to detect digital manipulations & compressions.
"""

import io
import logging
from typing import Dict, Any

import numpy as np
from PIL import Image, ImageChops

logger = logging.getLogger("trustid.tampering")

ELA_QUALITY = 90
HIGH_RISK_THRESHOLD = 35.0
MEDIUM_RISK_THRESHOLD = 18.0


def _error_level_analysis(doc_bytes: bytes) -> np.ndarray:
    original = Image.open(io.BytesIO(doc_bytes)).convert("RGB")

    buffer = io.BytesIO()
    original.save(buffer, "JPEG", quality=ELA_QUALITY)
    buffer.seek(0)
    recompressed = Image.open(buffer)

    diff = ImageChops.difference(original, recompressed)
    return np.array(diff, dtype=np.float32)


def detect_tampering(doc_bytes: bytes) -> Dict[str, Any]:
    """
    Run ELA-based tamper heuristic on the document image.
    """
    try:
        diff = _error_level_analysis(doc_bytes)
        mean_diff = float(np.mean(diff))

        # Scale mean pixel diff (typically in 0-15 range) into a 0-100 score
        tamper_score = min(100.0, mean_diff * 4.0)
        tamper_score = round(tamper_score, 2)

        if tamper_score >= HIGH_RISK_THRESHOLD:
            risk_level = "high"
            notes = "High variance in compression error; strong possibility of digital editing."
        elif tamper_score >= MEDIUM_RISK_THRESHOLD:
            risk_level = "medium"
            notes = "Moderate compression variance; possible re-save or localized edit."
        else:
            risk_level = "low"
            notes = "Error levels consistent across image; no obvious digital tampering detected."

        result = {
            "tamper_score": tamper_score,
            "risk_level": risk_level,
            "method": "error_level_analysis",
            "notes": notes,
        }

        logger.info("Tamper detection completed: score=%s, risk=%s", tamper_score, risk_level)
        return result
    except Exception as exc:
        logger.exception("Tamper detection failed: %s", exc)
        return {
            "tamper_score": 0.0,
            "risk_level": "unknown",
            "method": "error_level_analysis",
            "notes": f"Analysis failed: {exc}",
        }
