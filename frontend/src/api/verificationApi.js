import { apiClient } from './client';

/**
 * Service for document authenticity and biometric verification.
 * Supports both /api/verify-document and /api/v1/verify-document.
 */
export async function verifyDocument({ documentFile, livePhotoFile }) {
  if (!documentFile) {
    throw new Error('Please select a government document first.');
  }

  if (!livePhotoFile) {
    throw new Error('Please select a reference/live face photo.');
  }

  const formData = new FormData();
  formData.append('document', documentFile);
  formData.append('live_photo', livePhotoFile);

  return await apiClient('/api/verify-document', {
    method: 'POST',
    body: formData,
  });
}
