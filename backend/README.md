# NETRA / TrustID AI — Backend Service

High-performance asynchronous FastAPI microservice for government document authenticity screening, OCR extraction, tampering detection, and biometric face verification.

## Architecture
```
backend/
├── app/
│   ├── api/                   # API routes and controllers
│   │   ├── router.py          # Master router
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── health.py  # Health & status endpoints
│   │           └── verification.py # Document verification pipeline
│   ├── core/                  # Configuration, logging & CORS
│   │   ├── config.py          # Settings & environment variables
│   │   ├── cors.py            # CORS middleware setup
│   │   └── logging.py         # Structured logging configuration
│   ├── schemas/               # Pydantic request/response models
│   │   ├── document.py        # OCR & validation models
│   │   ├── risk.py            # Risk score breakdown models
│   │   └── verification.py    # Verification response schemas
│   ├── services/              # Domain processing engines
│   │   ├── ocr_service.py     # Tesseract OCR & regex parser
│   │   ├── validation_service.py # Completeness & plausibility checks
│   │   ├── tampering_service.py  # Error Level Analysis (ELA)
│   │   ├── face_service.py    # Face match & biometric comparison
│   │   └── risk_service.py    # Multi-factor composite risk scoring
│   ├── utils/                 # Utilities
│   │   ├── file_helpers.py    # Multipart file reading & validation
│   │   └── score_helpers.py   # Normalization & status helpers
│   └── main.py                # Application factory
├── .env.example               # Environment variables template
├── Dockerfile                 # Production container definition
├── requirements.txt           # Python dependencies
└── README.md
```

## Getting Started

1. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv

   # Windows:
   venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run development server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. **Access interactive documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`
   - Health Check: `http://localhost:8000/health`
