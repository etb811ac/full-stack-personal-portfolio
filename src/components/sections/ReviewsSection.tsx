'use client';

import { useEffect, useRef } from 'react';

const reviews = [
  {
    text: "Esteban delivered an exceptional product that exceeded our expectations. His ability to combine creative frontend work with solid backend architecture is rare and incredibly valuable.",
    initials: 'JD',
    name: 'Jane Doe',
    role: 'CEO, TechStartup Inc.',
  },
  {
    text: "Working with Esteban was a game-changer. He didn't just write code — he understood the problem deeply and came up with solutions we hadn't even considered. True problem-solver mentality.",
    initials: 'AS',
    name: 'Alex Smith',
    role: 'Product Lead, DesignCo',
  },
  {
    text: "The 3D interactions and animations Esteban built for our site were stunning. Fast, responsive, and buttery smooth. He has a real eye for creative tech that most developers lack.",
    initials: 'MR',
    name: 'Maria Rodriguez',
    role: 'Creative Director, Agency X',
  },
];

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll('.review-reveal'),
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

      gsap.fromTo(
        el.querySelectorAll('.review-card'),
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el.querySelector('.reviews-grid'), start: 'top 70%', once: true },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative"
      style={{ padding: 'var(--space-6xl) var(--space-2xl)', background: 'var(--bg-secondary)' }}
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
          04
        </span>

        <div
          className="review-reveal opacity-0 flex items-center"
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
          Testimonials
        </div>

        <div className="text-center max-w-[600px] mx-auto" style={{ marginBottom: 'var(--space-4xl)' }}>
          <h2
            className="review-reveal opacity-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-md)',
            }}
          >
            What people <em>say</em>
          </h2>
          <p className="review-reveal opacity-0" style={{ color: 'var(--text-secondary)' }}>
            Words from collaborators, clients, and people I&apos;ve worked with.
          </p>
        </div>

        <div className="reviews-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--space-lg)' }}>
          {reviews.map((review, i) => (
            <div
              key={i}
              className="review-card relative transition-all duration-400 hover:-translate-y-1"
              style={{
                padding: 'var(--space-2xl)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--gradient-card)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {/* Stars */}
              <div
                className="absolute"
                style={{
                  top: 'var(--space-2xl)',
                  right: 'var(--space-2xl)',
                  color: '#f59e0b',
                  fontSize: '0.875rem',
                  letterSpacing: '2px',
                }}
              >
                ★★★★★
              </div>

              {/* Quote mark */}
              <div
                style={{
                  fontSize: '2.5rem',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1,
                  marginBottom: 'var(--space-md)',
                  opacity: 0.3,
                }}
              >
                &ldquo;
              </div>

              {/* Text */}
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: 'var(--space-xl)',
                  fontStyle: 'italic',
                }}
              >
                {review.text}
              </p>

              {/* Author */}
              <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {review.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                    {review.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
