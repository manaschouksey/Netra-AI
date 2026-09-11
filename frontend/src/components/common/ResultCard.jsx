import React from 'react';

/**
 * Metric highlight card formatted per DESIGN.md.
 */
export default function ResultCard({ title, value }) {
  return (
    <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2px] text-[#79628c]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[#ffffff] break-words">
        {value}
      </p>
    </div>
  );
}
