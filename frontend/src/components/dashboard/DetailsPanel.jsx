import Panel from '../common/Panel';
import { caseDetails } from '../../data/mockData';

export default function DetailsPanel({ data }) {
  const d = data ?? caseDetails;

  return (
    <Panel eyebrow="Case File" title="Details">
      <dl className="flex flex-col gap-2.5 m-0">
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Case ID</dt>
          <dd className="m-0 font-mono text-xs text-[#ffffff] text-right">{d.caseId}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Priority</dt>
          <dd className="m-0 text-right">
            <span className="inline-block text-[10.5px] font-mono uppercase tracking-[0.2px] text-[#79628c] bg-[#1f1633] border border-[#362d59] rounded-md py-0.5 px-2.5">
              {d.priority}
            </span>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Assigned Officer</dt>
          <dd className="m-0 font-mono text-xs text-[#ffffff] text-right">{d.assignedOfficer}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Location</dt>
          <dd className="m-0 text-xs text-[#ffffff] text-right">{d.location}</dd>
        </div>
      </dl>
      <p className="text-xs leading-relaxed text-[#bdb8c0] bg-[#1f1633] border-l-2 border-[#c2ef4e] py-2 px-3 rounded-r-md mt-2 mb-0">
        {d.notes}
      </p>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 rounded-md py-2 px-2.5 text-xs font-bold uppercase tracking-[0.2px] cursor-pointer bg-[#ffffff] text-[#1f1633] hover:bg-[#f0f0f0] transition">
          Clear
        </button>
        <button className="flex-1 rounded-md py-2 px-2.5 text-xs font-bold uppercase tracking-[0.2px] cursor-pointer bg-[#150f23] text-[#fa7faa] border border-[#fa7faa] hover:bg-[#fa7faa]/10 transition">
          Flag for review
        </button>
      </div>
    </Panel>
  );
}

