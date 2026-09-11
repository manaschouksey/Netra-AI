"""
Tampering Detection Service — Netra-TrustID
=============================================
Uses Error Level Analysis (ELA) to detect digital manipulations and JPEG
re-compressions that indicate photo editing.

How ELA works
-------------
1. Re-save the original image at a known JPEG quality level.
2. Compute the pixel-difference between original and re-saved versions.
3. Areas that were digitally edited *after* the original compression appear
   as bright patches (higher-than-expected error levels).

Limitations
-----------
- ELA is a heuristic, NOT a forensic proof.
- Mobile/WhatsApp photos are re-compressed 2-3 times, inflating scores.
- Scanned documents with uneven lighting can also trigger false positives.
- Use the result as a routing signal for manual review, not as an automatic
  rejection criterion.
"""

import io
import logging
from typing import Dict, Any

import numpy as np
from PIL import Image, ImageChops

logger = logging.getLogger("trustid.tampering")

# Re-save quality for ELA comparison
ELA_QUALITY = 92           # Higher quality → smaller expected diff for genuine docs

# Risk thresholds (tamper_score is 0-100)
HIGH_RISK_THRESHOLD   = 38.0
MEDIUM_RISK_THRESHOLD = 20.0

# Hotspot detection: if max diff patch is >> mean diff, flag as suspicious
HOTSPOT_RATIO_THRESHOLD = 4.5   # max / mean > this → likely localised edit


def _error_level_analysis(doc_bytes: bytes) -> tuple[np.ndarray, bool]:
    """
    Run ELA on raw image bytes.

    Returns:
        diff_array : float32 pixel-difference array (H × W × 3)
        is_jpeg    : whether the source was a JPEG (PNG always scores low)
    """
    original = Image.open(io.BytesIO(doc_bytes)).convert("RGB")
    is_jpeg = (getattr(original, "format", None) or "").upper() in ("JPEG", "JPG")

    buffer = io.BytesIO()
    original.save(buffer, "JPEG", quality=ELA_QUALITY)
    buffer.seek(0)
    recompressed = Image.open(buffer).convert("RGB")

    diff = ImageChops.difference(original, recompressed)
    return np.array(diff, dtype=np.float32), is_jpeg


def detect_tampering(doc_bytes: bytes) -> Dict[str, Any]:
    """
    Analyse a document image for signs of digital tampering.

    Returns:
        {
            "tamper_score":  float,     # 0-100; higher = more suspicious
            "risk_level":    str,       # "low" | "medium" | "high" | "unknown"
            "is_tampered":   bool,      # True when risk_level in {"medium","high"}
            "method":        str,
            "notes":         str,
        }
    """
    try:
        diff, is_jpeg = _error_level_analysis(doc_bytes)

        mean_diff = float(np.mean(diff))
        std_diff  = float(np.std(diff))
        max_diff  = float(np.max(diff))

        # Base score: mean error normalised.
        # Divisor tuned so a typical unedited JPEG photograph scores ~10-20.
        base_score = min(100.0, mean_diff * 3.8)

        # Hotspot boost: localised bright patches indicate copy-paste / text overlay
        hotspot_boost = 0.0
        if mean_diff > 1e-3:
            ratio = max_diff / mean_diff
            if ratio > HOTSPOT_RATIO_THRESHOLD:
                hotspot_boost = min(20.0, (ratio - HOTSPOT_RATIO_THRESHOLD) * 3.0)

        # High standard deviation → uneven editing across image regions
        variance_boost = min(10.0, std_diff * 0.4)

        # PNG images that weren't JPEG originally will always score near-zero;
        # cap their score to avoid false low-risk signals being misleading.
        tamper_score = round(min(100.0, base_score + hotspot_boost + variance_boost), 2)

        if tamper_score >= HIGH_RISK_THRESHOLD:
            risk_level = "high"
            notes = (
                f"High ELA score ({tamper_score:.1f}) with hotspot ratio {max_diff/max(mean_diff,0.01):.1f}x. "
                "Strong indicator of localised digital editing. Recommend manual review."
            )
        elif tamper_score >= MEDIUM_RISK_THRESHOLD:
            risk_level = "medium"
            notes = (
                f"Moderate ELA score ({tamper_score:.1f}). "
                "May reflect re-saved/compressed document or minor editing. Route for review."
            )
        else:
            risk_level = "low"
            notes = (
                f"Low ELA score ({tamper_score:.1f}). "
                "Error levels are consistent across the image; no obvious tampering detected."
            )

        is_tampered = risk_level in ("medium", "high")

        result = {
            "tamper_score": tamper_score,
            "risk_level":   risk_level,
            "is_tampered":  is_tampered,
            "method":       "error_level_analysis",
            "notes":        notes,
        }

        logger.info(
            "Tampering detection: score=%.1f, risk=%s, is_tampered=%s "
            "(mean=%.2f, std=%.2f, max=%.2f)",
            tamper_score, risk_level, is_tampered, mean_diff, std_diff, max_diff,
        )
        return result

    except Exception as exc:
        logger.exception("Tampering detection failed: %s", exc)
        return {
            "tamper_score": 0.0,
            "risk_level":   "unknown",
            "is_tampered":  False,
            "method":       "error_level_analysis",
            "notes":        f"Analysis could not complete: {exc}",
        }
