'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface Experiment {
  title: string;
  desc: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  image: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    title: 'Haunted House',
    desc: 'A spooky graveyard scene with drifting ghosts, dynamic shadows and volumetric fog.',
    tags: ['Lighting', 'Shadows', 'Fog'],
    liveUrl: 'https://hunted-house-e-acuna.netlify.app/',
    repoUrl: 'https://github.com/etb811ac/hunted-house',
    image: '/experiments/haunted-house.webp',
  },
  {
    title: 'Galaxy V2',
    desc: 'A spiral galaxy of hundreds of thousands of particles, animated entirely on the GPU.',
    tags: ['GLSL', 'GPU particles'],
    liveUrl: 'https://galaxy-v2-eacuna.netlify.app/',
    repoUrl: 'https://github.com/etb811ac/galaxy-v2-threejs',
    image: '/experiments/galaxy-v2.webp',
  },
  {
    title: 'Raging Sea',
    desc: 'An animated ocean surface built from scratch with vertex and fragment shaders.',
    tags: ['GLSL', 'Custom shaders'],
    liveUrl: 'https://sea-shader-eacuna.netlify.app/',
    repoUrl: 'https://github.com/etb811ac/sea-shader-threejs',
    image: '/experiments/sea-shader.webp',
  },
  {
    title: 'Physics Sandbox',
    desc: 'Real-time physics playground — drop balls and bricks, switch gravity between planets.',
    tags: ['Cannon.js', 'Physics'],
    liveUrl: 'https://physics-threejs-eacuna.netlify.app/',
    repoUrl: 'https://github.com/etb811ac/threejs-physics',
    image: '/experiments/physics.webp',
  },
];

function ExperimentCard({ exp, index }: { exp: Experiment; index: number }) {
  return (
    <div className="experiment-card">
      <a
        href={exp.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="experiment-thumb"
        aria-label={`Open live demo of ${exp.title}`}
      >
        <Image
          src={exp.image}
          alt={`${exp.title} — WebGL experiment`}
          width={1200}
          height={750}
          sizes="(max-width: 900px) 100vw, 50vw"
        />
        <span className="experiment-thumb-hint">Live demo ↗</span>
      </a>

      <div className="experiment-body">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--accent)',
              letterSpacing: '0.05em',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
              color: 'var(--text-primary)',
            }}
          >
            {exp.title}
          </h3>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {exp.desc}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {exp.tags.map((tag) => (
              <span key={tag} className="experiment-tag">{tag}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <a href={exp.liveUrl} target="_blank" rel="noopener noreferrer" className="experiment-link accent">
              Demo ↗
            </a>
            <a href={exp.repoUrl} target="_blank" rel="noopener noreferrer" className="experiment-link">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperimentsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll('.experiments-reveal'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 65%', once: true },
        }
      );

      gsap.fromTo(
        el.querySelectorAll('.experiment-card'),
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out',
          stagger: { amount: 0.4, from: 'start' },
          scrollTrigger: { trigger: el.querySelector('.experiments-grid'), start: 'top 75%', once: true },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <>
      <style>{`
        .experiments-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }
        .experiment-card {
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .experiment-card:hover {
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
          box-shadow: 0 0 40px color-mix(in srgb, var(--accent) 8%, transparent);
        }
        .experiment-thumb {
          position: relative;
          display: block;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          border-bottom: 1px solid var(--border);
        }
        .experiment-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .experiment-card:hover .experiment-thumb img {
          transform: scale(1.04);
        }
        .experiment-thumb-hint {
          position: absolute;
          right: 12px;
          bottom: 12px;
          padding: 5px 12px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-primary);
          background: color-mix(in srgb, var(--bg-primary) 75%, transparent);
          backdrop-filter: blur(6px);
          border: 1px solid var(--border);
          border-radius: 2px;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .experiment-card:hover .experiment-thumb-hint {
          opacity: 1;
          transform: translateY(0);
        }
        .experiment-body {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          padding: var(--space-lg);
        }
        .experiment-tag {
          display: inline-block;
          padding: 3px 10px;
          border: 1px solid var(--border);
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 1px;
          border-radius: 2px;
        }
        .experiment-link {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .experiment-link:hover { color: var(--text-primary); }
        .experiment-link.accent { color: var(--accent); }
        .experiment-link.accent:hover { color: var(--text-primary); }

        @media (max-width: 900px) {
          .experiments-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .experiments-reveal, .experiment-card { opacity: 1 !important; transform: none !important; }
          .experiment-thumb img { transition: none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="experiments"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="section-wrapper">
          <div className="section-num-col">
            <span className="section-num">05</span>
          </div>
          <div className="section-divider-line" />
          <div className="section-content-col">

            <span className="section-overline experiments-reveal opacity-0">05 — Experiments</span>

            <div style={{ marginBottom: 'var(--space-3xl)' }}>
              <h2
                className="experiments-reveal opacity-0 editorial-heading"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                <span className="display-word">THE</span>
                <em className="accent-word" style={{ fontSize: '0.85em' }}>laboratory</em>
              </h2>
              <p
                className="experiments-reveal opacity-0"
                style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}
              >
                WebGL and shader studies from my Three.js journey — all live, all open source.
              </p>
            </div>

            <div className="experiments-grid">
              {EXPERIMENTS.map((exp, i) => (
                <ExperimentCard key={exp.title} exp={exp} index={i} />
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
