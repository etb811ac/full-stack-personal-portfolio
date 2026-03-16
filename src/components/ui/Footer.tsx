'use client';

export default function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row justify-between items-center"
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'var(--space-xl) 0',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        color: 'var(--text-tertiary)',
      }}
    >
      <div>
        © 2026 Esteban Acuña. Built with craft.
      </div>
      <div className="flex" style={{ gap: 'var(--space-lg)' }}>
        {['GitHub', 'LinkedIn', 'Twitter'].map((link) => (
          <a
            key={link}
            href="#"
            className="transition-colors duration-200"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}
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
