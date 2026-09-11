import { CheckCircle2, AlertTriangle } from 'lucide-react';
import Panel from '../common/Panel';
import { aiVerification } from '../../data/mockData';

export default function AIVerificationPanel({ data }) {
  const rows = data ?? aiVerification;

  return (
    <Panel eyebrow="Model Output" title="AI Verification Results">
      <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
        {rows.map((row) => {
          const pass = row.result === 'Pass';
          const Icon = pass ? CheckCircle2 : AlertTriangle;
          const statusColor = pass ? 'text-[#c2ef4e]' : 'text-[#79628c]';
          const fillColor = pass ? 'bg-[#c2ef4e]' : 'bg-[#79628c]';

          return (
            <li key={row.check} className="grid grid-cols-[18px_1fr_70px_40px] items-center gap-2.5">
              <Icon size={16} strokeWidth={1.8} className={statusColor} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-[#ffffff] whitespace-nowrap overflow-hidden text-ellipsis">{row.check}</span>
                <span className={`text-[10.5px] font-mono uppercase tracking-[0.2px] ${statusColor}`}>{row.result}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#362d59] overflow-hidden">
                <div
                  className={`h-full rounded-full ${fillColor}`}
                  style={{ width: `${Math.min(100, Math.max(0, row.confidence))}%` }}
                />
              </div>
              <span className="font-mono text-xs text-[#bdb8c0] text-right">{Math.round(row.confidence)}%</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

