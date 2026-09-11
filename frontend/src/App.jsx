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
    <div className="grid min-h-screen bg-bg-base grid-cols-[220px_1fr] grid-rows-[64px_1fr] max-[900px]:grid-cols-[72px_1fr]">
      <Sidebar active={activeNav} onNavigate={setActiveNav} />
      <Topbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="min-w-0 flex flex-col gap-4.5 px-7 pt-6 pb-12 max-[700px]:px-4 max-[700px]:pt-4.5">
        {/* ========================================================= */}
        {/* TAB 1: LIVE FACE DETECTION                                */}
        {/* ========================================================= */}
        {activeTab === 'Face Detection' ? (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-[22px] font-bold text-text-primary mb-1">
                Live Face Detection
              </h1>
              <p className="text-[13px] text-text-secondary max-w-[620px]">
                Real-time webcam face detection using face-api.js.
              </p>
            </div>

            {faceDetectionResult?.detected && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/30 border border-green-700 text-green-300 text-sm">
                Face detected — {faceDetectionResult.faceCount || 1} face(s) with{' '}
                {Math.round((faceDetectionResult.confidence || 0) * 100)}% confidence.
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
          <div className="flex flex-col gap-4.5">
            <div>
              <h1 className="font-display text-[22px] font-bold text-text-primary mb-1">
                Verification Dashboard
              </h1>
              <p className="text-[13px] text-text-secondary max-w-[700px]">
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
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-text-primary">
                  Live Face Verification
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Detect a face via webcam right here on the dashboard before running the full document verification.
                </p>
              </div>

              {faceDetectionResult?.detected && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/30 border border-green-700 text-green-300 text-sm">
                  Face detected — {faceDetectionResult.faceCount || 1} face(s) with{' '}
                  {Math.round((faceDetectionResult.confidence || 0) * 100)}% confidence.
                </div>
              )}

              <div className="flex justify-center">
                <FaceDetector onResult={handleFaceResult} autoStart={false} />
              </div>
            </section>

            {/* 3. VERIFICATION IN PROGRESS BANNER */}
            {isVerifying && (
              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Verification in progress
                    </h3>
                    <p className="text-sm text-text-secondary">
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
            <div className="grid gap-3.5 grid-cols-3 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1">
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
            <div className="grid gap-3.5 grid-cols-4 max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1">
              <TamperingAnalysisPanel data={tamperingPanelData} />
              <FaceVerificationPanel data={faceVerificationPanelData} />
              <TimelinePanel data={timelineData} />
              <DetailsPanel data={detailsPanelData} />
            </div>

            {/* 8. AUDIT HISTORY & DISTRIBUTION GRID */}
            <div className="grid gap-3.5 grid-cols-[1.6fr_1fr] max-[1200px]:grid-cols-1">
              <RecentHistoryPanel data={history} />
              <RiskDistributionPanel
                data={riskDistributionData}
                title={riskDistributionData ? 'Risk Score Breakdown' : undefined}
                eyebrow={riskDistributionData ? 'Latest Scan' : undefined}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
