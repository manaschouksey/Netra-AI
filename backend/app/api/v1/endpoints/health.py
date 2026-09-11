from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }

@router.get("/", tags=["Health"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "running",
        "message": "Government document verification API is running.",
        "endpoints": {
            "health": "/health",
            "verify_document": "/api/verify-document",
            "docs": "/docs",
        },
    }
