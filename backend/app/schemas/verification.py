from typing import Any, Dict, Optional
from pydantic import BaseModel

class FaceMatchSummary(BaseModel):
    score: Optional[float] = None
    percentage: Optional[float] = None
    status: str = "UNKNOWN"
    level: str = "UNKNOWN"

class DocumentMatchSummary(BaseModel):
    matched: bool = False
    count: int = 0

class VerificationSummary(BaseModel):
    ocrCompleted: bool = True
    validationCompleted: bool = True
    tamperingAnalysisCompleted: bool = True
    faceVerificationCompleted: bool = True
    faceMatchScore: Optional[float] = None
    faceMatchLevel: str = "UNKNOWN"
    documentMatched: bool = False
    documentsMatched: int = 0
    riskScore: float = 0.0
    recommendation: str = "Awaiting officer decision"

class VerificationResponse(BaseModel):
    requestId: str
    docId: str
    docType: str
    submittedAt: str = "Just now"
    officer: str = "Officer System"
    thumbnailLabel: str
    status: str
    riskScore: float
    riskBreakdown: Dict[str, Any] = {}
    faceMatch: FaceMatchSummary
    documentMatch: DocumentMatchSummary
    modules: Dict[str, Any] = {}
    summary: VerificationSummary
