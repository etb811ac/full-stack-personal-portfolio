'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const SolverScene = dynamic(() => import('@/components/three/SolverScene'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'var(--bg-tertiary)', borderRadius: '16px' }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '14px' }}>
        Loading 3D...
      </span>
    </div>
  ),
});

const traits = [
  'DIY Mindset',
  'Hardware & Software',
  'Self-Taught',
  'First-Principles Thinker',
  'Builder',
  'Woodworking',
  'Electronics',
  'Automotive',
];

export default function SolverSection() {
  const [activeScene, setActiveScene] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-cycle
  useEffect(() => {
    const id = setInterval(() => setActiveScene(p => (p + 1) % 5), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      // Left 3D reveal
      gsap.fromTo(
        el.querySelector('.solver-3d-wrap'),
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        }
      );

      // Right content reveal
      gsap.fromTo(
        el.querySelectorAll('.solver-reveal'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 60%', once: true },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="section-wrapper">
        <div className="section-num-col">
          <span className="section-num">02</span>
        </div>
        <div className="section-divider-line" />
        <div className="section-content-col">
          {/* Section overline */}
          <span className="section-overline solver-reveal opacity-0">02 — About</span>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'var(--space-4xl)' }}>
            {/* Left: 3D Scene */}
            <div className="solver-3d-wrap opacity-0 relative w-full h-[550px] lg:h-[550px]">
              <SolverScene activeScene={activeScene} />
            </div>

            {/* Right: Content */}
            <div>
              <h2
                className="solver-reveal opacity-0 editorial-heading"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: 'var(--space-xl)' }}
              >
                <span className="display-word">A PROBLEM</span>
                <em className="accent-word" style={{ fontSize: '0.85em' }}>solver</em>
                <span className="display-word">BY NATURE</span>
              </h2>

              <p
                className="solver-reveal opacity-0"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: 'var(--space-xl)',
                }}
              >
                Before I ever wrote a line of code, I was taking things apart to understand how they work.
                Fixing cars in the garage. Soldering circuits at the kitchen table. Building furniture from raw lumber.
                That same curiosity — that need to <em>figure it out</em> — drives every project I take on.
              </p>

              <p
                className="solver-reveal opacity-0"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: 'var(--space-xl)',
                }}
              >
                When I encounter a problem, I don&apos;t reach for the manual first. I reach for the tools.
                Whether it&apos;s debugging a complex API integration or rewiring a circuit board,
                the approach is the same: understand the system, find the bottleneck, build the fix.
              </p>

              {/* Trait tags */}
              <div className="solver-reveal opacity-0 flex flex-wrap" style={{ gap: 'var(--space-sm)' }}>
                {traits.map((trait) => (
                  <span
                    key={trait}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: '0',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      color: 'var(--text-secondary)',
                      background: 'transparent',
                      transition: 'border-color var(--duration-fast), color var(--duration-fast)',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
