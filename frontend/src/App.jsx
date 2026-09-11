import React, { useState } from 'react';

// Navigation
import Topbar from './components/layout/Topbar';
import { useTheme } from './components/common/ThemeToggle';

// Dedicated Pages (Zero Duplicacy)
import LandingPage from './components/pages/LandingPage';
import VerifyPage from './components/pages/VerifyPage';
import FaceCheckPage from './components/pages/FaceCheckPage';
import DocsPage from './components/pages/DocsPage';

// Verification Engine Hooks & Utilities
import { useDocumentVerification } from './hooks/useDocumentVerification';
import {
  extractFaceScore,
  extractFaceStatus,
  extractRiskScore,
  mapExtractedInfoRows,
} from './utils/dataMappers';

function LimeSquiggleDivider() {
  return (
    <div className="w-full overflow-hidden py-6 sm:py-8 max-w-[1152px] mx-auto px-4 sm:px-6" aria-hidden="true">
      <svg
        viewBox="0 0 1200 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-3 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 8 Q 25 0, 50 8 T 100 8 T 150 8 T 200 8 T 250 8 T 300 8 T 350 8 T 400 8 T 450 8 T 500 8 T 550 8 T 600 8 T 650 8 T 700 8 T 750 8 T 800 8 T 850 8 T 900 8 T 950 8 T 1000 8 T 1050 8 T 1100 8 T 1150 8 T 1200 8"
          stroke="#c2ef4e"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function AppFooter({ onNavigate }) {
  return (
    <footer className="max-w-[1152px] mx-auto w-full px-4 sm:px-6 pb-12 text-xs text-[#bdb8c0] flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#ffffff] text-sm">
            NETRA<span className="text-[#c2ef4e]">.AI</span>
          </span>
          <span className="text-[#79628c]">/</span>
          <span className="text-xs">Identity Document Forensics</span>
        </div>
        <div className="flex items-center gap-5 sm:gap-6 text-xs text-[#79628c] flex-wrap">
          <button type="button" onClick={() => onNavigate('Home')} className="hover:text-[#ffffff] transition-colors cursor-pointer bg-transparent border-none p-0">Home</button>
          <button type="button" onClick={() => onNavigate('Verify ID')} className="hover:text-[#ffffff] transition-colors cursor-pointer bg-transparent border-none p-0">Verify ID</button>
          <button type="button" onClick={() => onNavigate('Live Face Check')} className="hover:text-[#ffffff] transition-colors cursor-pointer bg-transparent border-none p-0">Face Check</button>
          <button type="button" onClick={() => onNavigate('Docs')} className="hover:text-[#ffffff] transition-colors cursor-pointer bg-transparent border-none p-0">Docs</button>
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4 text-[11px] text-[#79628c] pt-3 border-t border-[#362d59]">
        <span>© 2026 NETRA AI / TrustID Systems. All rights reserved.</span>
        <span>Autonomous Identity Verification &amp; Biometric Forensics.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [theme, setTheme] = useTheme();
  const [activeTab, setActiveTab] = useState('Home');
  const [faceDetectionResult, setFaceDetectionResult] = useState(null);

  const {
    documentFile,
    livePhotoFile,
    verificationResult,
    isVerifying,
    error,
    history,
    handleDocumentChange,
    handleLivePhotoChange,
    handleVerify,
  } = useDocumentVerification();

  const handleFaceResult = (result) => {
    setFaceDetectionResult(result);
  };

  // Extracted values
  const faceScore = extractFaceScore(verificationResult);
  const faceStatus = extractFaceStatus(verificationResult);
  const riskScore = extractRiskScore(verificationResult);
  const extractedInfoRows = mapExtractedInfoRows(verificationResult);

  return (
    <div className="min-h-screen bg-[#1f1633] text-[#ffffff] flex flex-col font-sans transition-colors duration-200">
      {/* TOP NAVIGATION */}
      <Topbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      {/* DEDICATED PAGE VIEWS */}
      <main className="flex-1 w-full" id="main-content">
        {activeTab === 'Home' && (
          <LandingPage onNavigate={setActiveTab} />
        )}

        {activeTab === 'Verify ID' && (
          <VerifyPage
            documentFile={documentFile}
            livePhotoFile={livePhotoFile}
            onDocumentChange={handleDocumentChange}
            onLivePhotoChange={handleLivePhotoChange}
            onVerify={handleVerify}
            isVerifying={isVerifying}
            error={error}
            verificationResult={verificationResult}
            riskScore={riskScore}
            faceScore={faceScore}
            faceStatus={faceStatus}
            extractedInfoRows={extractedInfoRows}
            history={history}
          />
        )}

        {activeTab === 'Live Face Check' && (
          <FaceCheckPage
            faceResult={faceDetectionResult}
            onFaceResult={handleFaceResult}
          />
        )}

        {activeTab === 'Docs' && (
          <DocsPage onNavigate={setActiveTab} />
        )}
      </main>

      {/* LIME SQUIGGLY DIVIDER & CLEAN FOOTER */}
      <LimeSquiggleDivider />
      <AppFooter onNavigate={setActiveTab} />
    </div>
  );
}
