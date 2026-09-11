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

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Final Verification Result
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Request ID: {verificationResult.requestId || 'N/A'}
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold bg-white/[0.04]">
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
      <div className="mt-6 rounded-lg border border-white/10 p-5 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-text-primary">
              Face Match Analysis
            </h3>
            <p className="text-xs text-text-secondary">
              Real result returned by the face recognition backend.
            </p>
          </div>
          <span className="text-xl font-bold text-text-primary">
            {formatPercentage(faceScore)}
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="relative h-5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{
              width: `${Math.min(Math.max(faceScore || 0, 0), 100)}%`,
            }}
          />
        </div>

        {/* THRESHOLD LABELS */}
        <div className="mt-3 grid grid-cols-3 text-center text-xs">
          <div>
            <div className="font-semibold text-text-primary">LOW</div>
            <div className="text-text-secondary">Low confidence</div>
          </div>
          <div>
            <div className="font-semibold text-text-primary">MEDIUM</div>
            <div className="text-text-secondary">Review required</div>
          </div>
          <div>
            <div className="font-semibold text-text-primary">HIGH</div>
            <div className="text-text-secondary">Strong match</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm font-semibold">Face Match Status: </span>
          <span className="text-sm">{faceStatus}</span>
        </div>
      </div>

      {/* MODULE STATUS CARDS */}
      <div className="mt-6">
        <h3 className="font-semibold text-text-primary mb-3">
          Verification Modules
        </h3>
        <div className="grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
          <ModuleCard
            title="OCR"
            data={verificationResult.modules?.ocr}
          />
          <ModuleCard
            title="Document Validation"
            data={verificationResult.modules?.validation}
          />
          <ModuleCard
            title="Tampering"
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
        <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
          Show complete backend response
        </summary>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/30 p-4 text-xs text-text-secondary">
          {JSON.stringify(verificationResult, null, 2)}
        </pre>
      </details>
    </section>
  );
}
