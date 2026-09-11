import Panel from '../common/Panel';
import { recentHistory } from '../../data/mockData';

const STATUS_CLASS = {
  Cleared: 'text-[#c2ef4e] bg-[#1f1633] border border-[#362d59]',
  Review: 'text-[#79628c] bg-[#1f1633] border border-[#362d59]',
  'High Risk': 'text-[#fa7faa] bg-[#1f1633] border border-[#362d59]',
};

export default function RecentHistoryPanel({ data }) {
  const rows = data && data.length > 0 ? data : recentHistory;

  return (
    <Panel eyebrow={`Last ${rows.length} Cases`} title="Recent Verification History">
      <div className="flex flex-col">
        <div className="grid grid-cols-[1.3fr_1fr_0.8fr_0.6fr_1fr] items-center gap-2.5 py-2.5 px-1 border-b border-[#362d59] font-mono text-[10.5px] tracking-[0.2px] uppercase text-[#79628c] max-[700px]:grid-cols-[1.2fr_1fr_1fr]">
          <span>Document</span>
          <span>Type</span>
          <span className="max-[700px]:hidden">Time</span>
          <span>Risk</span>
          <span>Status</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.id}
            className={`grid grid-cols-[1.3fr_1fr_0.8fr_0.6fr_1fr] items-center gap-2.5 py-2.5 px-1 text-xs text-[#ffffff] max-[700px]:grid-cols-[1.2fr_1fr_1fr] ${i < rows.length - 1 ? 'border-b border-[#362d59]' : ''}`}
          >
            <span className="font-mono">{row.id}</span>
            <span className="text-[#bdb8c0]">{row.type}</span>
            <span className="font-mono text-[#79628c] max-[700px]:hidden">{row.time}</span>
            <span className="font-mono">{row.risk}</span>
            <span>
              <span className={`inline-block text-[10.5px] font-bold uppercase tracking-[0.2px] py-0.5 px-2 rounded-md ${STATUS_CLASS[row.status] ?? 'text-[#bdb8c0] bg-[#1f1633] border border-[#362d59]'}`}>
                {row.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

