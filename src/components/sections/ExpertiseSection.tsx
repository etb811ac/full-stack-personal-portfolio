'use client';

import { useEffect, useRef } from 'react';

interface TechNode {
  icon: string;
  name: string;
  desc: string;
  detail: string;
}

interface TechCategory {
  label: string;
  nodes: TechNode[];
}

const categories: TechCategory[] = [
  {
    label: 'Frontend & Creative',
    nodes: [
      { icon: '⚡', name: 'Next.js', desc: 'React Framework', detail: 'SSR, ISR, App Router, Server Components' },
      { icon: '⚛️', name: 'React', desc: 'UI Library', detail: 'Hooks, Context, Suspense, RSC' },
      { icon: '🎲', name: 'Three.js', desc: '3D / WebGL', detail: 'R3F, Shaders, Post-processing, Physics' },
      { icon: '🎬', name: 'GSAP', desc: 'Animation', detail: 'ScrollTrigger, SplitText, MotionPath' },
      { icon: '🎨', name: 'CSS / Tailwind', desc: 'Styling', detail: 'Design systems, responsive, animation' },
    ],
  },
  {
    label: 'Backend & Intelligence',
    nodes: [
      { icon: '🐍', name: 'Python', desc: 'Backend', detail: 'Async, typing, data pipelines' },
      { icon: '🎸', name: 'Django', desc: 'Web Framework', detail: 'DRF, ORM, Admin, Channels' },
      { icon: '🧠', name: 'LangChain', desc: 'AI / LLM', detail: 'RAG, Agents, Embeddings, Chains' },
      { icon: '🔗', name: 'REST / GraphQL', desc: 'APIs', detail: 'OpenAPI, Apollo, real-time subscriptions' },
      { icon: '🚀', name: 'DevOps', desc: 'CI/CD', detail: 'Docker, GitHub Actions, Vercel, AWS' },
    ],
  },
];

function TechNodeCard({ node, index }: { node: TechNode; index: number }) {
  return (
    <div
      className={`tech-node-card relative flex items-center overflow-hidden cursor-default transition-all duration-400`}
      style={{
        padding: 'var(--space-lg) var(--space-xl)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        background: 'var(--gradient-card)',
        minWidth: '180px',
        gap: 'var(--space-md)',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-6px) scale(1.02)';
        el.style.borderColor = 'var(--border-accent)';
        el.style.boxShadow = 'var(--shadow-glow), var(--shadow-md)';
        const detail = el.querySelector('.tech-detail') as HTMLElement;
        if (detail) detail.style.transform = 'translateY(0)';
        const icon = el.querySelector('.tech-icon') as HTMLElement;
        if (icon) icon.style.transform = 'scale(1.15) rotate(-5deg)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.borderColor = 'var(--border)';
        el.style.boxShadow = '';
        const detail = el.querySelector('.tech-detail') as HTMLElement;
        if (detail) detail.style.transform = 'translateY(100%)';
        const icon = el.querySelector('.tech-icon') as HTMLElement;
        if (icon) icon.style.transform = '';
      }}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-400"
        style={{ background: 'radial-gradient(circle at 30% 50%, var(--accent-glow), transparent 70%)' }}
      />

      {/* Icon */}
      <div
        className="tech-icon flex items-center justify-center shrink-0 z-[1] transition-transform duration-400"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          background: 'var(--bg-hover)',
          fontSize: '22px',
        }}
      >
        {node.icon}
      </div>

      {/* Info */}
      <div className="z-[1] flex flex-col gap-0.5">
        <span
          className="font-semibold"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '-0.01em' }}
        >
          {node.name}
        </span>
        <span
          className="transition-colors duration-400"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}
        >
          {node.desc}
        </span>
      </div>

      {/* Hover detail panel */}
      <div
        className="tech-detail absolute bottom-0 left-0 right-0 z-[3] transition-transform duration-400"
        style={{
          padding: 'var(--space-sm) var(--space-lg)',
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          transform: 'translateY(100%)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {node.detail}
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
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 60%', once: true },
        }
      );

      gsap.fromTo(
        el.querySelectorAll('.tech-node-card'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el.querySelector('.tech-constellation'), start: 'top 70%', once: true },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative"
      style={{ padding: 'var(--space-6xl) var(--space-2xl)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <span
          className="absolute hidden lg:block select-none"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '7rem',
            fontWeight: 700,
            color: 'var(--border)',
            right: 'var(--space-2xl)',
            top: 'var(--space-4xl)',
            lineHeight: 1,
          }}
        >
          03
        </span>

        <div
          className="expertise-reveal opacity-0 flex items-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--text-tertiary)',
            marginBottom: 'var(--space-lg)',
            gap: 'var(--space-md)',
          }}
        >
          <span className="w-6 h-px" style={{ background: 'var(--text-tertiary)' }} />
          Expertise
        </div>

        <div className="text-center max-w-[700px] mx-auto" style={{ marginBottom: 'var(--space-4xl)' }}>
          <h2
            className="expertise-reveal opacity-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-md)',
            }}
          >
            Tools of the <em>trade</em>
          </h2>
          <p className="expertise-reveal opacity-0" style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            Technologies I use to bring ideas to life — from interactive frontends to intelligent backends.
          </p>
        </div>

        <div className="tech-constellation flex flex-col" style={{ gap: 'var(--space-3xl)' }}>
          {categories.map((cat) => (
            <div key={cat.label} className="flex flex-col" style={{ gap: 'var(--space-lg)' }}>
              <div
                className="flex items-center"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--text-tertiary)',
                  paddingBottom: 'var(--space-sm)',
                  borderBottom: '1px solid var(--border)',
                  gap: 'var(--space-md)',
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--text-tertiary)' }} />
                {cat.label}
              </div>
              <div className="flex flex-wrap" style={{ gap: 'var(--space-md)' }}>
                {cat.nodes.map((node, i) => (
                  <TechNodeCard key={node.name} node={node} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
