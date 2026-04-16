# LavApp Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact "Work" teaser section (04) to the homepage and a full five-chapter case study page at `/work/lavapp`.

**Architecture:** `WorkSection.tsx` lives between Expertise and Reviews on the homepage — it shows a single LavApp project card with a CSS mock of the queue UI and a CTA to `/work/lavapp`. The case study page at `src/app/work/lavapp/page.tsx` is standalone (reuses the existing `Navbar` and `Footer`) and contains all five narrative chapters inline. No new dependencies required.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, GSAP + ScrollTrigger (already installed), existing CSS design tokens.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/sections/ReviewsSection.tsx` | Modify | Section number `"04"` → `"05"` |
| `src/components/sections/ContactSection.tsx` | Modify | Section number `"05"` → `"06"` |
| `src/components/ui/Navbar.tsx` | Modify | Add `"Work"` nav link → `/#work` |
| `src/components/sections/WorkSection.tsx` | Create | Homepage teaser with LavApp card + queue mock |
| `src/app/page.tsx` | Modify | Mount `WorkSection` between Expertise and Reviews |
| `src/app/work/lavapp/page.tsx` | Create | Full five-chapter case study page |

---

## Task 1: Bump section numbers on Reviews and Contact

**Files:**
- Modify: `src/components/sections/ReviewsSection.tsx:74`
- Modify: `src/components/sections/ContactSection.tsx:108`

- [ ] **Step 1: Update ReviewsSection number**

In `src/components/sections/ReviewsSection.tsx`, find line 74:
```tsx
<span className="section-num">04</span>
```
Change to:
```tsx
<span className="section-num">05</span>
```

- [ ] **Step 2: Update ContactSection number**

In `src/components/sections/ContactSection.tsx`, find line 108:
```tsx
<span className="section-num">05</span>
```
Change to:
```tsx
<span className="section-num">06</span>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/estebanacuna/Sites/full-stack-personal-portfolio
npm run build 2>&1 | tail -20
```
Expected: build succeeds (or same errors as before this task — no new errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ReviewsSection.tsx src/components/sections/ContactSection.tsx
git commit -m "refactor: bump section numbers — Reviews 04→05, Contact 05→06"
```

---

## Task 2: Add "Work" link to Navbar

**Files:**
- Modify: `src/components/ui/Navbar.tsx:6-11`

- [ ] **Step 1: Add Work link to navLinks array**

In `src/components/ui/Navbar.tsx`, find the `navLinks` array (lines 6–11):
```tsx
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];
```
Replace with:
```tsx
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Work', href: '#work' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Navbar.tsx
git commit -m "feat(navbar): add Work link → #work"
```

---

## Task 3: Create WorkSection.tsx

**Files:**
- Create: `src/components/sections/WorkSection.tsx`

- [ ] **Step 1: Create the file**

Create `src/components/sections/WorkSection.tsx` with the following content:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function WorkSection() {
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
          gap: 0;
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

        @media (max-width: 900px) {
          .work-card { grid-template-columns: 1fr; }
          .queue-mock { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .work-reveal { opacity: 1 !important; transform: none !important; }
          .work-card { opacity: 1 !important; transform: none !important; }
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
                  {/* Recibido */}
                  <div>
                    <div className="queue-col-header">
                      <span>Recibido</span>
                      <span className="queue-col-count" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>2</span>
                    </div>
                    <div className="queue-vehicle-card">
                      <div className="queue-plate">QRS-678 <span className="queue-time">2m</span></div>
                      <div className="queue-service">Lavado Completo</div>
                    </div>
                    <div className="queue-vehicle-card">
                      <div className="queue-plate">ABC-123 <span className="queue-time">5m</span></div>
                      <div className="queue-service">Básico</div>
                    </div>
                  </div>
                  {/* En Lavado */}
                  <div>
                    <div className="queue-col-header">
                      <span>Lavando</span>
                      <span className="queue-col-count" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>1</span>
                    </div>
                    <div className="queue-vehicle-card">
                      <div className="queue-plate">DEF-456 <span className="queue-time">28m</span></div>
                      <div className="queue-service">Encerado</div>
                    </div>
                  </div>
                  {/* Secado */}
                  <div>
                    <div className="queue-col-header">
                      <span>Secado</span>
                      <span className="queue-col-count" style={{ background: 'rgba(234,179,8,0.15)', color: '#fbbf24' }}>0</span>
                    </div>
                  </div>
                  {/* Listo */}
                  <div>
                    <div className="queue-col-header">
                      <span>Listo</span>
                      <span className="queue-col-count" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>1</span>
                    </div>
                    <div className="queue-vehicle-card">
                      <div className="queue-plate">MNO-345</div>
                      <div className="queue-service">Motor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/WorkSection.tsx
git commit -m "feat(work): add WorkSection homepage teaser with LavApp card"
```

---

## Task 4: Mount WorkSection on the homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Import WorkSection**

In `src/app/page.tsx`, add the import after the `ExpertiseSection` import:
```tsx
import WorkSection from '@/components/sections/WorkSection';
```

- [ ] **Step 2: Mount between Expertise and Reviews**

In `src/app/page.tsx`, find:
```tsx
          {/* 3. Expertise & Tech Stack */}
          <ExpertiseSection />

          {/* 4. Reviews */}
          <ReviewsSection />
```
Replace with:
```tsx
          {/* 3. Expertise & Tech Stack */}
          <ExpertiseSection />

          {/* 4. Work */}
          <WorkSection />

          {/* 5. Reviews */}
          <ReviewsSection />
```

