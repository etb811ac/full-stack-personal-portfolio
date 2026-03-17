'use client';

import { useEffect, useRef } from 'react';
import {
  siNextdotjs, siReact, siThreedotjs, siGreensock,
  siTailwindcss, siPython, siDjango, siLangchain,
  siGraphql, siDocker, siTypescript, siNodedotjs,
  siPostgresql, siGit, siVercel, siFigma, siKubernetes, siRedis,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

interface TechItem {
  icon: SimpleIcon;
  name: string;
  desc: string;
  detail: string;
  color: string;
}

interface MarqueeItem {
  icon: SimpleIcon;
  name: string;
  color: string;
}

const FEATURED: TechItem[] = [
  { icon: siNextdotjs,  name: 'Next.js',    desc: 'React Framework', detail: 'App Router · SSR · ISR · Server Actions',  color: '#e2e2e2' },
  { icon: siReact,      name: 'React',      desc: 'UI Library',      detail: 'Hooks · Context · Suspense · RSC',          color: '#61DAFB' },
  { icon: siThreedotjs, name: 'Three.js',   desc: '3D / WebGL',      detail: 'R3F · Shaders · Post-processing',           color: '#e2e2e2' },
  { icon: siGreensock,  name: 'GSAP',       desc: 'Animation',       detail: 'ScrollTrigger · SplitText · MotionPath',    color: '#88CE02' },
  { icon: siTailwindcss,name: 'Tailwind',   desc: 'Styling',         detail: 'Design systems · Responsive · Motion',      color: '#06B6D4' },
  { icon: siPython,     name: 'Python',     desc: 'Backend',         detail: 'Async · Typing · Data pipelines',           color: '#3776AB' },
  { icon: siDjango,     name: 'Django',     desc: 'Web Framework',   detail: 'DRF · ORM · Admin · Channels',              color: '#44B78B' },
  { icon: siLangchain,  name: 'LangChain',  desc: 'AI / LLM',        detail: 'RAG · Agents · Embeddings · Chains',        color: '#22D3AA' },
  { icon: siGraphql,    name: 'GraphQL',    desc: 'API Layer',       detail: 'Apollo · Subscriptions · Federation',       color: '#E10098' },
  { icon: siDocker,     name: 'Docker',     desc: 'DevOps',          detail: 'Compose · CI/CD · GitHub Actions',          color: '#2496ED' },
];

const MARQUEE_ITEMS: MarqueeItem[] = [
  { icon: siTypescript,  name: 'TypeScript',  color: '#3178C6' },
  { icon: siNodedotjs,   name: 'Node.js',     color: '#5FA04E' },
  { icon: siPostgresql,  name: 'PostgreSQL',  color: '#4169E1' },
  { icon: siRedis,       name: 'Redis',       color: '#FF4438' },
  { icon: siGit,         name: 'Git',         color: '#F05032' },
  { icon: siFigma,       name: 'Figma',       color: '#F24E1E' },
  { icon: siVercel,      name: 'Vercel',      color: '#e2e2e2' },
  { icon: siKubernetes,  name: 'Kubernetes',  color: '#326CE5' },
  { icon: siNextdotjs,   name: 'Next.js',     color: '#e2e2e2' },
  { icon: siReact,       name: 'React',       color: '#61DAFB' },
  { icon: siThreedotjs,  name: 'Three.js',    color: '#e2e2e2' },
  { icon: siGreensock,   name: 'GSAP',        color: '#88CE02' },
  { icon: siTailwindcss, name: 'Tailwind',    color: '#06B6D4' },
  { icon: siPython,      name: 'Python',      color: '#3776AB' },
  { icon: siDjango,      name: 'Django',      color: '#44B78B' },
  { icon: siGraphql,     name: 'GraphQL',     color: '#E10098' },
  { icon: siDocker,      name: 'Docker',      color: '#2496ED' },
  { icon: siLangchain,   name: 'LangChain',   color: '#22D3AA' },
];

function SIIcon({ icon, size = 24 }: { icon: SimpleIcon; size?: number }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-label={icon.title}
      dangerouslySetInnerHTML={{ __html: `<path d="${icon.path}"/>` }}
    />
  );
}

