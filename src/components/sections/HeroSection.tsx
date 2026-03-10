'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'var(--bg-secondary)', borderRadius: '16px' }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '14px' }}>
        Loading 3D...
      </span>
    </div>
  ),
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // GSAP animations
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      // Hero content reveal
      gsap.fromTo(
        el.querySelectorAll('.hero-animate'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
          delay: 0.3,
        }
      );

      // Hero 3D reveal
      gsap.fromTo(
        el.querySelector('.hero-3d-container'),
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: 'expo.out', delay: 0.5 }
      );

      // Parallax on scroll
      gsap.to(el.querySelector('.hero-3d-container'), {
        y: -60,
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--gradient-hero)', paddingTop: '80px' }}
    >
      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }}
      />

      <div
        className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center"
        style={{ padding: '0 var(--space-2xl)', gap: 'var(--space-3xl)' }}
      >
        {/* Left: Content */}
        <div className="z-[2]">
          {/* Eyebrow */}
          <div
            className="hero-animate flex items-center opacity-0"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-lg)',
              gap: 'var(--space-md)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: '#22c55e', animation: 'pulse-dot 2s ease-in-out infinite' }}
            />
            Available for projects
          </div>

          {/* Title */}
          <h1
            className="hero-animate opacity-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <span className="block">Esteban</span>
            <span className="block">Acuña</span>
          </h1>

          {/* Tagline */}
          <div
            className="hero-animate opacity-0 relative"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
              marginBottom: 'var(--space-xl)',
              paddingLeft: 'var(--space-xl)',
            }}
          >
            <span
              className="absolute left-0 rounded-full"
              style={{
                top: '15%',
                height: '70%',
                width: '2px',
                background: 'var(--accent)',
              }}
            />
            Full-Stack Developer
          </div>

          {/* Subtitle */}
          <p
            className="hero-animate opacity-0"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              lineHeight: 1.7,
              marginBottom: 'var(--space-2xl)',
            }}
          >
            I build digital experiences where code meets craft. From pixel-perfect interfaces to robust backends —
            and everything in between, including the furniture I sit on while coding.
          </p>

          {/* CTAs */}
          <div className="hero-animate opacity-0 flex flex-wrap gap-4 items-center">
            <a
              href="#contact"
              className="inline-block text-sm font-semibold uppercase tracking-widest rounded-full transition-all duration-400 hover:scale-[1.02]"
              style={{
                fontFamily: 'var(--font-display)',
                padding: 'var(--space-md) var(--space-xl)',
                background: 'var(--text-primary)',
                color: 'var(--text-inverse)',
                letterSpacing: '0.08em',
              }}
            >
              Get in Touch
            </a>
            <a
              href="#expertise"
              className="inline-block text-sm font-medium uppercase tracking-widest rounded-full transition-all duration-400 hover:scale-[1.02]"
              style={{
                fontFamily: 'var(--font-display)',
                padding: 'var(--space-md) var(--space-xl)',
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                letterSpacing: '0.08em',
              }}
            >
              View Expertise
            </a>
          </div>
        </div>

        {/* Right: 3D Scene */}
        <div className="hero-3d-container w-full h-[500px] lg:h-[500px] opacity-0 relative">
          <HeroScene />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        style={{
          bottom: 'var(--space-3xl)',
          gap: 'var(--space-sm)',
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <span>Scroll</span>
        <div
          className="w-px h-10"
          style={{
            background: 'linear-gradient(to bottom, var(--text-tertiary), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes scrollPulse {
          0% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(0.5); }
          100% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}