- [ ] **Step 3: Build and visual check**

```bash
npm run build 2>&1 | tail -20
```
Expected: clean build.

Then run dev and verify in browser:
```bash
npm run dev
```
Open `http://localhost:3000`. Scroll to the Work section:
- Section number `04` visible (large faded)
- "04 — Work" overline in accent orange
- "THINGS / I've built" heading
- LavApp card with queue mock on right
- "Read case study →" and "lavapp.center ↗" CTAs
- Reviews section now shows `05`, Contact shows `06`
- Navbar has "Work" link that scrolls to `#work`

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: mount WorkSection between Expertise and Reviews"
```

---

## Task 5: Create the /work/lavapp case study page

**Files:**
- Create: `src/app/work/lavapp/page.tsx`

This is a standalone page. It imports the existing `Navbar` and `Footer` components. No layout file needed.

- [ ] **Step 1: Create directory and file**

```bash
mkdir -p /Users/estebanacuna/Sites/full-stack-personal-portfolio/src/app/work/lavapp
```

Create `src/app/work/lavapp/page.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
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
        <div className="arch-diagram">
          <div className="arch-row">
            <div className="arch-node primary">Next.js 15<span>App Router</span></div>
            <span className="arch-arrow">→</span>
            <div className="arch-node primary">Supabase<span>PostgreSQL + RLS</span></div>
            <span className="arch-arrow">→</span>
            <div className="arch-node">Paddle<span>Billing</span></div>
          </div>
          <div className="arch-row" style={{ marginTop: '8px' }}>
            <div className="arch-node">Anthropic<span>Claude AI</span></div>
            <span className="arch-arrow">→</span>
            <div className="arch-node">Resend<span>Email</span></div>
            <span className="arch-arrow">→</span>
            <div className="arch-node">WhatsApp<span>Notifications</span></div>
          </div>
        </div>
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
    const loadGSAP = async () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = bodyRef.current;
      if (!el) return;

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
    };

    loadGSAP();
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
          border-color: rgba(255,107,53,0.35);
          color: var(--accent);
          background: rgba(255,107,53,0.06);
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
        }
        .arch-node span { font-size: 9px; color: var(--text-tertiary); }
        .arch-node.primary {
          border-color: rgba(255,107,53,0.35);
          color: var(--accent);
        }
        .arch-arrow { color: var(--border); font-size: 14px; }

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
          border: 1px solid rgba(255,107,53,0.4);
          border-radius: 2px;
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          background: rgba(255,107,53,0.06);
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .cs-live-link:hover {
          background: rgba(255,107,53,0.12);
          border-color: rgba(255,107,53,0.7);
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

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .cs-hero-reveal, .cs-chapter-reveal { opacity: 1 !important; transform: none !important; }
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
          }}>
            <div className="section-wrapper">
              <div className="section-num-col" />
              <div className="section-divider-line" />
              <div className="section-content-col" style={{ paddingTop: 0, paddingBottom: 0 }}>

                {/* Back link */}
                <a
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
                </a>

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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -30
```
Expected: clean build with no type errors.

- [ ] **Step 3: Visual check in dev server**

```bash
npm run dev
```

Navigate to `http://localhost:3000/work/lavapp` and verify:
- Navbar renders correctly
- Back link "← Work" routes to `/#work`
- Hero shows `LAVAPP` + italic `"From zero to production"` + stack chips + live link
- Five chapters scroll with dividers between them
- Ch.01: Problem text + 4 pills
- Ch.02: Architecture text + node diagram (two rows) + stack pills
- Ch.03: Feature text + 2×2 card grid
- Ch.04: Deep-dive text + 4 horizontal label+description cards
- Ch.05: Outcome text + 3-column stat grid + pulsing live link
- Footer renders
- Dark/light theme toggle works correctly
- Mobile layout: chapter number column collapses, feature grid goes single column

- [ ] **Step 4: Commit**

```bash
git add src/app/work/lavapp/page.tsx
git commit -m "feat(work): add /work/lavapp full case study page"
```

---

## Self-Review Checklist

- [x] **Section numbers** — Reviews bumped to 05, Contact to 06 in Task 1
- [x] **Navbar "Work" link** — `#work` added in Task 2
- [x] **WorkSection `id="work"`** — present on `<section>` in Task 3
- [x] **WorkSection GSAP** — `work-reveal` + `work-card` animations, reduced motion respected
- [x] **WorkSection responsive** — `@media (max-width: 900px)` collapses to single column, hides queue mock
- [x] **Case study page hero** — back link, overline, LAVAPP heading, italic subtitle, meta chips, live link
- [x] **All five chapters** — 01 Problem, 02 Architecture, 03 Features, 04 Deep-Dives, 05 Outcome
- [x] **Chapter GSAP** — `.cs-chapter-reveal` animations per chapter, reduced motion respected
- [x] **Feature grid responsive** — single column on mobile
- [x] **Deep-dive cards responsive** — single column on mobile
- [x] **Outcome stat grid responsive** — single column on mobile
- [x] **Live link pulsing dot** — `livePulse` keyframe defined
- [x] **`cs-pill` / `cs-pill.accent`** — defined in `<style>` and used consistently
- [x] **No new dependencies** — only GSAP (already installed) and Next.js `Link`
- [x] **Both dark/light themes** — all colors use CSS variables