function TechCard({ tech }: { tech: TechItem }) {
  return (
    <div
      className="expertise-card flex flex-col items-center text-center"
      style={{
        '--brand': tech.color,
        padding: 'var(--space-xl) var(--space-lg)',
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        borderRadius: '2px',
        gap: 'var(--space-sm)',
        cursor: 'default',
        userSelect: 'none',
      } as React.CSSProperties}
    >
      <div
        className="card-icon-wrap flex items-center justify-center"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          background: 'var(--bg-hover)',
          marginBottom: 'var(--space-sm)',
        }}
      >
        <div className="card-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SIIcon icon={tech.icon} size={28} />
        </div>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9375rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
        }}
      >
        {tech.name}
      </span>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {tech.desc}
      </span>

      <span
        className="card-detail"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginTop: 'var(--space-xs)',
          minHeight: '2.4em',
        }}
      >
        {tech.detail}
      </span>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: MarqueeItem[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `${reverse ? 'marquee-reverse' : 'marquee-fwd'} 40s linear infinite`,
          gap: 'var(--space-md)',
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="marquee-chip flex items-center shrink-0"
            style={{
              '--brand': item.color,
              gap: '8px',
              padding: '6px 14px',
              border: '1px solid var(--border)',
              background: 'var(--bg-primary)',
              borderRadius: '999px',
              cursor: 'default',
              userSelect: 'none',
            } as React.CSSProperties}
          >
            <span className="chip-icon" style={{ display: 'flex' }}>
              <SIIcon icon={item.icon} size={14} />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll('.expertise-reveal'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 65%', once: true },
        }
      );

      gsap.fromTo(
        el.querySelectorAll('.expertise-card'),
        { y: 50, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'expo.out',
          stagger: { amount: 0.6, from: 'start' },
          scrollTrigger: { trigger: el.querySelector('.expertise-grid'), start: 'top 75%', once: true },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <>
      <style>{`
        @keyframes marquee-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .expertise-card:hover {
          border-color: color-mix(in srgb, var(--brand) 35%, transparent);
          box-shadow: 0 0 28px color-mix(in srgb, var(--brand) 12%, transparent);
        }
        .expertise-card:hover .card-icon-wrap {
          background: color-mix(in srgb, var(--brand) 12%, transparent);
        }
        .expertise-card:hover .card-icon {
          color: var(--brand);
        }
        .expertise-card:hover .card-detail {
          opacity: 1;
          transform: translateY(0);
        }
        .expertise-card,
        .expertise-card .card-icon-wrap,
        .expertise-card .card-icon,
        .expertise-card .card-detail {
          transition: border-color 0.3s ease, box-shadow 0.3s ease,
                      background 0.3s ease, color 0.3s ease,
                      opacity 0.3s ease, transform 0.3s ease;
        }
        .expertise-card .card-detail {
          opacity: 0;
          transform: translateY(4px);
        }
        .marquee-chip:hover {
          border-color: color-mix(in srgb, var(--brand) 40%, transparent);
          background: color-mix(in srgb, var(--brand) 8%, transparent);
        }
        .marquee-chip:hover .chip-icon {
          color: var(--brand);
        }
        .marquee-chip,
        .marquee-chip .chip-icon {
          transition: border-color 0.25s ease, background 0.25s ease, color 0.25s ease;
        }
        .chip-icon { color: var(--text-tertiary); }
      `}</style>

      <section
        ref={sectionRef}
        id="expertise"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="section-wrapper">
          <div className="section-num-col">
            <span className="section-num">03</span>
          </div>
          <div className="section-divider-line" />
          <div className="section-content-col">

            <span className="section-overline expertise-reveal opacity-0">03 — Expertise</span>

            <div className="text-center max-w-[700px] mx-auto" style={{ marginBottom: 'var(--space-3xl)' }}>
              <h2
                className="expertise-reveal opacity-0 editorial-heading"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: 'var(--space-md)' }}
              >
                <span className="display-word">TOOLS</span>
                <em className="accent-word" style={{ fontSize: '0.85em' }}>of the trade</em>
              </h2>
              <p
                className="expertise-reveal opacity-0"
                style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}
              >
                Technologies I use to bring ideas to life — from interactive frontends to intelligent backends.
              </p>
            </div>

            <div
              className="expertise-reveal opacity-0"
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-3xl)' }}
            >
              <MarqueeRow items={MARQUEE_ITEMS} />
              <MarqueeRow items={[...MARQUEE_ITEMS].reverse()} reverse />
            </div>

            <div
              className="expertise-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 'var(--space-md)',
              }}
            >
              <div
                className="expertise-reveal opacity-0"
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  paddingBottom: 'var(--space-sm)',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8125rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Frontend &amp; Creative
                </span>
              </div>

              {FEATURED.slice(0, 5).map((tech) => (
                <TechCard key={tech.name} tech={tech} />
              ))}

              <div
                className="expertise-reveal opacity-0"
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  paddingBottom: 'var(--space-sm)',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: 'var(--space-xs)',
                  marginTop: 'var(--space-md)',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8125rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Backend &amp; Intelligence
                </span>
              </div>

              {FEATURED.slice(5).map((tech) => (
                <TechCard key={tech.name} tech={tech} />
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
