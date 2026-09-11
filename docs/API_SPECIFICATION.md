# REST API Specification: NETRA / TrustID AI

## Base URL
- Development: `http://localhost:8000`

---

## Endpoints

### 1. Health Check
- **Route**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "TRUSTID AI",
  "version": "1.0.0"
}
```

### 2. Service Root
- **Route**: `GET /`
- **Response**:
```json
{
  "service": "TRUSTID AI",
  "status": "running",
  "message": "Government document verification API is running.",
  "endpoints": {
    "health": "/health",
    "verify_document": "/api/verify-document",
    "docs": "/docs"
  }
}
```

### 3. Verify Document
- **Route**: `POST /api/verify-document` (and `POST /api/v1/verify-document`)
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `document` (required, file): Binary file (`.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`, max 10MB)
  - `live_photo` (optional, file): Binary file (`.jpg`, `.jpeg`, `.png`, `.webp`, max 10MB)
- **Response** (`200 OK`):
```json
{
  "requestId": "a1b2c3d4",
  "docId": "DOC-AB123456",
  "docType": "Passport",
  "submittedAt": "Just now",
  "officer": "Officer System",
  "thumbnailLabel": "passport.jpg",
  "status": "Approve",
  "riskScore": 12.5,
  "riskBreakdown": {
    "validation_risk": 0.0,
    "tampering_risk": 8.5,
    "face_match_risk": 15.0
  },
  "faceMatch": {
    "score": 85.0,
    "percentage": 85.0,
    "status": "MATCH",
    "level": "HIGH"
  },
  "documentMatch": {
    "matched": true,
    "count": 1
  },
  "modules": {
    "ocr": { ... },
    "validation": { ... },
    "tampering": { ... },
    "face_verification": { ... }
  },
  "summary": {
    "ocrCompleted": true,
    "validationCompleted": true,
    "tamperingAnalysisCompleted": true,
    "faceVerificationCompleted": true,
    "faceMatchScore": 85.0,
    "faceMatchLevel": "HIGH",
    "documentMatched": true,
    "documentsMatched": 1,
    "riskScore": 12.5,
    "recommendation": "Approve"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing file, unsupported MIME type, or file exceeds size limit.
  - `502 Bad Gateway`: Failure during OCR, validation, tampering, or face comparison stage.
