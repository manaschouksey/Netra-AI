import { ScanLine, Upload } from 'lucide-react';
import Panel from '../common/Panel';
import { latestScan } from '../../data/mockData';

export default function LatestScanPanel({
  docId,
  docType,
  submittedAt,
  officer,
  status,
  previewUrl,
  loading = false,
}) {
  const data = {
    docId: docId ?? latestScan.docId,
    docType: docType ?? latestScan.docType,
    submittedAt: submittedAt ?? latestScan.submittedAt,
    officer: officer ?? latestScan.officer,
    status: status ?? latestScan.status,
  };

  return (
    <Panel eyebrow="Live Feed" title="Latest Scan">
      <div className="relative overflow-hidden h-[120px] rounded-lg bg-[#1f1633] border border-dashed border-[#362d59] flex flex-col items-center justify-center gap-2 text-[#bdb8c0] text-xs">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Scan Preview"
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <>
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#362d59] border-t-[#c2ef4e]" />
            ) : (
              <Upload size={24} strokeWidth={1.5} className="text-[#79628c]" />
            )}
            <span className="font-medium text-[11.5px]">
              {loading
                ? 'Analyzing document...'
                : 'Upload a document above to scan'}
            </span>
          </>
        )}
      </div>

      <dl className="flex flex-col gap-2.5 m-0 mt-3.5">
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Document ID</dt>
          <dd className="m-0 font-mono text-xs text-[#ffffff] text-right">{data.docId}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Type</dt>
          <dd className="m-0 text-xs text-[#ffffff] text-right">{data.docType}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Submitted</dt>
          <dd className="m-0 font-mono text-xs text-[#ffffff] text-right">{data.submittedAt}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Officer</dt>
          <dd className="m-0 font-mono text-xs text-[#ffffff] text-right">{data.officer}</dd>
        </div>
      </dl>

      <div className="text-xs font-semibold uppercase tracking-[0.2px] text-[#c2ef4e] bg-[#1f1633] border border-[#362d59] rounded-md py-2 px-3 text-center mt-3.5">
        {data.status}
      </div>
    </Panel>
  );
}

