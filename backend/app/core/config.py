import os
from pathlib import Path
from typing import List, Set

try:
    from dotenv import load_dotenv
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    load_dotenv(dotenv_path=BASE_DIR / ".env")
except ImportError:
    BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "TRUSTID AI")
    PROJECT_DESCRIPTION: str = os.getenv(
        "PROJECT_DESCRIPTION",
        "AI Powered Fake Identity & Government Document Screening System",
    )
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))

    # CORS
    raw_origins = os.getenv("ALLOWED_ORIGINS")
    if raw_origins:
        ALLOWED_ORIGINS: List[str] = [
            origin.strip() for origin in raw_origins.split(",") if origin.strip()
        ]
    else:
        ALLOWED_ORIGINS: List[str] = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]

    # File uploads
    MAX_FILE_SIZE_BYTES: int = int(
        os.getenv("MAX_FILE_SIZE_BYTES", 10 * 1024 * 1024)
    )  # 10 MB

    ALLOWED_DOCUMENT_TYPES: Set[str] = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    }

    ALLOWED_FACE_TYPES: Set[str] = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    # OCR binary override path if needed (e.g. Windows C:\Program Files\Tesseract-OCR\tesseract.exe)
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", "")

settings = Settings()

# Apply tesseract command if provided
if settings.TESSERACT_CMD:
    try:
        import pytesseract
        pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
    except Exception:
        pass
