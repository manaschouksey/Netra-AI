import { Search, Bell, ChevronDown } from 'lucide-react';

const TABS = ['Dashboard', 'Face Detection', 'Search', 'Notification', 'Officer Profile'];

export default function Topbar({ activeTab, onTabChange }) {
  return (
    <header className="flex items-center justify-between gap-6 px-7 h-16 border-b border-[#362d59] bg-[#1f1633] sticky top-0 z-10 max-[700px]:px-4">
      <nav className="flex gap-1.5 overflow-x-auto" aria-label="Sections">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange?.(tab)}
            className={`border text-[13px] font-medium px-3.5 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors
              ${activeTab === tab
                ? 'text-[#ffffff] bg-[#150f23] border-[#362d59]'
                : 'text-[#bdb8c0] hover:text-[#ffffff] bg-transparent border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3.5 shrink-0">
        <div className="hidden min-[901px]:flex items-center gap-2 bg-[#150f23] border border-[#362d59] rounded-md px-3 py-1.5 text-[#bdb8c0] w-65">
          <Search size={15} strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search case ID, document, officer…"
            className="bg-transparent border-none outline-none text-[#ffffff] text-xs w-full placeholder:text-[#79628c]"
          />
        </div>
        <button className="relative w-8.5 h-8.5 grid place-items-center rounded-md border border-[#362d59] bg-[#150f23] text-[#bdb8c0] cursor-pointer hover:text-[#ffffff]" aria-label="Notifications">
          <Bell size={17} strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 bg-[#fa7faa] text-[#150f23] text-[9px] font-bold w-3.5 h-3.5 rounded-full grid place-items-center">3</span>
        </button>
        <button className="flex items-center gap-2 border border-[#362d59] bg-[#150f23] rounded-md pl-1.5 pr-2.5 py-1 text-[#bdb8c0] text-xs cursor-pointer hover:text-[#ffffff]">
          <div className="w-6 h-6 rounded-full bg-[#3f3849] text-[#ffffff] font-mono text-[10px] font-bold grid place-items-center">SS</div>
          <span>SSB-102</span>
          <ChevronDown size={14} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}

