'use client';

export default function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row justify-between items-center"
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'var(--space-xl) 120px',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        color: 'var(--text-tertiary)',
      }}
    >
      <div>
        © 2026 Esteban Acuña. Built with craft.
      </div>
      <div className="flex" style={{ gap: 'var(--space-lg)' }}>
        {[
          { label: 'GitHub', href: 'https://github.com/etb811ac' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/esteban-acu%C3%B1a/' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
