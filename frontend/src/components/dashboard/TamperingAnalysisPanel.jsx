import Panel from '../common/Panel';
import { tamperingAnalysis } from '../../data/mockData';

function scoreColor(score) {
  if (score < 20) return '#c2ef4e'; // accent-lime
  if (score < 50) return '#79628c'; // accent-violet-mid
  return '#fa7faa'; // accent-pink
}

export default function TamperingAnalysisPanel({ data }) {
  const overallFlag = data?.overallFlag ?? tamperingAnalysis.overallFlag;
  const regions = data?.regions ?? tamperingAnalysis.regions;
  const notes = data?.notes;

  return (
    <Panel eyebrow={overallFlag} title="Tampering Analysis">
      <ul className="list-none m-0 p-0 flex flex-col gap-3">
        {regions.map((r) => {
          const color = scoreColor(r.anomalyScore);
          return (
            <li key={r.area} className="grid items-center gap-2.5" style={{ gridTemplateColumns: '1fr 1fr 28px' }}>
              <span className="text-xs text-[#bdb8c0] whitespace-nowrap overflow-hidden text-ellipsis">{r.area}</span>
              <div className="h-1.5 rounded-full bg-[#362d59] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.anomalyScore}%`, background: color }} />
              </div>
              <span className="font-mono text-xs text-right" style={{ color }}>{r.anomalyScore}</span>
            </li>
          );
        })}
      </ul>

      {notes && (
        <p className="text-xs leading-relaxed text-[#79628c] mt-2 mb-0">
          {notes}
        </p>
      )}
    </Panel>
  );
}

