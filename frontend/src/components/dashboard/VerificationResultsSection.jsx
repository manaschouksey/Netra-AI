import React from 'react';
import ResultCard from '../common/ResultCard';
import ModuleCard from '../common/ModuleCard';
import { formatPercentage, formatScore } from '../../utils/formatters';

export default function VerificationResultsSection({
  verificationResult,
  riskScore,
  faceScore,
  faceStatus,
}) {
  if (!verificationResult) return null;

  const status = (verificationResult.status || 'UNKNOWN').toUpperCase();
  const isAuth = status.includes('AUTH') || status.includes('PASS') || status.includes('CLEAR') || status.includes('LOW');
  const isDanger = status.includes('FAIL') || status.includes('REJECT') || status.includes('HIGH');

  const statusColor = isAuth
    ? 'text-[#c2ef4e] border-[#362d59] bg-[#1f1633]'
    : isDanger
    ? 'text-[#fa7faa] border-[#362d59] bg-[#1f1633]'
    : 'text-[#bdb8c0] border-[#362d59] bg-[#1f1633]';

  return (
    <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[#ffffff] m-0">
            Final Verification Result
          </h2>
          <p className="text-xs font-mono text-[#bdb8c0] mt-1">
            Request ID: {verificationResult.requestId || 'N/A'}
          </p>
        </div>
        <div className={`rounded-md border px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2px] ${statusColor}`}>
          {verificationResult.status || 'UNKNOWN'}
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
        <ResultCard
          title="Risk Score"
          value={formatScore(riskScore)}
        />
        <ResultCard
          title="Face Match"
          value={formatPercentage(faceScore)}
        />
        <ResultCard
          title="Document"
          value={verificationResult.docType || 'Unknown'}
        />
        <ResultCard
          title="Verification"
          value={verificationResult.status || 'Unknown'}
        />
      </div>

      {/* FACE SCORE GRAPH */}
      <div className="mt-6 rounded-lg border border-[#362d59] p-5 bg-[#1f1633]">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#ffffff] m-0">
              Face Match Analysis
            </h3>
            <p className="text-xs text-[#bdb8c0] mt-0.5">
              Live score returned by biometric face match engine.
            </p>
          </div>
          <span className="text-xl font-bold font-mono text-[#c2ef4e]">
            {formatPercentage(faceScore)}
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#362d59]">
          <div
            className="h-full rounded-full bg-[#c2ef4e] transition-all duration-700"
            style={{
              width: `${Math.min(Math.max(faceScore || 0, 0), 100)}%`,
            }}
          />
        </div>

        {/* THRESHOLD LABELS */}
        <div className="mt-3 grid grid-cols-3 text-center text-xs">
          <div>
            <div className="font-semibold text-[#fa7faa]">LOW (&lt;50%)</div>
            <div className="text-[11px] text-[#bdb8c0]">Flagged / Mismatch</div>
          </div>
          <div>
            <div className="font-semibold text-[#79628c]">MEDIUM (50-79%)</div>
            <div className="text-[11px] text-[#bdb8c0]">Review required</div>
          </div>
          <div>
            <div className="font-semibold text-[#c2ef4e]">HIGH (≥80%)</div>
            <div className="text-[11px] text-[#bdb8c0]">Strong match</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c]">Face Match Status: </span>
          <span className="text-xs font-bold text-[#ffffff] ml-1.5">{faceStatus}</span>
        </div>
      </div>

      {/* MODULE STATUS CARDS */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2px] text-[#79628c] mb-3">
          Verification Modules
        </h3>
        <div className="grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
          <ModuleCard
            title="OCR Extraction"
            data={verificationResult.modules?.ocr}
          />
          <ModuleCard
            title="Document Validation"
            data={verificationResult.modules?.validation}
          />
          <ModuleCard
            title="Tampering Analysis"
            data={verificationResult.modules?.tampering}
          />
          <ModuleCard
            title="Face Verification"
            data={verificationResult.modules?.face_verification}
          />
        </div>
      </div>

      {/* RAW JSON INSPECTION */}
      <details className="mt-5">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c] hover:text-[#ffffff] transition-colors">
          Show complete backend response payload
        </summary>
        <pre className="mt-3 overflow-auto rounded-md bg-[#150f23] border border-[#362d59] p-4 text-xs font-mono text-[#bdb8c0]">
          {JSON.stringify(verificationResult, null, 2)}
        </pre>
      </details>
    </section>
  );
}

