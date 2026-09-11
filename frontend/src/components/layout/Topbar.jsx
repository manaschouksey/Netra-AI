import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const NAV_LINKS = [
  { id: 'Home', label: 'Home' },
  { id: 'Verify ID', label: 'Verify ID' },
  { id: 'Live Face Check', label: 'Live Face Check' },
  { id: 'Docs', label: 'Docs' },
];

export default function Topbar({ activeTab, onTabChange, theme, setTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#362d59] bg-[#1f1633]/95 backdrop-blur-md transition-colors">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 h-18 flex items-center justify-between gap-4">
        {/* BRAND LOGO */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          onClick={() => handleNavClick('Home')}
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

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {NAV_LINKS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavClick(id)}
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

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            type="button"
            onClick={() => handleNavClick('Live Face Check')}
            className="btn-ghost-on-dark text-xs py-2 px-3 font-bold uppercase tracking-[0.2px]"
          >
            Get Demo
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('Verify ID')}
            className="btn-inverted text-xs py-2 px-3.5 font-bold uppercase tracking-[0.2px] flex items-center gap-1.5"
          >
            <span>Verify Now</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* MOBILE CONTROLS (THEME TOGGLE + HAMBURGER) */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="w-9 h-9 grid place-items-center rounded-lg border border-[#362d59] bg-[#150f23] text-[#ffffff] cursor-pointer active:scale-95 transition-transform"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDABLE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#362d59] bg-[#150f23] px-4 py-5 flex flex-col gap-4 animate-drawer shadow-2xl">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {NAV_LINKS.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]'
                      : 'text-[#bdb8c0] hover:text-[#ffffff] bg-transparent'
                  }`}
                >
                  <span>{label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#c2ef4e]" />}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#362d59] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleNavClick('Verify ID')}
              className="w-full btn-inverted text-xs py-3 justify-center flex items-center gap-2"
            >
              <span>Verify Now</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('Live Face Check')}
              className="w-full btn-ghost-on-dark text-xs py-2.5 justify-center flex items-center gap-2"
            >
              <span>Try Face Check</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
