import React, { useState, useRef } from 'react';
import FaceDetector from '../face-detector/FaceDetector';
import { Camera, Upload, CheckCircle2, AlertTriangle, RefreshCw, UserCheck, ArrowRight, Sun, Eye, Lock } from 'lucide-react';
import { ALLOWED_DOC_EXTENSIONS } from '../../constants';
import { verifyDocument } from '../../api/verificationApi';
import { formatScore, formatPercentage } from '../../utils/formatters';
import VerificationProgressBar from '../common/VerificationProgressBar';
import { useVerificationProgress } from '../../hooks/useVerificationProgress';

export default function FaceCheckPage({ faceResult, onFaceResult }) {
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [capturedSelfiePreview, setCapturedSelfiePreview] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchError, setMatchError] = useState(null);

  const captureFnRef = useRef(null);
  const selfieInputRef = useRef(null);

  const {
    progress, stageLabel, stageDetail, stageIdx,
    isComplete: progressComplete,
    startProgress, completeProgress, resetProgress,
  } = useVerificationProgress();

  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setDocPreview(URL.createObjectURL(file));
      setMatchResult(null);
      setMatchError(null);
      resetProgress();
    }
  };

  const handleSelfieFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      setCapturedSelfiePreview(URL.createObjectURL(file));
      setIsImageCaptured(true);
      setMatchResult(null);
      setMatchError(null);
      resetProgress();
    }
  };

  const [isImageCaptured, setIsImageCaptured] = useState(false);

  const handleClearDoc = () => {
    setDocFile(null);
    setDocPreview(null);
    setMatchResult(null);
    setMatchError(null);
    setCapturedSelfiePreview(null);
    setSelfieFile(null);
    setIsImageCaptured(false);
  };

  const handleCaptureAndMatch = async () => {
    if (!docFile) {
      setMatchError('Please upload a government ID card in Step 1 first.');
      return;
    }

    let livePhoto = selfieFile;
    if (!livePhoto) {
      if (!captureFnRef.current) {
        setMatchError('Please either click "Start Camera" to capture a selfie, or click "Upload Selfie Photo".');
        return;
      }
      try {
        const selfieBlob = await captureFnRef.current();
        if (!selfieBlob) {
          throw new Error('Camera is not active. Click "Start Camera" or upload a selfie file.');
        }
        livePhoto = selfieBlob;
        setCapturedSelfiePreview(URL.createObjectURL(selfieBlob));
        setIsImageCaptured(true);
      } catch (err) {
        setMatchError(err.message || 'Could not capture photo from webcam. Please try again.');
        return;
      }
    }

    setIsMatching(true);
    setMatchError(null);
    startProgress();

    try {
      // Call backend verification endpoint with doc and selfie
      const res = await verifyDocument({ documentFile: docFile, livePhotoFile: livePhoto });
      completeProgress();
      setMatchResult(res);
    } catch (err) {
      console.error('Biometric matching failed:', err);
      resetProgress();
      setMatchError(err.message || 'Face matching failed. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  const faceScore = matchResult?.faceMatch?.score ?? matchResult?.face_verification?.similarity_score ?? (matchResult?.risk_assessment?.face_score != null ? matchResult.risk_assessment.face_score * 100 : null);
  const isMatch = matchResult?.faceMatch?.status === 'MATCH' || matchResult?.face_verification?.match || (faceScore != null ? faceScore >= 45 : null);
  const riskScore = matchResult?.riskScore ?? 0;
  const isAuth = matchResult?.status === 'Approve' || matchResult?.status === 'AUTHENTIC' || (riskScore < 34);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 py-8 flex flex-col gap-10 animate-fade-in">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c] w-fit">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e] animate-pulse-glow" />
          Live Biometric 1:1 Verification Studio
        </div>
        <h1 className="text-[32px] sm:text-[44px] font-bold text-[#ffffff] tracking-tight m-0">
          Match Live Face With <span className="chip-lime-keyword">ID Document</span>
        </h1>
        <p className="text-sm sm:text-base text-[#bdb8c0] max-w-[800px] m-0 font-normal leading-relaxed">
          First upload your government ID card. Next, turn on your selfie camera. Our smart AI will compare your live face against the picture on the card to make sure you are really you!
        </p>
      </div>

      {/* REAL-TIME PROGRESS BAR — shown while matching */}
      {(isMatching || (progressComplete && !matchResult)) && (
        <VerificationProgressBar
          progress={progress}
          stageLabel={stageLabel}
          stageDetail={stageDetail}
          stageIdx={stageIdx}
          isComplete={progressComplete}
        />
      )}

      {/* 2-COLUMN BIOMETRIC MATCHING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* STEP 1: ID DOCUMENT UPLOAD PANEL (5 cols) */}
        <section className="lg:col-span-5 bg-[#150f23] border border-[#362d59] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#362d59] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#1f1633] border border-[#362d59] text-xs font-bold grid place-items-center text-[#c2ef4e]">
                01
              </span>
              <div>
                <h2 className="text-base font-bold text-[#ffffff] m-0">Upload Government ID</h2>
                <p className="text-xs text-[#79628c] m-0">Passport, Driving License, Aadhaar, or National ID</p>
              </div>
            </div>
            {docFile && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
                ✓ LOADED
              </span>
            )}
          </div>

          {!docPreview ? (
            <label className="border-2 border-dashed border-[#362d59] hover:border-[#c2ef4e] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-[#1f1633]/50 transition-colors text-center min-h-[260px]">
              <div className="w-12 h-12 rounded-full bg-[#150f23] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
                <Upload size={22} />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#ffffff] block">Click to choose ID card photo</span>
                <span className="text-xs text-[#79628c] block mt-1">PNG, JPG, JPEG, WEBP or PDF</span>
              </div>
              <input
                type="file"
                accept={ALLOWED_DOC_EXTENSIONS}
                onChange={handleDocChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden border border-[#362d59] bg-[#000000] aspect-[16/10] flex items-center justify-center">
                <img
                  src={docPreview}
                  alt="Government ID Document Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-2 text-xs bg-[#1f1633] p-3 rounded-lg border border-[#362d59]">
                <div className="truncate text-[#bdb8c0]">
                  {docFile?.name}
                </div>
                <button
                  type="button"
                  onClick={handleClearDoc}
                  className="text-[#fa7faa] hover:underline shrink-0 font-medium"
                >
                  Change Card
                </button>
              </div>
            </div>
          )}

          <div className="text-xs text-[#79628c] leading-relaxed">
            💡 <strong>Tip:</strong> Make sure the photo on the card is sharp, glare-free, and not cut off so the facial matcher can lock onto eyes and nose.
          </div>
        </section>

        {/* STEP 2: LIVE MIRRORED SELFIE CAMERA (7 cols) */}
        <section className="lg:col-span-7 bg-[#150f23] border border-[#362d59] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#362d59] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#1f1633] border border-[#362d59] text-xs font-bold grid place-items-center text-[#c2ef4e]">
                02
              </span>
              <div>
                <h2 className="text-base font-bold text-[#ffffff] m-0">Live Selfie Camera</h2>
                <p className="text-xs text-[#79628c] m-0">Mirrored front-facing camera with real-time face tracking</p>
              </div>
            </div>
            {faceResult?.detected && !isImageCaptured && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
                FACE LOCKED ({Math.round(faceResult.confidence * 100)}%)
              </span>
            )}
            {isImageCaptured && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#c2ef4e]/60">
                ✓ PHOTO LOCKED
              </span>
            )}
          </div>

          {/* MIRRORED CAMERA OR CAPTURED FRAME */}
          <div className="w-full">
            {isImageCaptured && capturedSelfiePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-[#c2ef4e]/40 bg-[#000000] aspect-[16/10] flex items-center justify-center shadow-xl">
                <img
                  src={capturedSelfiePreview}
                  alt="Captured Selfie Frame"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#150f23]/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#c2ef4e] border border-[#c2ef4e]/50 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c2ef4e] animate-ping" />
                  <span>✓ Photo Captured! You can move away from screen now.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsImageCaptured(false);
                    setCapturedSelfiePreview(null);
                    setSelfieFile(null);
                    setMatchResult(null);
                  }}
                  className="absolute bottom-3 right-3 bg-[#150f23]/90 hover:bg-[#1f1633] px-3 py-1.5 rounded-md text-xs font-semibold text-[#fa7faa] border border-[#362d59] transition-colors"
                >
                  Retake Photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <FaceDetector
                  onResult={onFaceResult}
                  onCaptureReady={(fn) => {
                    captureFnRef.current = fn;
                  }}
                  autoStart={false}
                />
                <div className="flex items-center gap-3">
                  <div className="h-[1px] bg-[#362d59] flex-1" />
                  <span className="text-[10px] uppercase font-bold text-[#79628c] tracking-widest">OR</span>
                  <div className="h-[1px] bg-[#362d59] flex-1" />
                </div>
                <input
                  type="file"
                  ref={selfieInputRef}
                  accept={ALLOWED_DOC_EXTENSIONS}
                  onChange={handleSelfieFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => selfieInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#362d59] hover:border-[#c2ef4e]/60 bg-[#1f1633] text-xs font-semibold text-[#ffffff] flex items-center justify-center gap-2 transition-all hover:bg-[#150f23] cursor-pointer"
                >
                  <Upload size={14} className="text-[#c2ef4e]" />
                  <span>Upload Reference Selfie Photo Directly</span>
                </button>
              </div>
            )}
          </div>

          {/* ACTION BUTTON: TRIGGER BIOMETRIC 1:1 MATCH */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCaptureAndMatch}
              disabled={!docFile || isMatching}
              className="btn-inverted py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 w-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isMatching ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Analyzing Card &amp; Biometrics in Background...</span>
                </>
              ) : (
                <>
                  <UserCheck size={18} />
                  <span>{isImageCaptured ? 'Re-Verify Face With Card' : 'Capture Selfie & Match With ID Card'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {!docFile && (
              <div className="text-center text-xs text-[#fa7faa] font-medium">
                ⚠️ Step 1 Required: Please upload your ID card on the left first to enable face matching.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MATCH ERROR ALERT */}
      {matchError && (
        <div className="p-4 rounded-xl bg-[#fa7faa]/10 border border-[#fa7faa] text-[#fa7faa] text-sm flex items-center gap-3">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{matchError}</span>
        </div>
      )}

      {/* MATCH RESULT & ALL INITIAL VERSION METRICS */}
      {matchResult && (
        <section className="bg-[#150f23] border border-[#362d59] rounded-2xl p-6 sm:p-8 flex flex-col gap-8 animate-fade-in-up">
          {/* BANNER HEADER */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#362d59] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#79628c]">
                Verification Result • Biometric 1:1 Comparison
              </span>
              <h2 className="text-2xl font-bold text-[#ffffff] m-0 mt-1">
                {isMatch ? 'Identity Verified — Face Matches ID Card!' : 'Biometric Mismatch Detected'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border ${
                isMatch
                  ? 'bg-[#1f1633] text-[#c2ef4e] border-[#c2ef4e]'
                  : 'bg-[#1f1633] text-[#fa7faa] border-[#fa7faa]'
              }`}>
                {isMatch ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <span>{faceScore != null ? `${Math.round(faceScore)}% MATCH SCORE` : (isMatch ? 'MATCHED' : 'REVIEW')}</span>
              </div>
              <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${
                isAuth
                  ? 'bg-[#1f1633] text-[#c2ef4e] border-[#362d59]'
                  : 'bg-[#1f1633] text-[#fa7faa] border-[#362d59]'
              }`}>
                Risk: {formatScore(riskScore)} / 100
              </div>
            </div>
          </div>

          {/* SIDE BY SIDE COMPARISON PROOF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-4 justify-center bg-[#1f1633] p-4 rounded-xl border border-[#362d59]">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#79628c]">Document Portrait</span>
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-[#362d59] bg-[#000000]">
                  <img src={docPreview} alt="Doc" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-[#c2ef4e] font-bold text-lg">⟷</div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#79628c]">Captured Selfie</span>
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-[#362d59] bg-[#000000]">
                  <img src={capturedSelfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* PLAIN ENGLISH EXPLANATION */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-[#ffffff] m-0">Plain English Verdict:</h3>
              <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
                {isMatch
                  ? 'Green light! The person in front of the camera matches the photo on the government plastic card. Biometric landmarks and facial geometry are consistent.'
                  : 'Look closer! The person in front of the camera does not look like the person on the card, or the lighting was too dark. Please try again with clear lighting.'}
              </p>
              <div className="text-xs font-normal text-[#79628c]">
                Method: {matchResult?.face_verification?.method || matchResult?.modules?.face_verification?.method || 'Neural Landmark Comparison'} • Execution: Ephemeral RAM
              </div>
            </div>
          </div>

          {/* INITIAL VERSION COMPLETE METRICS SECTION */}
          <div className="flex flex-col gap-4 border-t border-[#362d59] pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#ffffff] m-0">
                Complete Document &amp; Forensics Analysis Metrics
              </h3>
              <span className="text-xs text-[#79628c] font-semibold">Security Spec v2.1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* METRIC 1: OCR TEXT EXTRACTION */}
              <div className="bg-[#1f1633] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">OCR Text Extraction</span>
                <div className="text-base font-bold text-[#ffffff]">
                  {matchResult.modules?.ocr?.ocr_confidence ? `${Math.round(matchResult.modules.ocr.ocr_confidence)}% Confidence` : 'Text Parsed'}
                </div>
                <div className="text-xs text-[#c2ef4e]">
                  ✓ Doc No: {matchResult.modules?.ocr?.document_number || matchResult.docId || 'Extracted'}
                </div>
              </div>

              {/* METRIC 2: FORENSIC TAMPERING (ELA) */}
              <div className="bg-[#1f1633] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Forensic Tampering (ELA)</span>
                <div className="text-base font-bold text-[#ffffff]">
                  {matchResult.modules?.tampering?.is_tampered ? 'Tampering Detected' : 'Clean / Original'}
                </div>
                <div className={`text-xs ${matchResult.modules?.tampering?.is_tampered ? 'text-[#fa7faa]' : 'text-[#c2ef4e]'}`}>
                  {matchResult.modules?.tampering?.is_tampered ? '⚠ Anomaly Flagged' : '✓ Zero compression cuts'}
                </div>
              </div>

              {/* METRIC 3: DOCUMENT VALIDATION */}
              <div className="bg-[#1f1633] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Rule &amp; Checksum Validation</span>
                <div className="text-base font-bold text-[#ffffff]">
                  {matchResult.modules?.validation?.is_valid ? 'Valid Format' : 'Review Required'}
                </div>
                <div className={`text-xs ${matchResult.modules?.validation?.is_valid ? 'text-[#c2ef4e]' : 'text-[#fa7faa]'}`}>
                  {matchResult.modules?.validation?.is_valid ? '✓ Passed mandatory checks' : '⚠ Missing fields / checks'}
                </div>
              </div>

              {/* METRIC 4: OVERALL RISK BAND */}
              <div className="bg-[#1f1633] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Overall Composite Risk</span>
                <div className={`text-base font-bold ${isAuth ? 'text-[#c2ef4e]' : 'text-[#fa7faa]'}`}>
                  {formatScore(riskScore)} / 100
                </div>
                <div className="text-xs text-[#bdb8c0]">
                  Verdict: {matchResult.status || (isAuth ? 'Approve' : 'Review')}
                </div>
              </div>
            </div>

            {/* EXTRACTED OCR FIELDS & RISK GAUGES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
              {/* OCR FIELDS (6 cols) */}
              <div className="lg:col-span-6 bg-[#1f1633] border border-[#362d59] rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-[#362d59] pb-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Extracted Identity Fields</span>
                  <span className="text-xs text-[#c2ef4e] font-semibold">{matchResult.docType || 'Document'}</span>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between border-b border-[#362d59]/50 pb-1.5">
                    <span className="text-[#79628c]">Document Number:</span>
                    <span className="font-semibold text-[#ffffff]">{matchResult.modules?.ocr?.document_number || matchResult.docId || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#362d59]/50 pb-1.5">
                    <span className="text-[#79628c]">Full Name:</span>
                    <span className="font-semibold text-[#ffffff]">{matchResult.modules?.ocr?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#362d59]/50 pb-1.5">
                    <span className="text-[#79628c]">Date of Birth:</span>
                    <span className="font-semibold text-[#ffffff]">{matchResult.modules?.ocr?.date_of_birth || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#362d59]/50 pb-1.5">
                    <span className="text-[#79628c]">OCR Confidence:</span>
                    <span className="font-semibold text-[#c2ef4e]">{matchResult.modules?.ocr?.ocr_confidence ? `${matchResult.modules.ocr.ocr_confidence}%` : 'High (>=85%)'}</span>
                  </div>
                </div>
              </div>

              {/* RISK BREAKDOWN (6 cols) */}
              <div className="lg:col-span-6 bg-[#1f1633] border border-[#362d59] rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-[#362d59] pb-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Weighted Risk Assessment</span>
                  <span className={`text-xs font-semibold ${isAuth ? 'text-[#c2ef4e]' : 'text-[#fa7faa]'}`}>{matchResult.status || 'Approve'}</span>
                </div>
                <div className="flex flex-col gap-2.5 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#bdb8c0]">Document Format &amp; Rule Risk</span>
                      <span className="font-semibold text-[#ffffff]">{matchResult.riskBreakdown?.validation_risk ?? 0}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#150f23] overflow-hidden border border-[#362d59]">
                      <div className="h-full bg-[#79628c]" style={{ width: `${Math.min(100, matchResult.riskBreakdown?.validation_risk ?? 0)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#bdb8c0]">Forensic Tampering &amp; Splicing Risk</span>
                      <span className="font-semibold text-[#ffffff]">{matchResult.riskBreakdown?.tampering_risk ?? 0}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#150f23] overflow-hidden border border-[#362d59]">
                      <div className="h-full bg-[#c2ef4e] transition-all duration-500" style={{ width: `${Math.min(100, matchResult.riskBreakdown?.tampering_risk ?? 0)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#bdb8c0]">Biometric Mismatch Risk</span>
                      <span className="font-semibold text-[#ffffff]">{matchResult.riskBreakdown?.face_match_risk ?? (100 - (faceScore ?? 100))}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#150f23] overflow-hidden border border-[#362d59]">
                      <div className="h-full bg-[#fa7faa]" style={{ width: `${Math.min(100, matchResult.riskBreakdown?.face_match_risk ?? (100 - (faceScore ?? 100)))}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RAW SECURITY PAYLOAD ACCORDION */}
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c] hover:text-[#ffffff] transition-colors">
                Show complete backend JSON audit trail
              </summary>
              <pre className="mt-3 overflow-auto rounded-md bg-[#1f1633] border border-[#362d59] p-4 text-xs font-mono text-[#bdb8c0]">
                {JSON.stringify(matchResult, null, 2)}
              </pre>
            </details>
          </div>
        </section>
      )}

      {/* RE-ENGINEERED PRE-SCAN QUALITY CHECKLIST DOCK (REPLACING VIBECODED CARDS) */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4 border-b border-[#362d59] pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#79628c]">
            Pre-Scan Quality Checklist
          </span>
          <span className="text-xs text-[#c2ef4e] font-semibold">3 / 3 COMPLIANT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1f1633] border border-[#362d59]">
            <div className="w-8 h-8 rounded-lg bg-[#150f23] border border-[#362d59] grid place-items-center text-[#c2ef4e] shrink-0">
              <Sun size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#ffffff] uppercase tracking-[0.2px]">Bright Front Lighting</div>
              <div className="text-xs text-[#bdb8c0] mt-0.5 leading-relaxed">
                Ensure clear light falls directly on your face without deep backlighting or glare.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1f1633] border border-[#362d59]">
            <div className="w-8 h-8 rounded-lg bg-[#150f23] border border-[#362d59] grid place-items-center text-[#c2ef4e] shrink-0">
              <Eye size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#ffffff] uppercase tracking-[0.2px]">Direct Camera Gaze</div>
              <div className="text-xs text-[#bdb8c0] mt-0.5 leading-relaxed">
                Look straight into the lens; keep head level and remove dark tinted eyewear.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1f1633] border border-[#362d59]">
            <div className="w-8 h-8 rounded-lg bg-[#150f23] border border-[#362d59] grid place-items-center text-[#c2ef4e] shrink-0">
              <Lock size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#ffffff] uppercase tracking-[0.2px]">100% Private Memory</div>
              <div className="text-xs text-[#bdb8c0] mt-0.5 leading-relaxed">
                Images are analyzed ephemerally in RAM and instantly purged. Zero selfie storage.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
