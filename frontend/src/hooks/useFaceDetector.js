/**
 * useFaceDetector
 * ---------------------------------------------------------
 * React hook that wraps FaceDetectorEngine and exposes a simple,
 * idiomatic React API.
 *
 * Usage:
 *   const {
 *     videoRef, canvasRef,
 *     startCamera, stopCamera,
 *     detectFace, result, error, isCameraOn, isLoading,
 *   } = useFaceDetector();
 */

import { useRef, useState, useCallback, useEffect } from "react";
import FaceDetectorEngine from "../engine/FaceDetectorEngine";

export default function useFaceDetector(options = {}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({
    detected: false,
    confidence: 0,
    faceCount: 0,
    faces: [],
  });

  // Create the engine instance once
  if (!engineRef.current) {
    engineRef.current = new FaceDetectorEngine(options);
  }

  const startCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await engineRef.current.init(videoRef.current, canvasRef.current);
      engineRef.current.onResult(setResult);
      await engineRef.current.startCamera();
      setIsCameraOn(true);
    } catch (err) {
      setError(err.message);
      setIsCameraOn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    try {
      engineRef.current?.stopCamera();
      setIsCameraOn(false);
      setResult({ detected: false, confidence: 0, faceCount: 0, faces: [] });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const detectFace = useCallback(async () => {
    if (!engineRef.current) return null;
    return await engineRef.current.detectFace();
  }, []);

  // Cleanup on unmount: stop camera + release webcam stream
  useEffect(() => {
    return () => {
      engineRef.current?.stopCamera();
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    detectFace,
    result,
    error,
    isCameraOn,
    isLoading,
  };
}
