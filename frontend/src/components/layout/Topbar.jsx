import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { id: 'Home', label: 'Home' },
  { id: 'Verify ID', label: 'Verify ID' },
  { id: 'Live Face Check', label: 'Live Face Check' },
  { id: 'Pricing', label: 'Pricing' },
  { id: 'Docs', label: 'Docs' },
];

export default function Topbar({ activeTab, onTabChange }) {
  return (
    <header className="flex items-center justify-between gap-6 px-6 md:px-10 h-18 border-b border-[#362d59] bg-[#1f1633] sticky top-0 z-30">
      {/* BRAND LOGO */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        onClick={() => onTabChange('Home')}
      >
        <div className="w-8 h-8 grid place-items-center rounded-md bg-[#150f23] border border-[#362d59] shrink-0" aria-hidden="true">
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
        <span className="font-sans font-bold text-lg tracking-tight text-[#ffffff]">
          NETRA<span className="text-[#c2ef4e]">.AI</span>
        </span>
      </div>

      {/* CENTER NAV LINKS */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
        {NAV_LINKS.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-[0.2px] cursor-pointer transition-colors border ${
                isActive
                  ? 'bg-[#150f23] text-[#ffffff] border-[#362d59]'
                  : 'text-[#bdb8c0] hover:text-[#ffffff] bg-transparent border-transparent'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => onTabChange('Live Face Check')}
          className="hidden sm:inline-flex btn-ghost-on-dark text-xs py-2 px-3.5 font-bold uppercase tracking-[0.2px]"
        >
          Get Demo
        </button>
        <button
          type="button"
          onClick={() => onTabChange('Verify ID')}
          className="btn-inverted text-xs py-2 px-4 font-bold uppercase tracking-[0.2px] flex items-center gap-1.5"
        >
          <span>Verify Now</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
}


