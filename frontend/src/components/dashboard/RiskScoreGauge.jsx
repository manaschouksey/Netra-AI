import { riskScore } from '../../data/mockData';

const SIZE = 168;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

function bandColor(value) {
  if (value < 34) return '#c2ef4e'; // accent-lime
  if (value < 67) return '#79628c'; // accent-violet-mid
  return '#fa7faa'; // accent-pink
}

const WEIGHT_COLOR = {
  low: 'bg-[#c2ef4e]',
  medium: 'bg-[#79628c]',
  high: 'bg-[#fa7faa]',
};

export default function RiskScoreGauge({ data }) {
  const { value, band, reasons } = data ?? riskScore;
  const offset = CIRC - (value / 100) * CIRC;
  const color = bandColor(value);

  return (
    <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4">
      <div className="font-sans text-[11px] font-semibold tracking-[0.25px] uppercase text-[#79628c]">
        Overall Risk Score
      </div>
      <div className="flex items-center gap-8 flex-wrap max-[560px]:justify-center max-[560px]:text-center">
        <div className="relative w-[168px] h-[168px] shrink-0">
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="block">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#362d59" strokeWidth={STROKE} />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="font-sans text-[40px] font-bold text-[#ffffff] leading-none">{value}</span>
            <span className="font-mono text-xs text-[#79628c]">/ 100</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[220px] flex-1">
          <div className="flex items-center gap-2 font-sans font-semibold text-[15px] capitalize max-[560px]:justify-center" style={{ color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {band} risk tier
          </div>
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {reasons.map((r) => (
              <li key={r.label} className="flex items-center gap-2.5 text-[12.5px] text-[#bdb8c0]">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${WEIGHT_COLOR[r.weight] || 'bg-[#79628c]'}`} />
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

