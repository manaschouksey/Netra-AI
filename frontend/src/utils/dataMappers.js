import { stats as mockStats } from '../data/mockData';

export function extractFaceScore(verificationResult) {
  const face = verificationResult?.modules?.face_verification;
  if (!face) return null;

  const possibleValues = [
    face.score,
    face.similarity,
    face.similarity_score,
    face.confidence,
    face.match_score,
    face.match_percentage,
  ];

  const value = possibleValues.find((item) => typeof item === 'number');
  if (typeof value !== 'number') return null;

  // Normalize 0-1 to percentage
  return value >= 0 && value <= 1 ? value * 100 : value;
}

export function extractFaceStatus(verificationResult) {
  const face = verificationResult?.modules?.face_verification;
  if (!face) return 'UNKNOWN';

  return (
    face.status ||
    face.match_status ||
    face.recommendation ||
    'UNKNOWN'
  );
}

export function extractRiskScore(verificationResult) {
  const score = verificationResult?.riskScore;
  return typeof score === 'number' ? score : 0;
}

export function mapFaceVerificationPanelData(verificationResult) {
  const face = verificationResult?.modules?.face_verification;
  if (!face) return undefined;

  const faceScore = extractFaceScore(verificationResult);

  return {
    matchScore: faceScore !== null ? Math.round(faceScore * 10) / 10 : 0,
    livenessCheck:
      face.liveness_check ||
      face.livenessCheck ||
      (face.is_live === true
        ? 'Passed'
        : face.is_live === false
        ? 'Failed'
        : 'Not checked'),
    spoofAttempt:
      face.spoof_attempt ||
      face.spoofAttempt ||
      (face.is_spoof ? 'Detected' : 'None detected'),
    landmarksMatched: face.landmarks_matched ?? face.landmarksMatched ?? '—',
  };
}

export function mapExtractedInfoRows(verificationResult) {
  const ocr = verificationResult?.modules?.ocr;
  if (!ocr) return undefined;

  const rows = [
    { field: 'Document Type', value: ocr.document_type || 'Unknown' },
    { field: 'Document No.', value: ocr.document_number || 'Not detected' },
    { field: 'Full Name', value: ocr.name || 'Not detected' },
    { field: 'Date of Birth', value: ocr.date_of_birth || 'Not detected' },
    {
      field: 'OCR Confidence',
      value:
        typeof ocr.ocr_confidence === 'number'
          ? `${ocr.ocr_confidence}%`
          : 'N/A',
    },
  ];

  if (ocr.raw_text) {
    const snippet =
      ocr.raw_text.length > 160
        ? `${ocr.raw_text.slice(0, 160)}…`
        : ocr.raw_text;
    rows.push({ field: 'Raw OCR Text', value: snippet || '—' });
  }

  return rows;
}

export function mapAIVerificationRows(verificationResult) {
  const modules = verificationResult?.modules;
  if (!modules) return undefined;

  const ocr = modules.ocr || {};
  const validation = modules.validation || {};
  const tampering = modules.tampering || {};
  const faceScore = extractFaceScore(verificationResult);
  const faceStatus = extractFaceStatus(verificationResult);

  const ocrConfidence =
    typeof ocr.ocr_confidence === 'number' ? ocr.ocr_confidence : 0;

  const validationConfidence = validation.is_valid
    ? 100
    : Math.max(0, 100 - (validation.issues?.length || 0) * 25);

  const tamperConfidence = Math.max(0, 100 - (tampering.tamper_score || 0));
  const faceConfidence = faceScore !== null ? faceScore : 0;

  return [
    {
      check: 'OCR Extraction',
      result: ocrConfidence >= 60 ? 'Pass' : 'Review',
      confidence: ocrConfidence,
    },
    {
      check: 'Document Validation',
      result: validation.is_valid ? 'Pass' : 'Review',
      confidence: validationConfidence,
    },
    {
      check: 'Tampering Check',
      result: tampering.risk_level === 'low' ? 'Pass' : 'Review',
      confidence: tamperConfidence,
    },
    {
      check: 'Face Verification',
      result: faceStatus === 'MATCH' ? 'Pass' : 'Review',
      confidence: faceConfidence,
    },
  ];
}

export function mapTamperingPanelData(verificationResult) {
  const tampering = verificationResult?.modules?.tampering;
  if (!tampering) return undefined;

  const riskLevel = tampering.risk_level || 'unknown';

  return {
    overallFlag: `${riskLevel} anomaly`.replace(/^\w/, (c) => c.toUpperCase()),
    regions: [
      {
        area: 'Error Level Analysis',
        anomalyScore: Math.round(tampering.tamper_score ?? 0),
      },
    ],
    notes: tampering.notes,
  };
}

