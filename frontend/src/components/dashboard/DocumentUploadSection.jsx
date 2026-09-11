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
    <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6">
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold text-[#ffffff] m-0">
          Government ID Verification
        </h2>
        <p className="text-[13px] text-[#bdb8c0] mt-1">
          Upload a government document and a reference face to perform the complete verification pipeline.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[800px]:grid-cols-1">
        {/* DOCUMENT INPUT */}
        <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
          <label className="block text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c] mb-2.5">
            Government Document
          </label>
          <input
            type="file"
            accept={ALLOWED_DOC_EXTENSIONS}
            onChange={onDocumentChange}
            className="block w-full text-xs text-[#bdb8c0] file:mr-3 file:rounded-md file:border file:border-[#362d59] file:px-3 file:py-1.5 file:bg-[#150f23] file:text-[#ffffff] file:text-xs file:font-semibold hover:file:bg-[#3f3849] cursor-pointer"
          />
          {documentFile && (
            <div className="mt-2 text-xs font-mono text-[#c2ef4e]">
              Selected: {documentFile.name}
            </div>
          )}
        </div>

        {/* LIVE PHOTO INPUT */}
        <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
          <label className="block text-xs font-semibold uppercase tracking-[0.2px] text-[#79628c] mb-2.5">
            Reference / Live Face
          </label>
          <input
            type="file"
            accept={ALLOWED_FACE_EXTENSIONS}
            onChange={onLivePhotoChange}
            className="block w-full text-xs text-[#bdb8c0] file:mr-3 file:rounded-md file:border file:border-[#362d59] file:px-3 file:py-1.5 file:bg-[#150f23] file:text-[#ffffff] file:text-xs file:font-semibold hover:file:bg-[#3f3849] cursor-pointer"
          />
          {livePhotoFile && (
            <div className="mt-2 text-xs font-mono text-[#c2ef4e]">
              Selected: {livePhotoFile.name}
            </div>
          )}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mt-4 rounded-md border border-[#fa7faa] bg-[#150f23] px-4 py-3 text-xs text-[#fa7faa]">
          {error}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onVerify}
          disabled={isVerifying || !documentFile || !livePhotoFile}
          className="btn-inverted"
        >
          {isVerifying ? 'Analyzing...' : 'Start Verification'}
        </button>
      </div>
    </section>
  );
}

