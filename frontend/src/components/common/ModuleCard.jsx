import React from 'react';

/**
 * Individual verification pipeline module status card.
 */
export default function ModuleCard({ title, data }) {
  if (!data) {
    return (
      <div className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="mt-2 text-xs text-text-secondary">No result returned.</p>
      </div>
    );
  }

  const status =
    data.status ||
    data.result ||
    data.recommendation ||
    data.is_valid;

  return (
    <div className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      <p className="mt-2 text-sm text-text-secondary break-words">
        {typeof status === 'boolean'
          ? status
            ? 'PASSED'
            : 'FAILED'
          : status || 'PROCESSED'}
      </p>
    </div>
  );
}
