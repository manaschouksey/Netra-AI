from typing import Dict, Optional
from pydantic import BaseModel

class RiskBreakdown(BaseModel):
    validation_risk: float = 0.0
    tampering_risk: float = 0.0
    face_match_risk: float = 0.0

class RiskSummary(BaseModel):
    score: float = 0.0
    recommendation: str = "Awaiting officer decision"
    breakdown: Optional[RiskBreakdown] = None
