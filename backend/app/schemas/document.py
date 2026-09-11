from typing import Optional, List, Dict
from pydantic import BaseModel

class OCRResult(BaseModel):
    raw_text: str = ""
    document_type: str = "Government ID"
    document_number: Optional[str] = None
    name: Optional[str] = None
    date_of_birth: Optional[str] = None
    ocr_confidence: float = 0.0

class ValidationChecks(BaseModel):
    fields_present: bool = False
    ocr_confidence_ok: bool = False
    dob_plausible: bool = False

class ValidationResult(BaseModel):
    is_valid: bool = False
    issues: List[str] = []
    checks: Optional[ValidationChecks] = None

class TamperingResult(BaseModel):
    tamper_score: float = 0.0
    risk_level: str = "unknown"
    method: str = "error_level_analysis"
    notes: Optional[str] = None
