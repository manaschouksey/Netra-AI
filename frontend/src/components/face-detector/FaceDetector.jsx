/**
 * FaceDetector.jsx
 * ---------------------------------------------------------
 * Reusable, self-contained React component for FACE DETECTION.
 * Everything runs client-side via face-api.js.
 */

import React, { useEffect } from "react";
import useFaceDetector from "../../hooks/useFaceDetector";
import "./FaceDetector.css";

export default function FaceDetector({ onResult, autoStart = false, onCaptureReady }) {
  const {
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureSnapshot,
    result,
    error,
    isCameraOn,
    isLoading,
  } = useFaceDetector();

  useEffect(() => {
    if (typeof onCaptureReady === "function") {
      onCaptureReady(captureSnapshot);
    }
  }, [captureSnapshot, onCaptureReady]);

  // Bubble up detection results to the parent app, if provided
  useEffect(() => {
    if (typeof onResult === "function") {
      onResult(result);
    }
  }, [result, onResult]);

  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
  }, [autoStart, startCamera]);

  const statusClass = result.detected
    ? "fd-status fd-status-detected"
    : isCameraOn
    ? "fd-status fd-status-not-detected"
    : "fd-status fd-status-idle";

  const statusLabel = !isCameraOn
    ? "Camera Stopped"
    : result.detected
    ? result.faceCount > 1
      ? `Face Detected (${result.faceCount} faces)`
      : "Face Detected"
    : "Searching for face...";

  return (
    <div className="fd-container">
      {/* Viewport for live feed and bounding-box overlay */}
      <div className="fd-viewport">
        <video
          ref={videoRef}
          className="fd-video"
          autoPlay
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="fd-canvas" />

        {/* Placeholder overlay when camera is not running */}
        {!isCameraOn && (
          <div className="fd-placeholder">
            <div className="fd-placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <p>Camera is currently off</p>
            <span>Click "Start Camera" below to begin face detection</span>
          </div>
        )}

        {/* Loading overlay while models or webcam are initializing */}
        {isLoading && (
          <div className="fd-loading">
            <div className="fd-spinner" />
            <p>Initializing camera and detection models...</p>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="fd-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Status banner */}
      <div className={statusClass}>
        <div className="fd-status-dot" />
        <span className="fd-status-text">{statusLabel}</span>
        {result.detected && (
          <span className="fd-status-badge">
            {Math.round(result.confidence * 100)}% match
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="fd-controls">
        {!isCameraOn ? (
          <button
            type="button"
            className="fd-btn fd-btn-primary"
            onClick={startCamera}
            disabled={isLoading}
          >
            Start Camera
          </button>
        ) : (
          <button
            type="button"
            className="fd-btn fd-btn-danger"
            onClick={stopCamera}
          >
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}
