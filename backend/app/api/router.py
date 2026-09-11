from fastapi import APIRouter
from app.api.v1.endpoints import health, verification

api_router = APIRouter()

# Versioned API routes (/api/v1/...)
api_router.include_router(health.router, prefix="", tags=["Health"])
api_router.include_router(verification.router, prefix="/api/v1", tags=["Verification"])

# Legacy / direct compatibility route (/api/verify-document)
api_router.include_router(verification.router, prefix="/api", tags=["Verification"])