export function mapTimelineData(verificationResult, documentFile) {
  if (!verificationResult) return undefined;

  const modules = verificationResult.modules || {};
  const ocr = modules.ocr || {};
  const validation = modules.validation || {};
  const tampering = modules.tampering || {};
  const face = modules.face_verification || {};
  const riskScore = extractRiskScore(verificationResult);

  return [
    {
      time: 'Now',
      event: `Document uploaded: ${
        verificationResult.thumbnailLabel || documentFile?.name || 'document'
      }`,
    },
    {
      time: 'Now',
      event: `OCR extraction completed — ${
        typeof ocr.ocr_confidence === 'number'
          ? `${ocr.ocr_confidence}% confidence`
          : 'no confidence data'
      }`,
    },
    {
      time: 'Now',
      event: `Document validation ${
        validation.is_valid
          ? 'passed'
          : `raised ${validation.issues?.length || 0} issue(s)`
      }`,
    },
    {
      time: 'Now',
      event: `Tampering analysis completed — ${
        tampering.risk_level || 'unknown'
      } risk (score ${Math.round(tampering.tamper_score ?? 0)})`,
    },
    {
      time: 'Now',
      event: `Face verification completed — ${
        face.match === true
          ? 'match'
          : face.match === false
          ? 'no match'
          : 'presence only'
      }`,
    },
    {
      time: 'Now',
      event: `Risk score calculated: ${Math.round(riskScore)}/100 — ${
        verificationResult.status || 'awaiting decision'
      }`,
    },
  ];
}

export function mapDetailsPanelData(verificationResult) {
  if (!verificationResult) return undefined;

  const validation = verificationResult.modules?.validation;
  const riskScore = extractRiskScore(verificationResult);

  let priority = 'Low';
  if (riskScore >= 70) priority = 'High';
  else if (riskScore >= 35) priority = 'Medium';

  const notes =
    validation?.issues?.length > 0
      ? validation.issues.join('; ')
      : `Recommendation: ${
          verificationResult.status || 'Awaiting officer decision'
        }.`;

  return {
    caseId: `CASE-${verificationResult.requestId || 'UNKNOWN'}`,
    priority,
    assignedOfficer: verificationResult.officer || 'Officer System',
    location: 'Verification Portal',
    notes,
  };
}

export function mapRiskDistributionData(verificationResult) {
  const breakdown = verificationResult?.riskBreakdown;
  if (!breakdown) return undefined;

  return [
    {
      name: 'Validation',
      value: Math.round(breakdown.validation_risk ?? 0),
      color: '#c2ef4e',
    },
    {
      name: 'Tampering',
      value: Math.round(breakdown.tampering_risk ?? 0),
      color: '#79628c',
    },
    {
      name: 'Face Match',
      value: Math.round(breakdown.face_match_risk ?? 0),
      color: '#fa7faa',
    },
  ];
}

export function mapRiskScoreGaugeData(verificationResult) {
  if (!verificationResult) return undefined;

  const riskScore = extractRiskScore(verificationResult);
  const faceScore = extractFaceScore(verificationResult);

  let band = 'Low';
  if (riskScore >= 67) band = 'High';
  else if (riskScore >= 34) band = 'Moderate';

  const reasons = [];
  const validation = verificationResult.modules?.validation;
  const tampering = verificationResult.modules?.tampering;

  if (validation?.issues?.length) {
    reasons.push({ label: validation.issues[0], weight: 'medium' });
  }

  if (tampering?.risk_level) {
    reasons.push({
      label: `Tampering risk: ${tampering.risk_level} (score ${Math.round(
        tampering.tamper_score ?? 0
      )})`,
      weight:
        tampering.risk_level === 'high'
          ? 'high'
          : tampering.risk_level === 'medium'
          ? 'medium'
          : 'low',
    });
  }

  if (faceScore !== null) {
    reasons.push({
      label: `Face match confidence ${Math.round(faceScore)}%`,
      weight: faceScore >= 80 ? 'low' : faceScore >= 50 ? 'medium' : 'high',
    });
  }

  if (reasons.length === 0) {
    reasons.push({ label: 'No risk signals reported', weight: 'low' });
  }

  return { value: Math.round(riskScore), band, reasons };
}

export function mapSessionStatsData(history) {
  if (history.length === 0) return undefined;

  const reviewCount = history.filter((h) => h.status === 'Review').length;
  const highRiskCount = history.filter((h) => h.status === 'High Risk').length;

  return [
    {
      ...mockStats[0],
      value: `${history.length} this session`,
      delta: `${history.length} scan(s) analyzed`,
      trend: 'up',
    },
    {
      ...mockStats[1],
      value: String(reviewCount),
      delta: `${reviewCount} flagged for review`,
      trend: 'flat',
    },
    {
      ...mockStats[2],
      value: String(highRiskCount),
      delta: `${highRiskCount} this session`,
      trend: highRiskCount > 0 ? 'down' : 'up',
    },
    mockStats[3],
  ];
}
