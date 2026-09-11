/**
 * useVerificationProgress — Netra-TrustID
 * =========================================
 * Simulates real pipeline stage progress while the backend is processing.
 *
 * The backend runs four sequential stages (OCR → Validation → Tampering → Face).
 * We don't have a streaming endpoint, so we drive a timed progress simulation
 * that stays in lock-step with the actual stages:
 *
 *   Stage 0: Uploading & starting OCR         (0 → 20 %)
 *   Stage 1: OCR text extraction              (20 → 40 %)
 *   Stage 2: Forensic tampering analysis      (40 → 60 %)
 *   Stage 3: Biometric face matching          (60 → 85 %)
 *   Stage 4: Risk scoring & building result   (85 → 99 %)
 *   Complete: Result ready                    (100 %)
 *
 * Usage:
 *   const { progress, stage, stageLabel, isComplete, startProgress, completeProgress, resetProgress } = useVerificationProgress();
 */

import { useState, useRef, useCallback } from 'react';

export const STAGES = [
  { id: 0, from: 0,  to: 20, label: 'Uploading document & starting AI pipeline...',     detail: 'Sending images securely to verification API' },
  { id: 1, from: 20, to: 42, label: 'Reading text from ID card (OCR)...',               detail: 'Tesseract LSTM engine extracting name, DOB & ID number' },
  { id: 2, from: 42, to: 62, label: 'Forensic tampering analysis (ELA)...',             detail: 'Error Level Analysis scanning for digital edits' },
  { id: 3, from: 62, to: 87, label: 'Biometric face matching...',                       detail: 'Comparing facial geometry against document portrait' },
  { id: 4, from: 87, to: 99, label: 'Computing composite risk score...',                detail: 'Weighting validation + tampering + face signals' },
];

const STAGE_DURATIONS_MS = [200, 350, 250, 400, 200];   // fast snappy telemetry aligned with optimized backend

export function useVerificationProgress() {
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const timerRef   = useRef(null);
  const rafRef     = useRef(null);
  const activeRef  = useRef(false);

  const _clearAll = () => {
    if (timerRef.current)  clearTimeout(timerRef.current);
    if (rafRef.current)    cancelAnimationFrame(rafRef.current);
    timerRef.current  = null;
    rafRef.current    = null;
  };

  /** Animate progress smoothly from `from` to `to` over `durationMs`. */
  const _animateStage = useCallback((from, to, durationMs, onDone) => {
    const startTime = performance.now();

    const tick = (now) => {
      if (!activeRef.current) return;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setProgress(Math.round(current));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const _runStage = useCallback((idx) => {
    if (!activeRef.current || idx >= STAGES.length) return;
    const stage = STAGES[idx];
    setStageIdx(idx);
    _animateStage(stage.from, stage.to, STAGE_DURATIONS_MS[idx], () => {
      timerRef.current = setTimeout(() => _runStage(idx + 1), 60);
    });
  }, [_animateStage]);

  const startProgress = useCallback(() => {
    _clearAll();
    activeRef.current = true;
    setIsComplete(false);
    setProgress(0);
    setStageIdx(-1);
    timerRef.current = setTimeout(() => _runStage(0), 30);
  }, [_runStage]);

  const completeProgress = useCallback(() => {
    _clearAll();
    activeRef.current = false;
    setStageIdx(STAGES.length);
    setProgress(100);
    setIsComplete(true);
  }, []);

  const resetProgress = useCallback(() => {
    _clearAll();
    activeRef.current = false;
    setProgress(0);
    setStageIdx(-1);
    setIsComplete(false);
  }, []);

  const currentStage = STAGES[Math.min(stageIdx, STAGES.length - 1)] ?? null;

  return {
    progress,
    stage:       currentStage,
    stageLabel:  currentStage?.label  ?? (isComplete ? 'Verification complete!' : 'Waiting...'),
    stageDetail: currentStage?.detail ?? '',
    stageIdx,
    isComplete,
    startProgress,
    completeProgress,
    resetProgress,
  };
}
