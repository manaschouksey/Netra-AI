# NETRA / TrustID AI — Frontend Console

Modern, cyber-forensic verification dashboard built with React 19, Vite 8, and Tailwind CSS v4.

## Features
- **Document & Biometric Verification**: Upload ID documents and reference photos for automated OCR, tampering inspection, and face matching.
- **Client-Side Face Detection**: Real-time webcam face detector powered by `face-api.js` (TinyFaceDetector) running entirely in the browser.
- **Forensic Analytics Panels**:
  - Live Risk Score Gauge with dynamic weighted breakdown.
  - OCR extracted document metadata inspector.
  - ELA (Error Level Analysis) tampering anomaly score.
  - Biometric face match confidence & spoof flags.
  - Real-time audit timeline and session scan history.

## Directory Structure
```
frontend/
├── public/                # Static assets (favicons, icons)
├── src/
│   ├── api/               # Centralized HTTP client & verification services
│   ├── assets/            # Project images & vector graphics
│   ├── components/
│   │   ├── common/        # Reusable UI primitives (Panel, ResultCard, ModuleCard)
│   │   ├── dashboard/     # Domain panels (OCR, Tampering, Face, Risk, Timeline)
│   │   ├── face-detector/ # Webcam detector component & styles
│   │   └── layout/        # Sidebar & Topbar shell
│   ├── constants/         # Thresholds, status maps & API configurations
│   ├── data/              # Telemetry initial mock state
│   ├── engine/            # Framework-agnostic FaceDetectorEngine
│   ├── hooks/             # Custom React hooks (useFaceDetector, useDocumentVerification)
│   ├── utils/             # Data transformation & formatting helpers
│   ├── App.jsx            # High-level dashboard orchestrator
│   ├── index.css          # Tailwind CSS v4 theme tokens
│   └── main.jsx           # React DOM root
├── index.html             # HTML5 template
├── package.json           # Scripts and dependencies
└── vite.config.js         # Vite configuration with proxy
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173`.

3. Build production bundle:
   ```bash
   npm run build
   ```
