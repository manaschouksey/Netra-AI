import { useState } from 'react';

// Layout & Navigation
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

// Dashboard Sections & Feature Modules
import DocumentUploadSection from './components/dashboard/DocumentUploadSection';
import VerificationResultsSection from './components/dashboard/VerificationResultsSection';
import FaceDetector from './components/face-detector/FaceDetector';

// Dashboard Panels
import StatCards from './components/dashboard/StatCards';
import RiskScoreGauge from './components/dashboard/RiskScoreGauge';
import LatestScanPanel from './components/dashboard/LatestScanPanel';
import ExtractedInfoPanel from './components/dashboard/ExtractedInfoPanel';
import AIVerificationPanel from './components/dashboard/AIVerificationPanel';
import TamperingAnalysisPanel from './components/dashboard/TamperingAnalysisPanel';
import FaceVerificationPanel from './components/dashboard/FaceVerificationPanel';
import TimelinePanel from './components/dashboard/TimelinePanel';
import DetailsPanel from './components/dashboard/DetailsPanel';
import RecentHistoryPanel from './components/dashboard/RecentHistoryPanel';
import RiskDistributionPanel from './components/dashboard/RiskDistributionPanel';

// Hooks & Utilities
import { useDocumentVerification } from './hooks/useDocumentVerification';
import {
  extractFaceScore,
  extractFaceStatus,
  extractRiskScore,
  mapFaceVerificationPanelData,
  mapExtractedInfoRows,
  mapAIVerificationRows,
  mapTamperingPanelData,
  mapTimelineData,
  mapDetailsPanelData,
  mapRiskDistributionData,
  mapRiskScoreGaugeData,
  mapSessionStatsData,
} from './utils/dataMappers';

