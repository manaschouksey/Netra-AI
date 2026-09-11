import React from 'react';
import { ALLOWED_DOC_EXTENSIONS, ALLOWED_FACE_EXTENSIONS } from '../../constants';

export default function DocumentUploadSection({
  documentFile,
  livePhotoFile,
  onDocumentChange,
  onLivePhotoChange,
  onVerify,
  isVerifying,
  error,
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-text-primary">
          Government ID Verification
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Upload a government document and a reference face to perform the complete verification pipeline.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[800px]:grid-cols-1">
        {/* DOCUMENT INPUT */}
        <div className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Government Document
          </label>
          <input
            type="file"
            accept={ALLOWED_DOC_EXTENSIONS}
            onChange={onDocumentChange}
            className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:bg-white/10 file:text-text-primary hover:file:bg-white/20 cursor-pointer"
          />
          {documentFile && (
            <div className="mt-3 text-xs text-text-secondary">
              Selected: {documentFile.name}
            </div>
          )}
        </div>

        {/* LIVE PHOTO INPUT */}
        <div className="rounded-lg border border-white/10 p-4 bg-white/[0.02]">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Reference / Live Face
          </label>
          <input
            type="file"
            accept={ALLOWED_FACE_EXTENSIONS}
            onChange={onLivePhotoChange}
            className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:bg-white/10 file:text-text-primary hover:file:bg-white/20 cursor-pointer"
          />
          {livePhotoFile && (
            <div className="mt-3 text-xs text-text-secondary">
              Selected: {livePhotoFile.name}
            </div>
          )}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ❌ {error}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onVerify}
          disabled={isVerifying || !documentFile || !livePhotoFile}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isVerifying ? 'Analyzing...' : 'Start Verification'}
        </button>
      </div>
    </section>
  );
}
