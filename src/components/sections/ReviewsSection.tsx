'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const reviews = [
  {
    text: "Esteban is not only extremely talented at his craft, he's also committed to making sure every project hits a high bar of quality and excellence. He has an eye for detail and drive to innovate, and the ability to stay positive and collaborate even during challenging projects. Esteban will be a true asset in helping you bring your vision to life.",
    initials: 'DH',
    name: 'Danielle Hart',
    role: 'CEO, Sweetrush',
    photo: '/Danielle.avif',
  },
  {
    text: "Working with Esteban was great. He's someone you can trust to take a task and run with it without needing constant follow-up. He cares about doing things well, not just getting them done, and that shows in his work. Super easy to collaborate with and always open to feedback.",
    initials: 'EH',
    name: 'Emanuel Hernandez',
    role: 'CTO, Skillful AI',
    photo: '/Emanuel.jpg',
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
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="section-wrapper">
        <div className="section-num-col">
          <span className="section-num">04</span>
        </div>
        <div className="section-divider-line" />
        <div className="section-content-col">
          <span className="section-overline review-reveal opacity-0">04 — Reviews</span>

          <div className="text-center max-w-[600px] mx-auto" style={{ marginBottom: 'var(--space-4xl)' }}>
            <h2
              className="review-reveal opacity-0 editorial-heading"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: 'var(--space-md)' }}
            >
              <span className="display-word">WHAT PEOPLE</span>
              <em className="accent-word" style={{ fontSize: '0.85em' }}>say</em>
            </h2>
            <p className="review-reveal opacity-0" style={{ color: 'var(--text-secondary)' }}>
              Words from collaborators, clients, and people I&apos;ve worked with.
            </p>
          </div>

          <div
            className="reviews-grid grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 'var(--space-xl)', maxWidth: '960px', margin: '0 auto' }}
          >
            {reviews.map((review, i) => (
              <div
                key={i}
                className="review-card relative flex flex-col cursor-default"
                style={{
                  padding: 'var(--space-2xl)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--accent)',
                  transition: 'box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1), background 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                {/* Large decorative quote */}
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontStyle: 'italic',
                    fontSize: '5rem',
                    lineHeight: '1',
                    color: 'var(--accent)',
                    opacity: 0.5,
                    display: 'block',
                    marginBottom: 'var(--space-sm)',
                    userSelect: 'none',
                  }}
                >&ldquo;</span>

                {/* Quote text */}
                <p
                  style={{
                    fontSize: '1.0625rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.85,
                    fontStyle: 'italic',
                    flex: 1,
                    marginBottom: 'var(--space-2xl)',
                  }}
                >
                  {review.text}
                </p>

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--border)', marginBottom: 'var(--space-xl)' }} />

                {/* Author */}
                <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
                  <div
                    className="shrink-0 overflow-hidden"
                    style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--border-accent)' }}
                  >
                    <Image
                      src={review.photo}
                      alt={review.name}
                      width={44}
                      height={44}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em',
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {review.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>
                      {review.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
