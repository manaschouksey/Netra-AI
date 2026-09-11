import React, { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('netra_theme') || 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme) => {
      let resolved = currentTheme;
      if (currentTheme === 'system') {
        resolved = mediaQuery.matches ? 'dark' : 'light';
      }
      root.setAttribute('data-theme', resolved);
      try {
        localStorage.setItem('netra_theme', currentTheme);
      } catch (e) {
        // ignore storage errors
      }
    };

    applyTheme(theme);

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  return [theme, setTheme];
}

export default function ThemeToggle({ theme, setTheme, className = '' }) {
  const options = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'system', label: 'System', icon: Laptop },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg border border-[#362d59] bg-[#150f23] select-none ${className}`}
      role="group"
      aria-label="Color theme switcher"
    >
      {options.map(({ id, label, icon: Icon }) => {
        const isActive = theme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            title={`${label} theme`}
            aria-pressed={isActive}
            className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-150 flex items-center justify-center ${
              isActive
                ? 'bg-[#1f1633] text-[#c2ef4e] shadow-sm'
                : 'text-[#79628c] hover:text-[#bdb8c0] bg-transparent'
            }`}
          >
            <Icon size={14} strokeWidth={2} />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
