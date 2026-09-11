/**
 * Helper formatting utilities.
 */

export function formatPercentage(val) {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${Math.round(Number(val))}%`;
}

export function formatScore(val) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return `${Math.round(Number(val))}`;
}

export function formatCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