function LimeSquiggleDivider() {
  return (
    <div className="w-full overflow-hidden py-6" aria-hidden="true">
      <svg
        viewBox="0 0 1200 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-3.5 block"
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

export default function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [faceDetectionResult, setFaceDetectionResult] = useState(null);

  const {
    documentFile,
    livePhotoFile,
    documentPreviewUrl,
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

  // Mapped panel data props
  const extractedInfoRows = mapExtractedInfoRows(verificationResult);
  const aiVerificationRows = mapAIVerificationRows(verificationResult);
  const tamperingPanelData = mapTamperingPanelData(verificationResult);
  const faceVerificationPanelData = mapFaceVerificationPanelData(verificationResult);
  const timelineData = mapTimelineData(verificationResult, documentFile);
  const detailsPanelData = mapDetailsPanelData(verificationResult);
  const riskDistributionData = mapRiskDistributionData(verificationResult);
  const riskScoreGaugeData = mapRiskScoreGaugeData(verificationResult);
  const sessionStatsData = mapSessionStatsData(history);

  return (
    <div className="grid min-h-screen bg-[#1f1633] grid-cols-[220px_1fr] grid-rows-[64px_1fr] max-[900px]:grid-cols-[72px_1fr]">
      <Sidebar active={activeNav} onNavigate={setActiveNav} />
      <Topbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="min-w-0 flex flex-col gap-6 px-7 pt-6 pb-12 max-[700px]:px-4 max-[700px]:pt-4.5 bg-[#1f1633]">
        {/* ========================================================= */}
        {/* TAB 1: LIVE FACE DETECTION                                */}
        {/* ========================================================= */}
        {activeTab === 'Face Detection' ? (
          <div>
            <div className="mb-6">
              <h1 className="text-[26px] font-bold text-[#ffffff] tracking-tight mb-1">
                Real-time <span className="chip-lime-keyword">Biometric</span> Face Detection
              </h1>
              <p className="text-[13px] text-[#bdb8c0] max-w-[620px]">
                In-browser real-time webcam face detection powered by TinyFaceDetector neural net.
              </p>
            </div>

            {faceDetectionResult?.detected && (
              <div className="mb-5 px-4 py-3 rounded-md bg-[#150f23] border border-[#c2ef4e] text-[#c2ef4e] text-xs font-semibold uppercase tracking-[0.2px] flex items-center justify-between">
                <span>Face detected — {faceDetectionResult.faceCount || 1} face(s) identified</span>
                <span className="font-mono text-xs text-[#c2ef4e]">{Math.round((faceDetectionResult.confidence || 0) * 100)}% match</span>
              </div>
            )}

            <div className="flex justify-center">
              <FaceDetector onResult={handleFaceResult} autoStart={false} />
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* TAB 2: VERIFICATION DASHBOARD                             */
          /* ========================================================= */
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-[26px] font-bold text-[#ffffff] tracking-tight mb-1">
                Identity Document <span className="chip-lime-keyword">Forensics</span> Console
              </h1>
              <p className="text-[13px] text-[#bdb8c0] max-w-[700px]">
                Real-time government document authenticity, biometric verification,
                tampering analysis, and risk scoring.
              </p>
            </div>

            {/* 1. DOCUMENT UPLOAD */}
            <DocumentUploadSection
              documentFile={documentFile}
              livePhotoFile={livePhotoFile}
              onDocumentChange={handleDocumentChange}
              onLivePhotoChange={handleLivePhotoChange}
              onVerify={handleVerify}
              isVerifying={isVerifying}
              error={error}
            />

            {/* 2. LIVE FACE VERIFICATION (Webcam on dashboard) */}
            <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6">
              <div className="mb-5">
                <h2 className="text-[18px] font-semibold text-[#ffffff] m-0">
                  Live Face Verification
                </h2>
                <p className="text-[13px] text-[#bdb8c0] mt-1">
                  Detect a face via webcam directly on the console before running the full document verification.
                </p>
              </div>

              {faceDetectionResult?.detected && (
                <div className="mb-5 px-4 py-3 rounded-md bg-[#150f23] border border-[#c2ef4e] text-[#c2ef4e] text-xs font-semibold uppercase tracking-[0.2px] flex items-center justify-between">
                  <span>Face detected — {faceDetectionResult.faceCount || 1} face(s) identified</span>
                  <span className="font-mono text-xs text-[#c2ef4e]">{Math.round((faceDetectionResult.confidence || 0) * 100)}% match</span>
                </div>
              )}

              <div className="flex justify-center">
                <FaceDetector onResult={handleFaceResult} autoStart={false} />
              </div>
            </section>

            {/* 3. VERIFICATION IN PROGRESS BANNER */}
            {isVerifying && (
              <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6">
                <div className="flex items-center gap-3.5">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#362d59] border-t-[#c2ef4e]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#ffffff] m-0">
                      Verification in progress
                    </h3>
                    <p className="text-xs text-[#bdb8c0] mt-0.5">
                      Running OCR, document validation, tampering detection, and face verification...
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 4. FINAL RESULTS SECTION */}
            <VerificationResultsSection
              verificationResult={verificationResult}
              riskScore={riskScore}
              faceScore={faceScore}
              faceStatus={faceStatus}
            />

            {/* 5. TELEMETRY & GAUGES */}
            <StatCards data={sessionStatsData} />
            <RiskScoreGauge data={riskScoreGaugeData} />

            {/* 6. PRIMARY PANELS GRID */}
            <div className="grid gap-4 grid-cols-3 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1">
              <LatestScanPanel
                docId={verificationResult?.docId}
                docType={verificationResult?.docType}
                submittedAt={
                  verificationResult ? new Date().toLocaleTimeString() : undefined
                }
                officer={verificationResult?.officer}
                status={
                  isVerifying
                    ? 'Analyzing Document...'
                    : verificationResult?.status
                }
                previewUrl={documentPreviewUrl}
                loading={isVerifying}
              />
              <ExtractedInfoPanel data={extractedInfoRows} />
              <AIVerificationPanel data={aiVerificationRows} />
            </div>

            {/* 7. SECONDARY FORENSIC PANELS GRID */}
            <div className="grid gap-4 grid-cols-4 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1">
              <TamperingAnalysisPanel data={tamperingPanelData} />
              <FaceVerificationPanel data={faceVerificationPanelData} />
              <TimelinePanel data={timelineData} />
              <DetailsPanel data={detailsPanelData} />
            </div>

            {/* 8. AUDIT HISTORY & DISTRIBUTION GRID */}
            <div className="grid gap-4 grid-cols-[1.6fr_1fr] max-[1200px]:grid-cols-1">
              <RecentHistoryPanel data={history} />
              <RiskDistributionPanel
                data={riskDistributionData}
                title={riskDistributionData ? 'Risk Score Breakdown' : undefined}
                eyebrow={riskDistributionData ? 'Latest Scan' : undefined}
              />
            </div>

            {/* 9. SIGNATURE SENTRY LIME SQUIGGLY DIVIDER & FOOTER */}
            <div className="mt-6">
              <LimeSquiggleDivider />
              <footer className="flex flex-col gap-4 text-xs font-normal text-[#bdb8c0] pt-2 pb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#ffffff]">NETRA<span className="text-[#c2ef4e]">.AI</span></span>
                    <span className="text-[#79628c]">/</span>
                    <span>TrustID Verification Console</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-[#79628c]">
                    <span className="hover:text-[#ffffff] transition-colors cursor-pointer">Security Protocol</span>
                    <span className="hover:text-[#ffffff] transition-colors cursor-pointer">Documentation</span>
                    <span className="hover:text-[#ffffff] transition-colors cursor-pointer">System Status</span>
                    <span className="hover:text-[#ffffff] transition-colors cursor-pointer">Compliance</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#79628c]">
                  © 2026 NETRA AI / TrustID Systems. Built with precision Sentry design system.
                </div>
              </footer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

