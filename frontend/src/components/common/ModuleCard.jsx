import React from 'react';

/**
 * Verification pipeline module status card per DESIGN.md.
 */
export default function ModuleCard({ title, data }) {
  if (!data) {
    return (
      <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2px] text-[#79628c]">{title}</p>
        <p className="mt-2 text-xs text-[#bdb8c0]">No result returned.</p>
      </div>
    );
  }

  const status =
    data.status ||
    data.result ||
    data.recommendation ||
    data.is_valid;

  const statusLabel =
    typeof status === 'boolean'
      ? status
        ? 'PASSED'
        : 'FAILED'
      : (status || 'PROCESSED').toString().toUpperCase();

  const isPass = statusLabel === 'PASSED' || statusLabel === 'PASS' || statusLabel === 'APPROVE' || statusLabel === 'CLEARED';
  const isFail = statusLabel === 'FAILED' || statusLabel === 'FAIL' || statusLabel === 'REJECT' || statusLabel === 'HIGH RISK';

  const statusColor = isPass
    ? 'text-[#c2ef4e]'
    : isFail
    ? 'text-[#fa7faa]'
    : 'text-[#bdb8c0]';

  return (
    <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2px] text-[#79628c]">{title}</p>
      <p className={`mt-2 text-sm font-bold tracking-[0.2px] break-words ${statusColor}`}>
        {statusLabel}
      </p>
    </div>
  );
}
