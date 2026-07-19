import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { cv } from '@/data/cv';

export const metadata: Metadata = {
  title: 'CV — Esteban Acuña | Full-Stack Developer & AI Engineer',
  description:
    'Curriculum vitae of Esteban Acuña Cerdas — Full-Stack Developer & AI Engineer. 10+ years of experience with React, Next.js, TypeScript, Three.js, and LLM integrations.',
  openGraph: {
    title: 'CV — Esteban Acuña | Full-Stack Developer & AI Engineer',
    description:
      'Curriculum vitae of Esteban Acuña Cerdas — Full-Stack Developer & AI Engineer.',
    url: 'https://estebanacuna.dev/cv',
    siteName: 'Esteban Acuña',
    locale: 'en_US',
    type: 'profile',
  },
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.5rem',
  letterSpacing: '0.06em',
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border)',
  paddingBottom: 'var(--space-sm)',
  marginBottom: 'var(--space-lg)',
};

export default function CvPage() {
  return (
    <>
      <Navbar />
      <main
        className="cv-page"
        style={{
          background: 'var(--bg-primary)',
          minHeight: '100vh',
          padding: 'calc(var(--space-4xl) * 2) var(--space-lg) var(--space-4xl)',
        }}
      >
        <article
          itemScope
          itemType="https://schema.org/Person"
          style={{ maxWidth: '760px', margin: '0 auto' }}
        >
          {/* Header */}
          <header style={{ marginBottom: 'var(--space-2xl)' }}>
            <h1
              itemProp="name"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                letterSpacing: '0.04em',
                lineHeight: 1,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              {cv.name.toUpperCase()}
            </h1>
            <p
              itemProp="jobTitle"
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
                fontSize: '1.375rem',
                color: 'var(--accent)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              {cv.title}
            </p>
            <ul
              className="cv-contact"
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-sm) var(--space-lg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}
            >
              <li itemProp="email">{cv.contact.email}</li>
              <li itemProp="telephone">{cv.contact.phone}</li>
              <li itemProp="url">{cv.contact.website.replace('https://', '')}</li>
              <li>{cv.contact.github}</li>
              <li>{cv.contact.linkedin}</li>
              <li>{cv.location}</li>
            </ul>
            <div className="cv-actions" style={{ marginTop: 'var(--space-xl)' }}>
              <a href="/cv/esteban-acuna-cv.pdf" download className="btn-primary">
                Download CV (PDF)
              </a>
            </div>
          </header>

          {/* Summary */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={sectionHeadingStyle}>SUMMARY</h2>
            <p
              itemProp="description"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}
            >
              {cv.summary}
            </p>
          </section>

          {/* Experience */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={sectionHeadingStyle}>EXPERIENCE</h2>
            {cv.experience.map((job) => (
              <div key={job.company} style={{ marginBottom: 'var(--space-xl)' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 'var(--space-sm)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {job.role} · {job.company}
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {job.period}
                  </span>
                </div>
                <ul
                  style={{
                    marginTop: 'var(--space-sm)',
                    paddingLeft: '1.1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                  }}
                >
                  {job.bullets.map((b) => (
                    <li key={b} style={{ marginBottom: '0.35rem' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={sectionHeadingStyle}>SKILLS</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cv.skills.map((group) => (
                <li
                  key={group.category}
                  style={{
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {group.category}:
                  </strong>{' '}
                  {group.items.join(', ')}
                </li>
              ))}
            </ul>
          </section>

          {/* Education */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={sectionHeadingStyle}>EDUCATION & COURSES</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cv.education.map((e) => (
                <li
                  key={e.title}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-lg)',
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--text-tertiary)',
                      minWidth: '3rem',
                    }}
                  >
                    {e.year}
                  </span>
                  <span>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {e.title}
                    </strong>{' '}
                    — {e.institution}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Languages */}
          <section>
            <h2 style={sectionHeadingStyle}>LANGUAGES</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cv.languages.map((l) => (
                <li
                  key={l.language}
                  style={{
                    marginBottom: 'var(--space-xs)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {l.language}:
                  </strong>{' '}
                  {l.level}
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
      <style>{`
        @media print {
          html, body { background: #ffffff !important; }
          nav, footer, .cv-actions, .top-accent-bar { display: none !important; }
          .cv-page { padding: 0 !important; background: #ffffff !important; }
          .cv-page, .cv-page * { color: #111111 !important; }
          .cv-page h1 { font-size: 28pt !important; }
          .cv-page h2 { font-size: 13pt !important; border-bottom-color: #cccccc !important; }
          .cv-page p, .cv-page li { font-size: 10pt !important; }
          .cv-page article { max-width: 100% !important; }
          @page { margin: 18mm 16mm; }
        }
      `}</style>
    </>
  );
}
