import { ScanFace } from 'lucide-react';
import Panel from '../common/Panel';
import { faceVerification } from '../../data/mockData';

export default function FaceVerificationPanel({ data }) {
  const f = data || faceVerification;
  return (
    <Panel eyebrow="Biometric Match" title="Face Verification">
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-full border border-[#362d59] bg-[#1f1633] grid place-items-center text-[#c2ef4e] shrink-0">
          <ScanFace size={28} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-2xl font-bold text-[#ffffff]">{f.matchScore}%</span>
          <span className="text-xs text-[#79628c]">Match confidence</span>
        </div>
      </div>
      <dl className="flex flex-col gap-2.5 m-0 mt-4">
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Liveness check</dt>
          <dd className="m-0 text-xs font-semibold text-[#c2ef4e]">{f.livenessCheck}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Spoof attempt</dt>
          <dd className="m-0 text-xs font-semibold text-[#c2ef4e]">{f.spoofAttempt}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2.5">
          <dt className="text-xs text-[#79628c]">Landmarks matched</dt>
          <dd className="m-0 font-mono text-xs text-[#ffffff]">{f.landmarksMatched} / 68</dd>
        </div>
      </dl>
    </Panel>
  );
}

