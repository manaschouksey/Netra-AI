import Panel from '../common/Panel';
import { timeline } from '../../data/mockData';

export default function TimelinePanel({ data }) {
  const events = data ?? timeline;

  return (
    <Panel eyebrow="Case Activity" title="Timeline">
      <ol className="list-none m-0 p-0">
        {events.map((t, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center w-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#c2ef4e] mt-1 shrink-0" />
              {i < events.length - 1 && <span className="flex-1 w-px bg-[#362d59] my-1" />}
            </div>
            <div className="flex flex-col gap-0.5 pb-4 min-w-0">
              <span className="font-mono text-[10.5px] text-[#79628c]">{t.time}</span>
              <span className="text-xs text-[#bdb8c0]">{t.event}</span>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

