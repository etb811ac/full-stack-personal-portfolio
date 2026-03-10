'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between transition-all duration-400"
      style={{
        padding: 'var(--space-md) var(--space-2xl)',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'var(--border-subtle)'}`,
      }}
    >
      {/* Logo */}
      <a href="#hero" className="font-bold text-xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
        esteban<span style={{ color: 'var(--text-tertiary)', fontWeight: 300 }}>.dev</span>
      </a>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center list-none" style={{ gap: 'var(--space-xl)' }}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="relative text-sm font-medium uppercase tracking-wide transition-colors duration-200 group"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-400"
                style={{
                  background: 'var(--text-primary)',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Mobile burger */}
        <button
          className="flex md:hidden flex-col gap-[5px] p-2 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 transition-all" style={{ background: 'var(--text-primary)' }} />
          <span className="w-6 h-0.5 transition-all" style={{ background: 'var(--text-primary)' }} />
          <span className="w-6 h-0.5 transition-all" style={{ background: 'var(--text-primary)' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col items-center py-8 gap-6 md:hidden"
          style={{
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
