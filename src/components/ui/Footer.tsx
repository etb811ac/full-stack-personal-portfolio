'use client';

export default function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row justify-between items-center"
      style={{
        padding: 'var(--space-2xl)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
        © 2026 Esteban Acuña. Built with craft.
      </div>
      <div className="flex" style={{ gap: 'var(--space-lg)' }}>
        {['GitHub', 'LinkedIn', 'Twitter'].map((link) => (
          <a
            key={link}
            href="#"
            className="transition-colors duration-200"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
