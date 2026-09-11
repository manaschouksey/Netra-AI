import { Home, FileText, ShieldCheck, ScanFace, BarChart3, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Home' },
  { icon: FileText, label: 'Verification' },
  { icon: ShieldCheck, label: 'Security Center' },
  { icon: ScanFace, label: 'Face Verification' },
  { icon: BarChart3, label: 'Risk Analysis' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="row-span-2 bg-[#150f23] border-r border-[#362d59] flex flex-col p-4 gap-6 sticky top-0 h-screen max-[900px]:items-center max-[900px]:px-2.5">
      {/* BRAND HEADER */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 grid place-items-center rounded-md bg-[#362d59] shrink-0" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="20" height="20">
            <path
              d="M16 2 L28 7 V15 C28 22.5 22.8 27.8 16 30 C9.2 27.8 4 22.5 4 15 V7 Z"
              fill="none"
              stroke="#c2ef4e"
              strokeWidth="2.2"
            />
            <path d="M11 16 L14.5 19.5 L21.5 12" fill="none" stroke="#c2ef4e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-sans font-bold text-[16px] tracking-tight text-[#ffffff] max-[900px]:hidden">
          NETRA<span className="text-[#c2ef4e]">.AI</span>
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1.5 flex-1" aria-label="Primary">
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => onNavigate?.(label)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[13px] font-semibold text-left cursor-pointer transition-colors max-[900px]:justify-center
                ${isActive
                  ? 'bg-[#3f3849] text-[#ffffff] border-l-2 border-[#c2ef4e]'
                  : 'text-[#bdb8c0] hover:bg-[#1f1633] hover:text-[#ffffff]'}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="max-[900px]:hidden">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER USER / LOGOUT */}
      <div className="flex flex-col gap-3 border-t border-[#362d59] pt-4">
        <div className="flex items-center gap-2.5 px-2 py-1 max-[900px]:hidden">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e] shrink-0" aria-hidden="true" />
          <div>
            <div className="font-mono text-[11px] text-[#ffffff]">Officer SSB-102</div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-[#c2ef4e]">Online</div>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-3 py-2 border border-[#362d59] rounded-md text-[#bdb8c0] text-[12px] font-semibold uppercase tracking-[0.2px] cursor-pointer transition-colors hover:border-[#fa7faa] hover:text-[#fa7faa] max-[900px]:justify-center">
          <LogOut size={15} strokeWidth={1.8} />
          <span className="max-[900px]:hidden">Logout</span>
        </button>
      </div>
    </aside>
  );
}
