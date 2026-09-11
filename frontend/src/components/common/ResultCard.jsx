import React from 'react';

/**
 * High-level key metric highlight card.
 */
export default function ResultCard({ title, value }) {
  return (
    <div className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
      <p className="text-xs text-text-secondary">{title}</p>
      <p className="mt-2 text-xl font-bold text-text-primary break-words">
        {value}
      </p>
    </div>
  );
}
