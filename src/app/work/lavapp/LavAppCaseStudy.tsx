'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const SmoothScroll = dynamic(() => import('@/components/ui/SmoothScroll'), { ssr: false });

// ── Data ──────────────────────────────────────────────────────────────────────

const STACK_META = [
  'Next.js 15', 'React 19', 'Supabase', 'PostgreSQL',
  'Paddle', 'Claude AI', 'WhatsApp', 'Resend', 'TypeScript', 'Tailwind CSS',
];

const FEATURES = [
  {
    label: 'Queue',
    title: 'Kanban drag-and-drop board',
    body: 'Built with DnD Kit. Four stages: Received → Washing → Drying → Ready. Real-time status per bay, with time-in-stage tracking.',
  },
  {
    label: 'WhatsApp',
    title: 'Automatic customer notifications',
    body: 'A message fires on every stage change. Customers get a live status page — no calls needed, no waiting.',
  },
  {
    label: 'CRM',
    title: 'Client & vehicle history',
    body: 'Repeat customers, past services, and vehicle profiles saved per business. Fast repeat-visit registration.',
  },
  {
    label: 'Analytics',
    title: 'Business stats dashboard',
    body: 'Revenue, volume, and service-type breakdown. Built with Recharts and server-side Supabase aggregations.',
  },
];

const DEEP_DIVES = [
  {
    label: 'Payments',
    title: 'Paddle Billing',
    body: "Chose Paddle over Stripe for its Merchant of Record model — Paddle handles VAT and tax compliance across regions so the business doesn't have to. Subscription lifecycle events arrive as webhooks and are synced to Supabase.",
  },
  {
    label: 'Database',
    title: 'Supabase Row Level Security',
    body: 'Tenant isolation is enforced at the Postgres level via RLS policies. A policy on every table ensures a business can only ever query its own rows — no application-layer filtering required.',
  },
  {
    label: 'AI',
    title: 'Anthropic Claude SDK',
    body: 'Claude powers ETA suggestions and queue-optimization hints. Structured output via the API — context is built from live queue state and historical service times.',
  },
  {
    label: 'Email',
    title: 'React Email + Resend',
    body: 'Transactional emails are React components rendered server-side. Templates for onboarding, subscription events, and service receipts — each branded with the business name.',
  },
];

// ── Architecture diagram with sequential node animation ───────────────────────

const ARCH_NODES = [
  { label: 'Next.js 15', sub: 'App Router',       primary: true  },
  { label: 'Supabase',   sub: 'PostgreSQL + RLS',  primary: true  },
  { label: 'Paddle',     sub: 'Billing',            primary: false },
  { label: 'Anthropic',  sub: 'Claude AI',          primary: false },
  { label: 'Resend',     sub: 'Email',              primary: false },
  { label: 'WhatsApp',   sub: 'Notifications',      primary: false },
];

function ArchDiagram() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx(n => (n + 1) % ARCH_NODES.length), 700);
    return () => clearInterval(id);
  }, []);

  const renderRow = (indices: number[], mt?: string) => (
    <div className="arch-row" style={mt ? { marginTop: mt } : undefined}>
      {indices.flatMap((ni, pos) => [
        <div
          key={ARCH_NODES[ni].label}
          className={[
            'arch-node',
            ARCH_NODES[ni].primary ? 'primary' : '',
            activeIdx === ni ? 'active' : '',
          ].filter(Boolean).join(' ')}
        >
          {ARCH_NODES[ni].label}
          <span>{ARCH_NODES[ni].sub}</span>
        </div>,
        ...(pos < indices.length - 1
          ? [<span key={`arr-${ni}`} className={`arch-arrow${activeIdx === ni ? ' active' : ''}`}>→</span>]
          : []),
      ])}
    </div>
  );

  return (
    <div className="arch-diagram">
      {renderRow([0, 1, 2])}
      {renderRow([3, 4, 5], '8px')}
    </div>
  );
}

