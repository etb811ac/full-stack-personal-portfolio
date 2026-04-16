# LavApp Case Study — Design Spec

**Date:** 2026-04-15  
**Status:** Approved (revised)

---

## Summary

Two-part implementation:

1. **Homepage teaser** — A compact "Work" section (section 04) on the homepage, between Expertise and Reviews. Shows LavApp at a glance: what it is, the core stack, three or four highlights, and a CTA to read the full case study.
2. **Dedicated case study page** — `/work/lavapp` with the full five-chapter editorial deep-dive. Shareable, standalone, no homepage nav entry.

This keeps the homepage focused while giving recruiters and clients a complete story they can link to directly.

---

## Decisions Made

| Question | Decision |
|---|---|
| Where does it live? | Teaser on homepage **+** full deep-dive at `/work/lavapp` |
| Homepage section length | Short — project card with headline, stack pills, 3–4 bullet highlights, CTA |
| Full case study format | Five-chapter editorial scroll (narrative arc) |
| Primary audience | Both recruiters and potential clients |
| Content structure | Narrative arc: problem → architecture → features → tech → outcome |

---

## Part 1 — Homepage: `WorkSection.tsx`

### Placement

Between Expertise and Reviews:

```
01 — Hero
     Marquee
02 — Solver
03 — Expertise
04 — Work       ← new (teaser only)
05 — Reviews
06 — Contact
```

Section numbers on ReviewsSection (`04` → `05`) and ContactSection (`05` → `06`) need updating.

### Component

New file: `src/components/sections/WorkSection.tsx`

The `<section>` element gets `id="work"`. Navbar gains a `"Work"` link pointing to `#work`.

Follows the existing `section-wrapper` grid:

```
[section-num-col "04"] [section-divider-line] [section-content-col]
```

### Section header

- Overline: `"04 — Work"` — mono, uppercase, `var(--text-tertiary)`
- Heading: `"THINGS"` (display) + `"I've built"` (italic accent) — matching `editorial-heading` / `display-word` / `accent-word` pattern
- Subline: `"Products designed, built, and shipped end to end."` in `var(--text-secondary)`

### Project card — LavApp

A single prominent project card. Horizontally divided:

**Left column (~55%):**
- Project label: `"SaaS — Car Wash Queue Management"`  in mono, small, `var(--text-tertiary)`
- Project name: `"LavApp"` — large display heading
- One-liner: `"Digital queue and automatic WhatsApp notifications for car wash businesses."` in `var(--text-secondary)`
- Stack pills: `Next.js 15`, `Supabase`, `Paddle`, `Claude AI`, `WhatsApp`, `Resend` — mono, small, `var(--border)` border, accent pills for the first two
- CTA: `"Read case study →"` — accent-colored link/button, routes to `/work/lavapp`
- Secondary link: `"lavapp.center ↗"` — ghost style, opens `https://lavapp.center` in new tab

**Right column (~45%):**
- A styled mock of the LavApp queue UI — built in HTML/CSS, not a real screenshot. Shows the Kanban columns (Recibido · En Lavado · Secado · Listo) with a couple of fake vehicle cards. Dark background matching the portfolio theme, subtle border. This is decorative and static.

Card styling:
- `border: 1px solid var(--border)`, `background: var(--bg-secondary)`, `border-radius: 2px`
- On hover: `border-color` shifts to `color-mix(in srgb, var(--accent) 30%, transparent)`, subtle `box-shadow` glow — matching `ExpertiseSection` card hover behaviour

### Animations

GSAP + ScrollTrigger, same pattern as other sections:

- Section header (`overline`, heading, subline): `y:50→0, opacity:0→1`, staggered, `start: "top 65%"`, `once: true`
- Project card: `y:40→0, opacity:0→1`, `duration: 1`, `start: "top 75%"`, `once: true`
- Respect `prefers-reduced-motion`

---

## Part 2 — Case Study Page: `/work/lavapp`

### Route

New file: `src/app/work/lavapp/page.tsx`

No shared layout file needed — the page handles its own `<Navbar>` and scroll behaviour via the existing dynamic imports already used in `page.tsx`.

### Page structure

```
<Navbar />                    ← same component, reused
<main>
  <CaseStudyHero />           ← page-level hero (not a section)
  <CaseStudyBody />           ← five chapters
</main>
<Footer />
```

Both `CaseStudyHero` and `CaseStudyBody` can be defined inline in `work/lavapp/page.tsx` — no need for separate component files unless they grow large.

