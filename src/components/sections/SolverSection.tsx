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

const sceneSteps = [
  { label: '🔧 Auto', id: 0 },
  { label: '⚡ Electronics', id: 1 },
  { label: '💻 Code', id: 2 },
  { label: '🔌 PCB', id: 3 },
  { label: '🔥 Solder', id: 4 },
];

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % sceneSteps.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStepClick = (id: number) => {
    setActiveScene(id);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % sceneSteps.length);
    }, 3000);
  };

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
      className="relative"
      style={{ padding: 'var(--space-6xl) var(--space-2xl)', background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section number */}
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
          02
        </span>

        {/* Label */}
        <div
          className="solver-reveal opacity-0 flex items-center"
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
          About Me
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'var(--space-4xl)' }}>
          {/* Left: 3D Scene */}
          <div className="solver-3d-wrap opacity-0 relative w-full h-[550px] lg:h-[550px]">
            <SolverScene activeScene={activeScene} />
            {/* Scene step tabs */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center z-[2]"
              style={{ gap: 'var(--space-sm)' }}
            >
              {sceneSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className="whitespace-nowrap cursor-pointer transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    padding: 'var(--space-xs) var(--space-md)',
                    borderRadius: '9999px',
                    background: activeScene === step.id ? 'var(--text-primary)' : 'var(--bg-elevated)',
                    color: activeScene === step.id ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                    border: `1px solid ${activeScene === step.id ? 'var(--text-primary)' : 'var(--border)'}`,
                  }}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <h2
              className="solver-reveal opacity-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-xl)',
              }}
            >
              I&apos;m a problem solver<br />
              <em style={{ opacity: 0.6 }}>by nature.</em>
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
                  className="transition-all duration-200 cursor-default"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '1px solid var(--border)',
                    borderRadius: '9999px',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
