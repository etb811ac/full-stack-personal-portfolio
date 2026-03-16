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
      <a href="#hero" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
          ESTEBAN
        </span>
        <em style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--accent)' }}>
          Acuña
        </em>
      </a>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center list-none" style={{ gap: 'var(--space-xl)' }}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="nav-link"
            >
              {link.label}
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
          className="absolute top-full left-0 right-0 flex flex-col px-8 md:hidden"
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
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase' as const,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                display: 'block',
                transition: 'color var(--duration-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
