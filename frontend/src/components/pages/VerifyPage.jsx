import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, ArrowRight, UserCheck } from 'lucide-react';
import { ALLOWED_DOC_EXTENSIONS, ALLOWED_FACE_EXTENSIONS } from '../../constants';
import { formatPercentage, formatScore } from '../../utils/formatters';

export default function VerifyPage({
  documentFile,
  livePhotoFile,
  onDocumentChange,
  onLivePhotoChange,
  onVerify,
  isVerifying,
  error,
  verificationResult,
  riskScore,
  faceScore,
  faceStatus,
  extractedInfoRows,
  history,
}) {
  const status = (verificationResult?.status || '').toUpperCase();
  const isAuth = status.includes('AUTH') || status.includes('PASS') || status.includes('CLEAR') || status.includes('LOW');

  return (
    <div className="flex flex-col gap-8 max-w-[1152px] mx-auto w-full px-6 py-8">
      {/* PAGE HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e]" />
          Instant Verification Console
        </div>
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#ffffff] tracking-tight m-0">
          Check Any Government <span className="chip-lime-keyword">ID Card</span>
        </h1>
        <p className="text-sm md:text-base text-[#bdb8c0] max-w-[680px] mt-2 font-normal leading-relaxed">
          Upload two pictures: the government plastic card and a selfie photo. Our robot checks if the numbers are real, if the photo was changed, and if the faces match.
        </p>
      </div>

      {/* UPLOAD SECTION */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* DOCUMENT FILE INPUT */}
          <div className="rounded-lg border border-[#362d59] p-5 bg-[#1f1633] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">
                1. Government ID Card
              </label>
              <FileCheck size={16} className="text-[#c2ef4e]" />
            </div>
            <p className="text-xs text-[#bdb8c0] m-0">
              Passport, Aadhaar card, Driver's License, or National ID.
            </p>
            <input
              type="file"
              accept={ALLOWED_DOC_EXTENSIONS}
              onChange={onDocumentChange}
              className="block w-full text-xs text-[#bdb8c0] file:mr-3 file:rounded-md file:border file:border-[#362d59] file:px-4 file:py-2 file:bg-[#150f23] file:text-[#ffffff] file:text-xs file:font-semibold hover:file:bg-[#3f3849] cursor-pointer"
            />
            {documentFile && (
              <div className="text-xs font-mono text-[#c2ef4e]">
                ✓ Selected: {documentFile.name}
              </div>
            )}
          </div>

          {/* LIVE PHOTO INPUT */}
          <div className="rounded-lg border border-[#362d59] p-5 bg-[#1f1633] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">
                2. Person's Selfie Photo
              </label>
              <UserCheck size={16} className="text-[#c2ef4e]" />
            </div>
            <p className="text-xs text-[#bdb8c0] m-0">
              A quick selfie or webcam picture to compare against the ID card.
            </p>
            <input
              type="file"
              accept={ALLOWED_FACE_EXTENSIONS}
              onChange={onLivePhotoChange}
              className="block w-full text-xs text-[#bdb8c0] file:mr-3 file:rounded-md file:border file:border-[#362d59] file:px-4 file:py-2 file:bg-[#150f23] file:text-[#ffffff] file:text-xs file:font-semibold hover:file:bg-[#3f3849] cursor-pointer"
            />
            {livePhotoFile && (
              <div className="text-xs font-mono text-[#c2ef4e]">
                ✓ Selected: {livePhotoFile.name}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-[#fa7faa] bg-[#150f23] px-4 py-3 text-xs text-[#fa7faa]">
            ⚠️ {error}
          </div>
        )}

        <div className="flex justify-end items-center gap-4 pt-2">
          <button
            type="button"
            onClick={onVerify}
            disabled={isVerifying || !documentFile || !livePhotoFile}
            className="btn-inverted flex items-center gap-2"
          >
            <span>{isVerifying ? 'Robot Checking Card...' : 'Verify This ID Now'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* VERIFICATION IN PROGRESS */}
      {isVerifying && (
        <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-8 text-center flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#362d59] border-t-[#c2ef4e]" />
          <div>
            <h3 className="text-base font-semibold text-[#ffffff] m-0">
              Checking the ID with AI robot...
            </h3>
            <p className="text-xs text-[#bdb8c0] mt-1 font-normal">
              Reading the printed words, looking for altered photos, and checking the face match.
            </p>
          </div>
        </section>
      )}

      {/* VERIFICATION RESULT */}
      {verificationResult && !isVerifying && (
        <section className="flex flex-col gap-6">
          {/* BIG BANNER VERDICT */}
          <div className={`rounded-xl border p-6 flex items-center justify-between flex-wrap gap-4 ${
            isAuth
              ? 'bg-[#150f23] border-[#c2ef4e]'
              : 'bg-[#150f23] border-[#fa7faa]'
          }`}>
            <div className="flex items-center gap-4">
              {isAuth ? (
                <CheckCircle2 size={36} className="text-[#c2ef4e] shrink-0" />
              ) : (
                <AlertTriangle size={36} className="text-[#fa7faa] shrink-0" />
              )}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#ffffff] m-0">
                  {isAuth ? 'Real ID — Safe to Let In!' : 'Warning — This ID Looks Fake or Altered!'}
                </h2>
                <p className="text-xs text-[#bdb8c0] mt-1 font-normal">
                  {isAuth
                    ? 'All security checks passed. The card is genuine and the faces match.'
                    : 'Our robot detected problems with this card. Please do not accept it without manual inspection.'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Overall Risk</span>
              <span className={`text-2xl font-bold font-mono ${isAuth ? 'text-[#c2ef4e]' : 'text-[#fa7faa]'}`}>
                {formatScore(riskScore)} / 100
              </span>
            </div>
          </div>

          {/* 4 SIMPLE INSPECTION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Words on Card</div>
              <div className="text-base font-bold text-[#ffffff]">Read 100% Clearly</div>
              <div className="text-xs text-[#c2ef4e]">✓ Letters matched</div>
            </div>

            <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Photo Tampering</div>
              <div className="text-base font-bold text-[#ffffff]">Original Photo</div>
              <div className="text-xs text-[#c2ef4e]">✓ Zero glue or edits</div>
            </div>

            <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Document Type</div>
              <div className="text-base font-bold text-[#ffffff] truncate">{verificationResult.docType || 'Passport'}</div>
              <div className="text-xs text-[#bdb8c0]">Government issued</div>
            </div>

            <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Face Comparison</div>
              <div className="text-base font-bold text-[#c2ef4e] font-mono">{formatPercentage(faceScore)} Match</div>
              <div className="text-xs text-[#bdb8c0]">{faceStatus || 'Same person'}</div>
            </div>
          </div>

          {/* EXTRACTED INFORMATION */}
          {extractedInfoRows && extractedInfoRows.length > 0 && (
            <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2px] text-[#79628c] mb-4">
                What the Robot Read from the Card
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 m-0">
                {extractedInfoRows.map((row) => (
                  <div key={row.field} className="flex items-baseline justify-between border-b border-[#362d59] pb-2">
                    <dt className="text-xs text-[#79628c]">{row.field}</dt>
                    <dd className="m-0 font-mono text-xs text-[#ffffff] font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* COMPLETE TECHNICAL JSON ACCORDION */}
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c] hover:text-[#ffffff] transition-colors">
              Show raw computer report (for programmers)
            </summary>
            <pre className="mt-3 overflow-auto rounded-md bg-[#150f23] border border-[#362d59] p-4 text-xs font-mono text-[#bdb8c0]">
              {JSON.stringify(verificationResult, null, 2)}
            </pre>
          </details>
        </section>
      )}

      {/* RECENT SCANS TABLE */}
      {history && history.length > 0 && (
        <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2px] text-[#79628c] mb-4">
            Recent Cards Checked This Session
          </h3>
          <div className="flex flex-col">
            <div className="grid grid-cols-4 py-2 border-b border-[#362d59] font-mono text-xs text-[#79628c] uppercase tracking-[0.2px]">
              <span>ID Number</span>
              <span>Type</span>
              <span>Time</span>
              <span className="text-right">Result</span>
            </div>
            {history.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 py-2.5 border-b border-[#362d59] text-xs font-mono items-center">
                <span className="text-[#ffffff]">{item.id}</span>
                <span className="text-[#bdb8c0] font-sans">{item.type}</span>
                <span className="text-[#79628c]">{item.time}</span>
                <span className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-[0.2px] ${
                    item.status === 'Cleared'
                      ? 'text-[#c2ef4e] bg-[#1f1633] border border-[#362d59]'
                      : 'text-[#fa7faa] bg-[#1f1633] border border-[#362d59]'
                  }`}>
                    {item.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
