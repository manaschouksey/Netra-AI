from typing import Any, Dict, Optional

def safe_dict(value: Any) -> Dict[str, Any]:
    """
    Ensures a service result is always a dictionary to prevent .get() crashes.
    """
    if isinstance(value, dict):
        return value
    return {
        "status": "unknown",
        "result": value,
    }

def normalize_percentage(value: Any) -> Optional[float]:
    """
    Converts common face-score formats into 0-100 percentage.
    Examples: 0.95 -> 95, 95 -> 95
    """
    if value is None:
        return None

    try:
        val = float(value)
    except (TypeError, ValueError):
        return None

    if 0 <= val <= 1:
        val *= 100

    return max(0.0, min(100.0, val))

def extract_face_score(face_result: Any) -> Optional[float]:
    """
    Finds the face score regardless of the exact field name returned
    by the face verification service.
    """
    if not isinstance(face_result, dict):
        return None

    possible_keys = [
        "score",
        "similarity",
        "similarity_score",
        "confidence",
        "match_score",
        "match_percentage",
        "face_score",
        "face_match_score",
    ]

    for key in possible_keys:
        if key in face_result:
            score = normalize_percentage(face_result.get(key))
            if score is not None:
                return round(score, 2)

    return None

def get_face_status(face_result: Any) -> str:
    """
    Finds the face verification status string.
    """
    if not isinstance(face_result, dict):
        return "UNKNOWN"

    possible_keys = [
        "status",
        "match_status",
        "recommendation",
        "result",
    ]

    for key in possible_keys:
        val = face_result.get(key)
        if val is not None:
            return str(val)

    if "match" in face_result:
        return "MATCH" if face_result["match"] else "NO MATCH"

    if "matched" in face_result:
        return "MATCH" if face_result["matched"] else "NO MATCH"

    return "UNKNOWN"

def get_match_level(score: Optional[float]) -> str:
    """
    Converts face score into HIGH / MEDIUM / LOW / UNKNOWN.
    """
    if score is None:
        return "UNKNOWN"

    if score >= 80:
        return "HIGH"

    if score >= 50:
        return "MEDIUM"

    return "LOW"