### Page hero

- Back link: `"← Work"` routes to `/#work` — mono, small, `var(--text-tertiary)`
- Project label: `"Case Study — SaaS"` — overline style
- Title: `"LavApp"` — large editorial heading, `clamp(4rem, 8vw, 7rem)`
- Subtitle: italic accent — `"From zero to production"` 
- Meta row: `Next.js 15 · Supabase · Paddle · Claude AI · WhatsApp · Resend` as mono chips
- Live link: pulsing orange dot + `"lavapp.center"` opens `https://lavapp.center` in new tab

### Five chapters

Each chapter uses the same two-column layout from the brainstorm mockup:

```
[chapter-num + dot + gradient line] [chapter content]
```

Chapters are separated by `border-bottom: 1px solid var(--border)`. Last chapter has no border.

#### Chapter 01 — The Problem

- Title: `"Car washes running on paper and phone calls"`
- Two paragraphs: the whiteboard-queue problem in Costa Rica; the opportunity.
- Pills: `SaaS`, `Queue Management`, `B2B`, `Costa Rica`

#### Chapter 02 — Architecture

- Title: `"Multi-tenant from day one"`
- One paragraph: Supabase RLS as the tenant isolation mechanism.
- Architecture node diagram (flex rows with `→` arrows):
  - Row 1: `Next.js 15 (App Router)` → `Supabase (PostgreSQL + RLS)` → `Paddle (Billing)`
  - Row 2: `Anthropic (Claude AI)` → `Resend (Email)` → `WhatsApp (Notifications)`
- Stack pills: `Next.js 15`, `Supabase`, `TypeScript`, `Tailwind CSS`, `Framer Motion`, `Vitest`

#### Chapter 03 — Key Features

- Title: `"Every tool a car wash needs, nothing it doesn't"`
- One paragraph on the core queue loop.
- 2×2 feature card grid:
  - **Queue** — Kanban drag-and-drop (DnD Kit). Stages: Received → Washing → Drying → Ready.
  - **WhatsApp** — Automatic notification per stage change. Live status page for the customer.
  - **CRM** — Client and vehicle history per business. Repeat customer profiles.
  - **Analytics** — Revenue, volume, service breakdown. Built with Recharts + server aggregations.

#### Chapter 04 — Tech Deep-Dives

- Title: `"Four decisions worth talking about"`
- Four single-column cards, label column + description column:
  - **Paddle Billing** — MOR model over Stripe for VAT/tax compliance. Webhook-driven subscription lifecycle synced to Supabase.
  - **Supabase RLS** — Tenant isolation enforced at the Postgres level. No app-layer filtering.
  - **Claude SDK** — ETA suggestions and queue-optimization hints. Structured output from live queue state + historical service times.
  - **React Email + Resend** — Transactional emails as React components, rendered server-side. Templates branded per business.

#### Chapter 05 — Outcome

- Title: `"Shipped, live, and in use"`
- One paragraph — full stack solo-built.
- 3-column stat grid:
  - `100%` — Solo-built: frontend, backend, payments, AI
  - `6+` — Integrated systems
  - `Live` — Production SaaS with subscription plans
- Live link button: pulsing dot + `"lavapp.center — live"` → `https://lavapp.center`

### Animations

Same GSAP + ScrollTrigger pattern. Each chapter animates in as it enters the viewport. Respect `prefers-reduced-motion`.

---

## Navbar Update

Add a `"Work"` link pointing to `/#work` in the existing `Navbar.tsx` nav list.

---

## Styling Notes

- All spacing: existing CSS custom property scale
- All colors: existing CSS variables — no new tokens needed
- Both dark and light themes work automatically
- `border-radius: 2px` for all cards (consistent with `ExpertiseSection`)
- Feature cards: `border: 1px solid var(--border)`, `background: var(--bg-secondary)`
- Architecture nodes: same card style, accent variant for primary nodes
- No new dependencies

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/components/sections/WorkSection.tsx` | Create — homepage teaser |
| `src/app/work/lavapp/page.tsx` | Create — full case study page |
| `src/app/page.tsx` | Import and mount `WorkSection` between Expertise and Reviews |
| `src/components/ui/Navbar.tsx` | Add `"Work"` link → `/#work` |
| `src/components/sections/ReviewsSection.tsx` | Update section number `"04"` → `"05"` |
| `src/components/sections/ContactSection.tsx` | Update section number `"05"` → `"06"` |
