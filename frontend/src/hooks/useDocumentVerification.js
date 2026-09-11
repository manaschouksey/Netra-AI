import { useState, useEffect, useRef } from 'react';
import { verifyDocument } from '../api/verificationApi';
import { RECOMMENDATION_TO_STATUS } from '../constants';
import { formatCurrentTime } from '../utils/formatters';

export function useDocumentVerification() {
  const [documentFile, setDocumentFile] = useState(null);
  const [livePhotoFile, setLivePhotoFile] = useState(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState(null);

  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const previewUrlRef = useRef(null);

  // Revoke object URL on unmount or URL replacement to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleDocumentChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    let newPreviewUrl = null;
    if (file && file.type.startsWith('image/')) {
      newPreviewUrl = URL.createObjectURL(file);
      previewUrlRef.current = newPreviewUrl;
    }

    setDocumentFile(file);
    setDocumentPreviewUrl(newPreviewUrl);
    setVerificationResult(null);
    setError('');
  };

  const handleLivePhotoChange = (event) => {
    const file = event.target.files?.[0] || null;
    setLivePhotoFile(file);
    setVerificationResult(null);
    setError('');
  };

  const handleVerify = async () => {
    setError('');
    setVerificationResult(null);

    if (!documentFile) {
      setError('Please select a government document first.');
      return;
    }

    if (!livePhotoFile) {
      setError('Please select a reference/live face photo.');
      return;
    }

    setIsVerifying(true);

    try {
      const data = await verifyDocument({ documentFile, livePhotoFile });
      setVerificationResult(data);

      const status =
        RECOMMENDATION_TO_STATUS[data?.status] ||
        RECOMMENDATION_TO_STATUS[data?.summary?.recommendation] ||
        'Review';

      const historyRow = {
        id: data?.docId || data?.requestId || `DOC-${Date.now()}`,
        type: data?.docType || 'Government ID',
        time: formatCurrentTime(),
        risk:
          typeof data?.riskScore === 'number'
            ? Math.round(data.riskScore)
            : 0,
        status,
      };

      setHistory((prev) => [historyRow, ...prev].slice(0, 6));
    } catch (err) {
      console.error('Verification error:', err);
      setError(err?.message || 'Unable to connect to the verification backend.');
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    documentFile,
    livePhotoFile,
    documentPreviewUrl,
    verificationResult,
    isVerifying,
    error,
    history,
    handleDocumentChange,
    handleLivePhotoChange,
    handleVerify,
  };
}
