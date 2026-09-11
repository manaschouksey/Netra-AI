/**
 * Application constants, status mappings, and thresholds.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const RECOMMENDATION_TO_STATUS = {
  Approve: 'Cleared',
  'Manual Review': 'Review',
  Reject: 'High Risk',
};

export const RISK_LEVELS = {
  LOW: { label: 'Low', max: 33, color: '#c2ef4e' },
  MODERATE: { label: 'Moderate', max: 66, color: '#79628c' },
  HIGH: { label: 'High', max: 100, color: '#fa7faa' },
};

export const ALLOWED_DOC_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.pdf';
export const ALLOWED_FACE_EXTENSIONS = '.jpg,.jpeg,.png,.webp';
