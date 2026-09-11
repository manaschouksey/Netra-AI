# System Architecture: NETRA / TrustID AI

## Overview
NETRA / TrustID AI is a distributed document fraud detection and identity verification platform designed with a decoupled client-server architecture:
- **Client**: Responsive single-page application built on React 19, Vite, and Tailwind CSS v4.
- **Server**: High-concurrency async microservice built on FastAPI, Uvicorn, Pillow, NumPy, and OpenCV.

---

## Architectural Principles

1. **Separation of Concerns**:
   - The frontend handles UI state, webcam video stream rendering, and client-side face detection via `face-api.js`.
   - The backend handles intensive computation: image preprocessing, OCR extraction, tampering heuristics, and multi-factor scoring.

2. **Loose Coupling & Backward Compatibility**:
   - Endpoints are versioned under `/api/v1/*` while retaining backwards-compatible aliases at `/api/*`.
   - Client and server communicate over strict REST JSON contracts.

3. **Defensive Processing**:
   - File uploads are validated before loading into memory.
   - Every service is wrapped in async threadpool workers (`run_in_threadpool`) so CPU-bound image processing does not block FastAPI's event loop.
   - Robust fallback mechanisms exist for OCR and face matching when system binaries or specific hardware libraries are missing.

---

## Pipeline Flow

```
[User Interface]
       │ (multipart/form-data: document + live_photo)
       ▼
[FastAPI App Gateway]
       │
       ├──► [File Validator] (MIME-type check, 10MB limit)
       │
       ├──► [OCR Service]
       │       └── Preprocessing -> Tesseract -> Regex Extraction -> [Validation Service]
       │
       ├──► [Tampering Service]
       │       └── JPEG 90% recompression -> ImageChops diff -> ELA Score
       │
       ├──► [Face Verification Service]
       │       └── RGB loading -> Biometric comparison -> Match score & level
       │
       └──► [Risk Scoring Engine]
               └── Weighted factors: 0.30 Validation + 0.40 Tampering + 0.30 Face Match
                       │
                       ▼
             [Final JSON Verification Response]
```
