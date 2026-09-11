import Panel from '../common/Panel';
import { extractedInfo } from '../../data/mockData';

export default function ExtractedInfoPanel({ data }) {
  const rows = data ?? extractedInfo;

  return (
    <Panel eyebrow="OCR Output" title="Extracted Information">
      <dl className="flex flex-col m-0">
        {rows.map((row, i) => (
          <div
            key={row.field}
            className={`flex items-baseline justify-between gap-3 py-2.5 ${i < rows.length - 1 ? 'border-b border-[#362d59]' : ''}`}
          >
            <dt className="text-xs text-[#79628c] shrink-0">{row.field}</dt>
            <dd className="m-0 font-mono text-xs text-[#ffffff] text-right break-words">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

