'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'transparent' }}
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
      // Respect reduced motion — CSS already shows elements; skip all JS animation
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      // 3D scene breathes in — opacity only, no slide
      gsap.fromTo(
        el.querySelector('.hero-3d-container'),
        { opacity: 0 },
        { opacity: 1, duration: 1.8, ease: 'power2.out', delay: 0.2 }
      );

      // Text stagger entrance
      gsap.fromTo(
        el.querySelectorAll('.hero-animate'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: 0.1, delay: 0.3 }
      );

      // Name letter-spacing cinematic settle (ESTEBAN only — italics don't benefit)
      gsap.fromTo(
        el.querySelector('.hero-name-display'),
        { letterSpacing: '0.08em' },
        { letterSpacing: '0.02em', duration: 1.4, ease: 'expo.out', delay: 0.3 }
      );

      // Deeper parallax on scroll
      gsap.to(el.querySelector('.hero-3d-container'), {
        y: -120,
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
      style={{
        background: 'var(--gradient-hero)',
        minHeight: '100vh',
        paddingTop: '80px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }}
      />

      {/* 3D scene: full-width bleed from the right, outside max-width wrapper */}
      <div
        className="hero-3d-container opacity-0"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <HeroScene />
      </div>

      {/* Left vignette — soft 30% desktop, 35% tablet, lets 3D breathe */}
      <div
        className="hero-left-vignette"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '30%',
          background: 'linear-gradient(90deg, rgba(var(--bg-primary-rgb), 0.92) 0%, rgba(var(--bg-primary-rgb), 0.60) 55%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Mobile overlay — full dark wash for legibility on small screens */}
      <div
        className="hero-mobile-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(var(--bg-primary-rgb), 0.60)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div className="section-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        {/* Ghost number column */}
        <div className="section-num-col">
          <span className="section-num">01</span>
        </div>

        <div className="section-divider-line" />

        {/* Main hero content */}
        <div className="section-content-col" style={{ padding: 0 }}>
          <div
            className="w-full"
            style={{ padding: '0 var(--space-2xl)' }}
          >
            {/* Left: Content */}
            <div className="z-[2] relative">
              {/* Status badge */}
              <div className="hero-animate opacity-0" style={{ marginBottom: 'var(--space-xl)' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '0',
                  padding: '6px 14px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)' }}>
                    Available for projects
                  </span>
                </div>
              </div>

              {/* Name treatment */}
              <h1
                className="hero-animate opacity-0"
                style={{ lineHeight: '0.88', marginBottom: 'var(--space-xl)' }}
              >
                <span className="hero-name-display" style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.02em',
                  color: 'var(--text-primary)',
                  display: 'block',
                }}>
                  ESTEBAN
                </span>
                <em className="hero-name-accent" style={{
                  fontFamily: 'var(--font-accent)',
                  fontStyle: 'italic',
                  color: 'var(--accent)',
                  display: 'block',
                }}>
                  Acuña
                </em>
              </h1>

              {/* Tagline */}
              <p
                className="hero-animate opacity-0"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  letterSpacing: '2px',
                  color: 'var(--text-tertiary)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                // Full-Stack Developer
              </p>

              {/* Subtitle */}
              <p
                className="hero-animate opacity-0"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '480px',
                  lineHeight: 1.7,
                  marginBottom: 'var(--space-lg)',
                }}
              >
                Digital experiences built where code meets craft — from pixel-perfect interfaces to robust backends,
                and everything in between.
              </p>

              {/* CTA Buttons */}
              <div className="hero-animate opacity-0" style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-2xl)' }}>
                <a href="#contact" className="btn-primary">Get in Touch</a>
                <a href="#expertise" className="btn-ghost">View Expertise</a>
              </div>
            </div>
          </div>
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
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes scrollPulse {
          0% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(0.5); }
          100% { opacity: 1; transform: scaleY(1); }
        }

        /* Name responsive sizes */
        .hero-name-display { font-size: clamp(5rem, 11vw, 9.5rem); }
        .hero-name-accent  { font-size: clamp(4.5rem, 10vw, 8.5rem); }

        @media (max-width: 1024px) {
          .hero-name-display { font-size: clamp(4rem, 9vw, 7rem); }
          .hero-name-accent  { font-size: clamp(3.5rem, 8vw, 6.2rem); }
          .hero-left-vignette { width: 35%; }
        }
        @media (max-width: 767px) {
          .hero-name-display { font-size: clamp(3rem, 13vw, 4.5rem); }
          .hero-name-accent  { font-size: clamp(2.5rem, 12vw, 4rem); }
          .hero-left-vignette { display: none; }
        }

        /* Mobile overlay — hidden on tablet/desktop, visible on mobile */
        .hero-mobile-overlay { display: none; }
        @media (max-width: 767px) { .hero-mobile-overlay { display: block; } }

        /* Reduced motion — elements visible immediately, no transforms */
        @media (prefers-reduced-motion: reduce) {
          .hero-animate { opacity: 1 !important; transform: none !important; }
          .hero-3d-container { opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}
