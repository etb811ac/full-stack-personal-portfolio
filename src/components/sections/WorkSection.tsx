'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const COLS = [
  {
    label: 'Recibido', color: '#818cf8', bg: 'rgba(99,102,241,0.15)', baseCount: 2,
    cards: [
      { plate: 'QRS-678', service: 'Lavado Completo', time: '2m' },
      { plate: 'ABC-123', service: 'Básico', time: '5m' },
    ],
  },
  {
    label: 'Lavando', color: '#60a5fa', bg: 'rgba(59,130,246,0.15)', baseCount: 1,
    cards: [{ plate: 'DEF-456', service: 'Encerado', time: '28m' }],
  },
  {
    label: 'Secado', color: '#fbbf24', bg: 'rgba(234,179,8,0.15)', baseCount: 0,
    cards: [],
  },
  {
    label: 'Listo', color: '#4ade80', bg: 'rgba(34,197,94,0.15)', baseCount: 1,
    cards: [{ plate: 'MNO-345', service: 'Motor', time: null }],
  },
] as const;

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [queueState, setQueueState] = useState({ stage: 0, exiting: false });

  // Cycle the moving card through columns
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setQueueState(s => ({ ...s, exiting: true }));
      timeout = setTimeout(() => {
        setQueueState(s => ({ stage: (s.stage + 1) % 4, exiting: false }));
      }, 350);
    }, 2200);
    return () => { clearInterval(id); clearTimeout(timeout); };
  }, []);

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
        el.querySelectorAll('.work-reveal'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 65%', once: true },
        }
      );

      gsap.fromTo(
        el.querySelector('.work-card'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: el.querySelector('.work-card'), start: 'top 75%', once: true },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <>
      <style>{`
        .work-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3xl);
          align-items: center;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          padding: var(--space-3xl);
          border-radius: 2px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .work-card:hover {
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
          box-shadow: 0 0 40px color-mix(in srgb, var(--accent) 8%, transparent);
        }
        .work-pill {
          display: inline-block;
          padding: 3px 10px;
          border: 1px solid var(--border);
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 1px;
          border-radius: 2px;
        }
        .work-pill.accent {
          border-color: rgba(255,107,53,0.35);
          color: var(--accent);
          background: rgba(255,107,53,0.06);
        }
        .work-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--accent);
          border: 1px solid rgba(255,107,53,0.4);
          padding: 10px 20px;
          border-radius: 2px;
          background: rgba(255,107,53,0.06);
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .work-cta-primary:hover {
          background: rgba(255,107,53,0.12);
          border-color: rgba(255,107,53,0.7);
        }
        .work-cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .work-cta-ghost:hover { color: var(--text-primary); }

        /* Queue mock */
        .queue-mock {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
          font-family: var(--font-mono);
          font-size: 10px;
        }
        .queue-mock-bar {
          background: var(--bg-tertiary);
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .queue-mock-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }
        .queue-mock-url {
          font-size: 9px;
          color: var(--text-tertiary);
          letter-spacing: 0.5px;
        }
        .queue-columns {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 12px;
          gap: 8px;
        }
        .queue-col-header {
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-tertiary);
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .queue-col-count {
          width: 16px; height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
        }
        .queue-vehicle-card {
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 7px 8px;
          margin-bottom: 5px;
          background: var(--bg-secondary);
        }
        .queue-plate {
          font-size: 9px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 1px;
          margin-bottom: 2px;
        }
        .queue-service {
          font-size: 8px;
          color: var(--text-tertiary);
        }
        .queue-time {
          font-size: 8px;
          color: var(--accent);
          float: right;
        }

        @keyframes qmEnter {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .queue-moving-card {
          border-color: rgba(255,107,53,0.55);
          background: rgba(255,107,53,0.07);
        }
        .qm-in { animation: qmEnter 0.32s ease both; }
        .qm-out {
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        @media (max-width: 900px) {
          .work-card { grid-template-columns: 1fr; }
          .queue-mock { display: none; }
        }
        @media (max-width: 767px) {
          .work-card {
            padding: var(--space-lg);
            gap: var(--space-lg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .work-reveal { opacity: 1 !important; transform: none !important; }
          .work-card { opacity: 1 !important; transform: none !important; }
          .qm-in, .qm-out { animation: none; transition: none; opacity: 1; transform: none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="work"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="section-wrapper">
          <div className="section-num-col">
            <span className="section-num">04</span>
          </div>
          <div className="section-divider-line" />
          <div className="section-content-col">

            <span className="section-overline work-reveal opacity-0">04 — Work</span>

            <div style={{ marginBottom: 'var(--space-3xl)' }}>
              <h2
                className="work-reveal opacity-0 editorial-heading"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                <span className="display-word">THINGS</span>
                <em className="accent-word" style={{ fontSize: '0.85em' }}>I've built</em>
              </h2>
              <p
                className="work-reveal opacity-0"
                style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}
              >
                Products designed, built, and shipped end to end.
              </p>
            </div>

            {/* Project card */}
            <div className="work-card">
              {/* Left: info */}
              <div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  display: 'block',
                  marginBottom: 'var(--space-sm)',
                }}>
                  SaaS — Car Wash Queue Management
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  letterSpacing: '0.02em',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: 'var(--space-md)',
                }}>
                  LAVAPP
                </h3>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--space-xl)',
                  maxWidth: '400px',
                }}>
                  Digital queue management and automatic WhatsApp notifications for car wash businesses.
                </p>

                {/* Stack pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-2xl)' }}>
                  {['Next.js 15', 'Supabase', 'Paddle', 'Claude AI', 'WhatsApp', 'Resend'].map((pill, i) => (
                    <span key={pill} className={`work-pill${i < 2 ? ' accent' : ''}`}>
                      {pill}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                  <Link href="/work/lavapp" className="work-cta-primary">
                    Read case study →
                  </Link>
                  <a
                    href="https://lavapp.center"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-cta-ghost"
                  >
                    lavapp.center ↗
                  </a>
                </div>
              </div>

              {/* Right: queue mock */}
              <div className="queue-mock">
                <div className="queue-mock-bar">
                  <span className="queue-mock-dot" style={{ background: '#ff5f57' }} />
                  <span className="queue-mock-dot" style={{ background: '#febc2e' }} />
                  <span className="queue-mock-dot" style={{ background: '#28c840' }} />
                  <span className="queue-mock-url" style={{ marginLeft: '6px' }}>lavapp.center/queue</span>
                </div>
                <div className="queue-columns">
                  {COLS.map((col, i) => (
                    <div key={col.label}>
                      <div className="queue-col-header">
                        <span>{col.label}</span>
                        <span className="queue-col-count" style={{ background: col.bg, color: col.color }}>
                          {col.baseCount + (queueState.stage === i ? 1 : 0)}
                        </span>
                      </div>
                      {col.cards.map(card => (
                        <div key={card.plate} className="queue-vehicle-card">
                          <div className="queue-plate">
                            {card.plate}
                            {card.time && <span className="queue-time">{card.time}</span>}
                          </div>
                          <div className="queue-service">{card.service}</div>
                        </div>
                      ))}
                      {queueState.stage === i && (
                        <div className={`queue-vehicle-card queue-moving-card ${queueState.exiting ? 'qm-out' : 'qm-in'}`}>
                          <div className="queue-plate">
                            GHI-789
                            <span className="queue-time" style={{ color: 'var(--accent)' }}>0m</span>
                          </div>
                          <div className="queue-service">Premium</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