// ── Chapters ──────────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    num: '01',
    label: 'The Problem',
    title: 'Car washes running on paper and phone calls',
    content: (
      <>
        <p>
          Car wash businesses in Costa Rica were managing customer queues on whiteboards. Staff had no
          real-time visibility into which bays were occupied, and when a car was ready the owner had to
          manually call the customer — or the customer had to drive back and check. No status tracking,
          no scale, no customer experience.
        </p>
        <p style={{ marginTop: 'var(--space-md)' }}>
          The opportunity: a lightweight SaaS that replaces the whiteboard, notifies customers
          automatically via WhatsApp, and gives business owners a live view of every vehicle in their queue.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'var(--space-xl)' }}>
          {['SaaS', 'Queue Management', 'B2B', 'Costa Rica'].map((t, i) => (
            <span key={t} className={`cs-pill${i < 2 ? ' accent' : ''}`}>{t}</span>
          ))}
        </div>
      </>
    ),
  },
  {
    num: '02',
    label: 'Architecture',
    title: 'Multi-tenant from day one',
    content: (
      <>
        <p>
          Every business that signs up gets a fully isolated environment — their queue, clients, employees,
          and analytics — all enforced at the database level via Supabase Row Level Security policies.
          No custom middleware, no shared-data leaks.
        </p>
        <ArchDiagram />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'var(--space-xl)' }}>
          {['Next.js 15', 'Supabase', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vitest'].map((t, i) => (
            <span key={t} className={`cs-pill${i < 2 ? ' accent' : ''}`}>{t}</span>
          ))}
        </div>
      </>
    ),
  },
  {
    num: '03',
    label: 'Key Features',
    title: "Every tool a car wash needs, nothing it doesn't",
    content: (
      <>
        <p>
          Built around the actual workflow: register a vehicle, move it through stages, notify the customer
          at each step. Everything else — CRM, analytics, employee management — supports that core loop.
        </p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.label} className="cs-feature-card">
              <span className="cs-card-label">{f.label}</span>
              <h4 className="cs-card-title">{f.title}</h4>
              <p className="cs-card-body">{f.body}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    num: '04',
    label: 'Tech Deep-Dives',
    title: 'Four decisions worth talking about',
    content: (
      <>
        <p>Some parts of the stack required real thought. These were the interesting ones.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
          {DEEP_DIVES.map((d) => (
            <div key={d.label} className="cs-deep-card">
              <div className="cs-deep-label-col">
                <span className="cs-card-label">{d.label}</span>
                <span className="cs-deep-title">{d.title}</span>
              </div>
              <p className="cs-card-body" style={{ color: 'var(--text-secondary)' }}>{d.body}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    num: '05',
    label: 'Outcome',
    title: 'Shipped, live, and in use',
    content: (
      <>
        <p>
          LavApp went from zero to a deployed, subscription-based SaaS. The full stack — frontend,
          backend, payments, notifications, AI — designed, built, and maintained by one developer.
        </p>
        <div className="outcome-grid">
          {[
            { num: '100%', desc: 'Solo-built — frontend, backend, payments, AI' },
            { num: '6+', desc: 'Integrated systems: Supabase, Paddle, WhatsApp, Claude, Resend, DnD Kit' },
            { num: 'Live', desc: 'Production SaaS with real subscription plans' },
          ].map((s) => (
            <div key={s.num} className="outcome-stat">
              <span className="outcome-num">{s.num}</span>
              <span className="outcome-desc">{s.desc}</span>
            </div>
          ))}
        </div>
        <a
          href="https://lavapp.center"
          target="_blank"
          rel="noopener noreferrer"
          className="cs-live-link"
        >
          <span className="live-dot" />
          lavapp.center — live
        </a>
      </>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function LavAppCaseStudy() {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const loadGSAP = async () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = bodyRef.current;
      if (!el) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll('.cs-hero-reveal'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.1 }
        );

        el.querySelectorAll('.cs-chapter').forEach((chapter) => {
          gsap.fromTo(
            chapter.querySelectorAll('.cs-chapter-reveal'),
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.1,
              scrollTrigger: { trigger: chapter, start: 'top 80%', once: true },
            }
          );
        });
      }, el);
    };

    loadGSAP();

    return () => ctx?.revert();
  }, []);

  return (
    <>
      <style>{`
        /* ── Chips ── */
        .cs-pill {
          display: inline-block;
          padding: 3px 10px;
          border: 1px solid var(--border);
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 1px;
          border-radius: 2px;
        }
        .cs-pill.accent {
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 6%, transparent);
        }

        /* ── Chapter layout ── */
        .cs-chapter {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 0 40px;
          padding-bottom: var(--space-4xl);
          margin-bottom: var(--space-4xl);
          border-bottom: 1px solid var(--border);
        }
        .cs-chapter:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .cs-chapter-num-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-top: 3px;
        }
        .cs-chapter-num {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent);
          letter-spacing: 2px;
        }
        .cs-chapter-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .cs-chapter-line {
          width: 1px;
          flex: 1;
          background: linear-gradient(to bottom, var(--accent), transparent);
          min-height: 40px;
        }
        .cs-chapter-label {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }
        .cs-chapter-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: var(--space-lg);
          font-family: var(--font-body);
        }
        .cs-chapter-body {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.75;
        }

        /* ── Architecture diagram ── */
        .arch-diagram {
          margin-top: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .arch-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .arch-node {
          padding: 8px 14px;
          border: 1px solid var(--border);
          border-radius: 2px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .arch-node span { font-size: 9px; color: var(--text-tertiary); }
        .arch-node.primary {
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
          color: var(--accent);
        }
        .arch-node.active {
          border-color: color-mix(in srgb, var(--accent) 65%, transparent);
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 14%, transparent);
        }
        .arch-arrow {
          color: var(--border);
          font-size: 14px;
          transition: color 0.3s ease;
        }
        .arch-arrow.active { color: var(--accent); }

        /* ── Feature cards ── */
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
          margin-top: var(--space-xl);
        }
        .cs-feature-card, .cs-deep-card {
          padding: var(--space-lg);
          border: 1px solid var(--border);
          border-radius: 2px;
          background: var(--bg-secondary);
        }
        .cs-card-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--accent);
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .cs-card-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .cs-card-body {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          line-height: 1.6;
        }

        /* ── Deep-dive cards ── */
        .cs-deep-card {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: var(--space-lg);
          align-items: start;
        }
        .cs-deep-label-col { display: flex; flex-direction: column; gap: 4px; }
        .cs-deep-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }

        /* ── Outcome ── */
        .outcome-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
          margin-top: var(--space-xl);
          margin-bottom: var(--space-xl);
        }
        .outcome-stat {
          padding: var(--space-xl);
          border: 1px solid var(--border);
          border-radius: 2px;
          text-align: center;
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .outcome-num {
          font-family: var(--font-mono);
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent);
        }
        .outcome-desc {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          line-height: 1.4;
        }

        /* ── Live link ── */
        .cs-live-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
          border-radius: 2px;
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          background: color-mix(in srgb, var(--accent) 6%, transparent);
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .cs-live-link:hover {
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          border-color: color-mix(in srgb, var(--accent) 70%, transparent);
        }
        .live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: livePulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .cs-chapter { grid-template-columns: 1fr; }
          .cs-chapter-num-col { flex-direction: row; gap: 8px; padding-top: 0; margin-bottom: var(--space-sm); }
          .cs-chapter-line { display: none; }
          .feature-grid { grid-template-columns: 1fr; }
          .cs-deep-card { grid-template-columns: 1fr; }
          .outcome-grid { grid-template-columns: 1fr; }
        }

        /* ── Hero dynamic background ── */
        .cs-hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .cs-orb {
          position: absolute;
          border-radius: 50%;
          will-change: transform;
        }
        .cs-orb-1 {
          width: 680px; height: 680px;
          top: -200px; right: -140px;
          background: radial-gradient(circle, rgba(255,107,53,0.13) 0%, transparent 65%);
          filter: blur(80px);
          animation: csOrb1 20s ease-in-out infinite;
        }
        .cs-orb-2 {
          width: 520px; height: 520px;
          bottom: -180px; left: -100px;
          background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%);
          filter: blur(90px);
          animation: csOrb2 26s ease-in-out infinite;
        }
        .cs-orb-3 {
          width: 380px; height: 380px;
          top: 45%; left: 38%;
          background: radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 65%);
          filter: blur(70px);
          animation: csOrb3 16s ease-in-out infinite;
        }
        .cs-hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, transparent 4%, rgba(0,0,0,0.14) 22%, rgba(0,0,0,0.14) 78%, transparent 96%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 4%, rgba(0,0,0,0.14) 22%, rgba(0,0,0,0.14) 78%, transparent 96%);
        }
        [data-theme="light"] .cs-hero-dots {
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
        }
        .cs-hero-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 150px;
          background: linear-gradient(to top, var(--bg-primary), transparent);
          pointer-events: none;
          z-index: 2;
        }
        @keyframes csOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-80px, 55px) scale(1.06); }
          66%       { transform: translate(45px, -65px) scale(0.95); }
        }
        @keyframes csOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(90px, -75px) scale(1.08); }
          80%       { transform: translate(-55px, 45px) scale(0.96); }
        }
        @keyframes csOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50%       { transform: translate(-35px, -25px) scale(1.18); opacity: 1; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .cs-hero-reveal, .cs-chapter-reveal { opacity: 1 !important; transform: none !important; }
          .cs-orb { animation: none !important; }
        }
      `}</style>

      <SmoothScroll />
      <div className="grain-overlay" />
      <Navbar />

      <main style={{ paddingTop: '80px' }}>

        {/* ── Page hero ─────────────────────────────── */}
        <div ref={bodyRef}>
          <section style={{
            background: 'var(--gradient-hero)',
            padding: 'var(--space-6xl) 0 var(--space-4xl)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Dynamic background */}
            <div className="cs-hero-bg" aria-hidden="true">
              <div className="cs-orb cs-orb-1" />
              <div className="cs-orb cs-orb-2" />
              <div className="cs-orb cs-orb-3" />
              <div className="cs-hero-dots" />
            </div>
            <div className="cs-hero-fade" aria-hidden="true" />

            <div className="section-wrapper" style={{ position: 'relative', zIndex: 1 }}>
              <div className="section-num-col" />
              <div className="section-divider-line" />
              <div className="section-content-col" style={{ paddingTop: 0, paddingBottom: 0 }}>

                {/* Back link */}
                <Link
                  href="/#work"
                  className="cs-hero-reveal opacity-0"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: 'var(--space-2xl)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                >
                  ← Work
                </Link>

                <span
                  className="cs-hero-reveal opacity-0 section-overline"
                  style={{ marginBottom: 'var(--space-md)' }}
                >
                  Case Study — SaaS
                </span>

                <h1
                  className="cs-hero-reveal opacity-0"
                  style={{ lineHeight: 0.88, marginBottom: 'var(--space-lg)' }}
                >
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(4rem, 8vw, 7rem)',
                    letterSpacing: '0.02em',
                    color: 'var(--text-primary)',
                    display: 'block',
                  }}>
                    LAVAPP
                  </span>
                  <em style={{
                    fontFamily: 'var(--font-accent)',
                    fontStyle: 'italic',
                    color: 'var(--accent)',
                    fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                    display: 'block',
                  }}>
                    From zero to production
                  </em>
                </h1>

                {/* Meta chips */}
                <div
                  className="cs-hero-reveal opacity-0"
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-2xl)' }}
                >
                  {STACK_META.map((t) => (
                    <span key={t} className="cs-pill">{t}</span>
                  ))}
                </div>

                {/* Live link */}
                <a
                  href="https://lavapp.center"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-live-link cs-hero-reveal opacity-0"
                >
                  <span className="live-dot" />
                  lavapp.center
                </a>

              </div>
            </div>
          </section>

          {/* ── Chapters ─────────────────────────────── */}
          <section style={{ background: 'var(--bg-primary)' }}>
            <div className="section-wrapper">
              <div className="section-num-col" />
              <div className="section-divider-line" />
              <div className="section-content-col">
                {CHAPTERS.map((chapter, idx) => (
                  <div key={chapter.num} className="cs-chapter">
                    {/* Number column */}
                    <div className="cs-chapter-num-col">
                      <span className="cs-chapter-num">{chapter.num}</span>
                      <div className="cs-chapter-dot" />
                      {idx < CHAPTERS.length - 1 && <div className="cs-chapter-line" />}
                    </div>
                    {/* Content */}
                    <div>
                      <span className="cs-chapter-label cs-chapter-reveal">{chapter.label}</span>
                      <h2 className="cs-chapter-title cs-chapter-reveal">{chapter.title}</h2>
                      <div className="cs-chapter-body cs-chapter-reveal">
                        {chapter.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

      </main>

      <Footer />
    </>
  );
}
