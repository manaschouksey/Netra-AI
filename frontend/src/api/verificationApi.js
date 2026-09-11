import { apiClient } from './client';

/**
 * Service for document authenticity and biometric verification.
 * Supports both verifyDocument(docFile, liveFile) and verifyDocument({ documentFile, livePhotoFile }).
 */
export async function verifyDocument(arg1, arg2) {
  let doc = arg1;
  let live = arg2;

  // Support both object argument { documentFile, livePhotoFile } and positional arguments (docFile, liveFile)
  if (arg1 && typeof arg1 === 'object' && !(arg1 instanceof Blob) && !(arg1 instanceof File)) {
    doc = arg1.documentFile;
    live = arg1.livePhotoFile;
  }

  if (!doc) {
    throw new Error('Please select a government document first.');
  }

  if (!live) {
    throw new Error('Please select a reference/live face photo.');
  }

  const formData = new FormData();
  formData.append('document', doc);

  // If live is a Blob without filename, provide 'selfie.jpg' so multipart parser detects it properly
  if (live instanceof Blob && !(live instanceof File)) {
    formData.append('live_photo', live, 'selfie.jpg');
  } else {
    formData.append('live_photo', live);
  }

  return await apiClient('/api/verify-document', {
    method: 'POST',
    body: formData,
  });
}
