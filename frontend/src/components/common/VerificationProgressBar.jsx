/**
 * VerificationProgressBar — Netra-TrustID
 * =========================================
 * A premium animated progress display shown while the backend processes
 * the uploaded document. Renders stage labels, animated bar, and spinner.
 *
 * Props
 * -----
 * progress    : number   0-100
 * stageLabel  : string   current stage name
 * stageDetail : string   technical detail for that stage
 * stageIdx    : number   current stage index
 * isComplete  : bool     true when verification finished
 */

import React from 'react';
import { STAGES } from '../../hooks/useVerificationProgress';
import { ScanLine, Cpu, ShieldCheck, Brain, BarChart2, CheckCircle2 } from 'lucide-react';

const STAGE_ICONS = [ScanLine, Cpu, ShieldCheck, Brain, BarChart2];

function PipelineStep({ icon: Icon, label, state }) {
  // state: 'done' | 'active' | 'pending'
  return (
    <div className={`flex items-center gap-2 transition-all duration-300 ${
      state === 'pending' ? 'opacity-30' : 'opacity-100'
    }`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
        state === 'done'
          ? 'bg-[#c2ef4e] text-[#1f1633]'
          : state === 'active'
          ? 'bg-[#1f1633] border border-[#c2ef4e] text-[#c2ef4e]'
          : 'bg-[#1f1633] border border-[#362d59] text-[#79628c]'
      }`}>
        {state === 'done' ? (
          <CheckCircle2 size={12} strokeWidth={2.5} />
        ) : (
          <Icon size={11} strokeWidth={state === 'active' ? 2.5 : 1.8} className={state === 'active' ? 'animate-pulse' : ''} />
        )}
      </div>
      <span className={`text-[11px] font-medium transition-colors duration-300 ${
        state === 'done'   ? 'text-[#c2ef4e]'  :
        state === 'active' ? 'text-[#ffffff]'   :
                             'text-[#79628c]'
      }`}>
        {label}
      </span>
    </div>
  );
}

const STEP_LABELS = [
  'Upload',
  'OCR Scan',
  'Tampering',
  'Face Match',
  'Risk Score',
];

export default function VerificationProgressBar({
  progress,
  stageLabel,
  stageDetail,
  stageIdx,
  isComplete,
}) {
  const displayProgress = Math.min(100, Math.max(0, progress));

  return (
    <section className="bg-[#150f23] border border-[#362d59] rounded-2xl p-6 flex flex-col gap-6 animate-fade-in-up">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {isComplete ? (
            <div className="w-9 h-9 rounded-xl bg-[#c2ef4e]/15 border border-[#c2ef4e]/40 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-[#c2ef4e]" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#1f1633] border border-[#362d59] flex items-center justify-center relative">
              <div className="w-5 h-5 rounded-full border-2 border-[#362d59] border-t-[#c2ef4e] animate-spin" />
            </div>
          )}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#79628c]">
              {isComplete ? 'Analysis Complete' : 'AI Pipeline Running'}
            </div>
            <div className="text-sm font-bold text-[#ffffff] mt-0.5 leading-tight">
              {isComplete ? 'All checks done — building result...' : stageLabel}
            </div>
          </div>
        </div>

        <div className="text-3xl font-bold font-mono text-[#c2ef4e] tabular-nums">
          {displayProgress}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="relative h-3 w-full rounded-full bg-[#1f1633] border border-[#362d59] overflow-hidden">
          {/* Animated shimmer track */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(194,239,78,0.06) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: isComplete ? 'none' : 'shimmer 1.5s linear infinite',
            }}
          />
          {/* Fill bar */}
          <div
            className="h-full rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${displayProgress}%`,
              background: isComplete
                ? '#c2ef4e'
                : 'linear-gradient(90deg, #79628c 0%, #c2ef4e 100%)',
              boxShadow: displayProgress > 0 ? '0 0 10px rgba(194,239,78,0.4)' : 'none',
            }}
          />
        </div>

        {/* Stage detail */}
        {!isComplete && stageDetail && (
          <div className="text-[11px] text-[#79628c] font-mono">
            ⟶ {stageDetail}
          </div>
        )}
      </div>

      {/* Pipeline steps */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STAGES.map((s, i) => {
          const state =
            isComplete             ? 'done'    :
            i < stageIdx           ? 'done'    :
            i === stageIdx         ? 'active'  :
                                     'pending';
          const Icon = STAGE_ICONS[i] ?? Cpu;
          return (
            <PipelineStep
              key={s.id}
              icon={Icon}
              label={STEP_LABELS[i]}
              state={state}
            />
          );
        })}
      </div>

      {/* Shimmer keyframe injected inline */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </section>
  );
}
