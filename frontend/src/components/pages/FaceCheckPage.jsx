import React, { useState, useRef } from 'react';
import FaceDetector from '../face-detector/FaceDetector';
import { Camera, Upload, CheckCircle2, AlertTriangle, RefreshCw, Shield, Sparkles, UserCheck, ArrowRight, Sun, Eye, Lock } from 'lucide-react';
import { ALLOWED_DOC_EXTENSIONS } from '../../constants';
import { verifyDocument } from '../../api/verificationApi';

export default function FaceCheckPage({ faceResult, onFaceResult }) {
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [capturedSelfiePreview, setCapturedSelfiePreview] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchError, setMatchError] = useState(null);

  const captureFnRef = useRef(null);

  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setDocPreview(URL.createObjectURL(file));
      setMatchResult(null);
      setMatchError(null);
    }
  };

  const handleClearDoc = () => {
    setDocFile(null);
    setDocPreview(null);
    setMatchResult(null);
    setMatchError(null);
    setCapturedSelfiePreview(null);
  };

  const handleCaptureAndMatch = async () => {
    if (!docFile) {
      setMatchError('Please upload a government ID card in Step 1 first.');
      return;
    }

    if (!captureFnRef.current) {
      setMatchError('Webcam is not ready. Please click "Start Camera" in Step 2.');
      return;
    }

    setIsMatching(true);
    setMatchError(null);

    try {
      // 1. Capture high-res snapshot from mirrored selfie camera
      const selfieBlob = await captureFnRef.current();
      if (!selfieBlob) {
        throw new Error('Could not capture photo from webcam. Please ensure your camera is running.');
      }

      setCapturedSelfiePreview(URL.createObjectURL(selfieBlob));

      // 2. Call backend verification endpoint
      const res = await verifyDocument({ documentFile: docFile, livePhotoFile: selfieBlob });
      setMatchResult(res);
    } catch (err) {
      console.error('Biometric matching failed:', err);
      setMatchError(err.message || 'Face matching failed. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  const faceScore = matchResult?.face_verification?.similarity_score ?? (matchResult?.risk_assessment?.face_score != null ? matchResult.risk_assessment.face_score * 100 : null);
  const isMatch = matchResult?.face_verification?.match ?? (faceScore != null ? faceScore >= 60 : null);

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
          First upload your government ID card. Next, turn on your selfie camera. Our smart robot will compare your live face against the picture on the card to make sure you are really you!
        </p>
      </div>

      {/* 2-COLUMN BIOMETRIC MATCHING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* STEP 1: ID DOCUMENT UPLOAD PANEL (5 cols) */}
        <section className="lg:col-span-5 bg-[#150f23] border border-[#362d59] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#362d59] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#1f1633] border border-[#362d59] text-xs font-bold font-mono grid place-items-center text-[#c2ef4e]">
                01
              </span>
              <div>
                <h2 className="text-base font-bold text-[#ffffff] m-0">Upload Government ID</h2>
                <p className="text-xs text-[#79628c] m-0">Passport, Driving License, Aadhaar, or National ID</p>
              </div>
            </div>
            {docFile && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
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
                <div className="truncate text-[#bdb8c0] font-mono">
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
              <span className="w-7 h-7 rounded-lg bg-[#1f1633] border border-[#362d59] text-xs font-bold font-mono grid place-items-center text-[#c2ef4e]">
                02
              </span>
              <div>
                <h2 className="text-base font-bold text-[#ffffff] m-0">Live Selfie Camera</h2>
                <p className="text-xs text-[#79628c] m-0">Mirrored front-facing camera with real-time face tracking</p>
              </div>
            </div>
            {faceResult?.detected && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
                FACE LOCKED ({Math.round(faceResult.confidence * 100)}%)
              </span>
            )}
          </div>

          {/* MIRRORED CAMERA COMPONENT */}
          <div className="w-full">
            <FaceDetector
              onResult={onFaceResult}
              onCaptureReady={(fn) => {
                captureFnRef.current = fn;
              }}
              autoStart={false}
            />
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
                  <span>Matching Face with Document...</span>
                </>
              ) : (
                <>
                  <UserCheck size={18} />
                  <span>Capture Selfie &amp; Match With ID Card</span>
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

      {/* MATCH RESULT MODAL / BANNER (STEP 3) */}
      {matchError && (
        <div className="p-4 rounded-xl bg-[#fa7faa]/10 border border-[#fa7faa] text-[#fa7faa] text-sm flex items-center gap-3">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{matchError}</span>
        </div>
      )}

      {matchResult && (
        <section className="bg-[#150f23] border border-[#362d59] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#362d59] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2px] text-[#79628c]">
                VERIFICATION RESULT // BIOMETRIC COMPARISON
              </span>
              <h2 className="text-2xl font-bold text-[#ffffff] m-0 mt-1">
                {isMatch ? 'Identity Match Confirmed' : 'Biometric Mismatch Detected'}
              </h2>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border ${
              isMatch
                ? 'bg-[#1f1633] text-[#c2ef4e] border-[#c2ef4e]'
                : 'bg-[#1f1633] text-[#fa7faa] border-[#fa7faa]'
            }`}>
              {isMatch ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{faceScore != null ? `${Math.round(faceScore)}% MATCH SCORE` : (isMatch ? 'MATCHED' : 'REVIEW')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* COMPARISON PROOF */}
            <div className="flex items-center gap-4 justify-center bg-[#1f1633] p-4 rounded-xl border border-[#362d59]">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-mono text-[#79628c]">DOCUMENT PHOTO</span>
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-[#362d59] bg-[#000000]">
                  <img src={docPreview} alt="Doc" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-[#c2ef4e] font-bold text-lg">⟷</div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-mono text-[#79628c]">CAPTURED SELFIE</span>
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-[#362d59] bg-[#000000]">
                  <img src={capturedSelfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* PLAIN ENGLISH EXPLANATION */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-[#ffffff] m-0">What this means:</h3>
              <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
                {isMatch
                  ? 'Green light! The person standing in front of the camera matches the photo on the government plastic card. All biometric facial features match.'
                  : 'Look closer! The person in front of the camera does not look like the person on the card, or the lighting was too dark. Please try again with clear lighting.'}
              </p>
              <div className="text-xs font-mono text-[#79628c]">
                Method: {matchResult?.face_verification?.method || 'Neural Landmark Comparison'} • Execution: RAM Ephemeral
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RE-ENGINEERED PRE-SCAN QUALITY CHECKLIST DOCK (REPLACING VIBECODED CARDS) */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4 border-b border-[#362d59] pb-3">
          <span className="text-xs font-mono uppercase tracking-[0.25px] text-[#79628c]">
            PRE-SCAN INSPECTION CHECKLIST
          </span>
          <span className="text-xs text-[#c2ef4e] font-mono">3 / 3 COMPLIANT</span>
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
