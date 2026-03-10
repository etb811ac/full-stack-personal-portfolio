'use client';

import { useTheme } from '@/context/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative cursor-pointer select-none"
      role="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className="relative w-[58px] h-[30px] rounded-full border transition-all duration-400"
        style={{
          background: 'var(--bg-tertiary)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Sun icon */}
        <span
          className="absolute top-1/2 left-[7px] -translate-y-1/2 text-[14px] leading-none z-[1] transition-opacity duration-400 sun-icon"
          style={{ opacity: theme === 'light' ? 1 : 0.4 }}
        >
          ☀️
        </span>

        {/* Thumb */}
        <div
          className="absolute w-6 h-6 rounded-full top-[2px] z-[2] transition-all duration-500"
          style={{
            background: 'var(--text-primary)',
            left: theme === 'dark' ? '3px' : '30px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.3)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Moon icon */}
        <span
          className="absolute top-1/2 right-[6px] -translate-y-1/2 text-[14px] leading-none z-[1] transition-opacity duration-400 moon-icon"
          style={{ opacity: theme === 'dark' ? 1 : 0.4 }}
        >
          🌙
        </span>
      </div>
    </button>
  );
}
