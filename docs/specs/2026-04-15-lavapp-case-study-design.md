# LavApp Case Study — Design Spec

**Date:** 2026-04-15  
**Status:** Approved  

---

## Summary

Add a "Case Study" section (section 04) inline on the portfolio homepage, between the existing Expertise section and the Reviews section. The section tells the story of LavApp — a full-stack SaaS for car wash queue management — using a five-chapter editorial scroll format that matches the portfolio's existing numbered-section aesthetic.

---

## Decisions Made

| Question | Decision |
|---|---|
| Where does it live? | Inline section on homepage (between Expertise and Reviews) |
| Dedicated page? | No — single-page scroll only |
| Primary audience | Both recruiters and potential clients |
| Content structure | Narrative arc: problem → architecture → features → tech → outcome |
| Visual format | Editorial scroll — five numbered chapters, top to bottom |

---

## Section Placement

The homepage section order becomes:

```
01 — Hero
     Marquee
02 — Solver
03 — Expertise
04 — Case Study   ← new
05 — Reviews
06 — Contact
```

The section number (`04`) and all existing sections shift accordingly. The Navbar should gain a `#case-study` anchor link.

---

## Component: `CaseStudySection.tsx`

New file at `src/components/sections/CaseStudySection.tsx`.

### Layout

The `<section>` element gets `id="case-study"` so the navbar anchor `#case-study` works.

Follows the existing `section-wrapper` grid pattern used by all other sections:

```
[section-num-col] [section-divider-line] [section-content-col]
```

- `section-num-col`: displays `"04"` vertically in `var(--font-mono)`, color `var(--text-tertiary)`
- `section-divider-line`: 1px vertical line in `var(--border)`
- `section-content-col`: all content

### Section header

- Overline: `"04 — Case Study"` in `var(--font-mono)`, `var(--text-tertiary)`, uppercase
- Heading: `"FROM IDEA"` (display) + `"to production"` (italic accent, `var(--accent)`) — same `editorial-heading` / `display-word` / `accent-word` pattern used in Expertise
- Subline: `"A full-stack SaaS built from scratch — frontend, backend, payments, AI, and WhatsApp integrations. Here's how it came together."` in `var(--text-secondary)`

### Chapters

Five chapters, each using a two-column layout:

```
[chapter-num + dot + gradient line] [chapter content]
```

Chapter numbers and dots are `var(--accent)`. The gradient line fades from `var(--accent)` to transparent. Each chapter is separated by a `1px solid var(--border)` bottom border. The last chapter has no border.

#### Chapter 01 — The Problem

- Label: `"The Problem"`
- Title: `"Car washes running on paper and phone calls"`
- Body: Two paragraphs explaining the whiteboard-queue problem in Costa Rica and the opportunity.
- Pills: `SaaS`, `Queue Management`, `B2B`, `Costa Rica` — styled as mono-font pill tags with `var(--border)` border. The first two use accent color.

#### Chapter 02 — Architecture

- Label: `"Architecture"`
- Title: `"Multi-tenant from day one"`
- Body: One paragraph on Supabase Row Level Security as the tenant isolation mechanism.
- Architecture node diagram: horizontal flex row of tech nodes connected by `→` arrows, two rows:
  - Row 1: `Next.js 15 (App Router)` → `Supabase (PostgreSQL + RLS)` → `Paddle (Billing)`
  - Row 2: `Anthropic (Claude AI)` → `Resend (Email)` → `WhatsApp (Notifications)`
- Stack pills: `Next.js 15`, `Supabase`, `TypeScript`, `Tailwind CSS`, `Framer Motion`, `Vitest`

#### Chapter 03 — Key Features

- Label: `"Key Features"`
- Title: `"Every tool a car wash needs, nothing it doesn't"`
- Body: One paragraph on the core queue loop.
- 2×2 feature card grid:
  - **Queue** — Kanban drag-and-drop board (DnD Kit). Stages: Received → Washing → Drying → Ready.
  - **WhatsApp** — Automatic customer notifications on every stage change. Live status page for customers.
  - **CRM** — Client and vehicle history per business. Repeat customer profiles.
  - **Analytics** — Revenue, volume, and service breakdown charts built with Recharts.

#### Chapter 04 — Tech Deep-Dives

- Label: `"Tech Deep-Dives"`
- Title: `"Four decisions worth talking about"`
- Body: One intro paragraph.
- Four single-column "deep-dive" cards, each split into a label column and a description column:
  - **Paddle Billing** — Merchant of Record model chosen over Stripe for VAT/tax compliance. Webhook-driven subscription lifecycle synced to Supabase.
  - **Supabase RLS** — Every table enforces tenant isolation at the Postgres level via policies. No application-layer filtering needed.
  - **Claude SDK** — Powers ETA suggestions and queue-optimization hints. Structured output; context built from live queue state and historical service times.
  - **React Email + Resend** — Transactional emails as React components, rendered server-side. Templates branded per business.

#### Chapter 05 — Outcome

- Label: `"Outcome"`
- Title: `"Shipped, live, and in use"`
- Body: One paragraph — full stack built and maintained solo.
- 3-column outcome stat grid:
  - `100%` — Solo-built: frontend, backend, payments, AI
  - `6+` — Integrated systems (Supabase, Paddle, WhatsApp, Claude, Resend, DnD Kit)
  - `Live` — Production SaaS with real subscription plans
- Live link button: `lavapp.center — live` with a pulsing orange dot. Opens `https://lavapp.center` in a new tab. Styled like the existing `btn-ghost` but with accent border.

---

## Animations

Use GSAP + ScrollTrigger, matching the pattern in `ExpertiseSection.tsx`:

- Section header elements (`overline`, `h2`, `subline`): `fromTo y:50→0, opacity:0→1` staggered, triggered when section enters viewport at `top 65%`
- Each chapter: `fromTo y:40→0, opacity:0→1` staggered with `scrollTrigger` per chapter, `start: "top 80%"`, `once: true`
- Feature cards within a chapter: stagger with `amount: 0.4`
- Respect `prefers-reduced-motion`: skip all JS animation, elements visible immediately via CSS

---

## Navbar Update

Add `#case-study` to the existing navbar link list. The label should be `"Work"` to match common portfolio conventions.

---

## page.tsx Update

Import and mount `CaseStudySection` between `ExpertiseSection` and `ReviewsSection`.

---

## Styling Notes

- All spacing uses the existing CSS custom property scale (`--space-xs` through `--space-6xl`)
- All colors use existing CSS variables — `var(--text-primary)`, `var(--accent)`, `var(--border)`, etc.
- Both dark and light themes work automatically via the existing token system
- No new CSS custom properties needed
- `border-radius: 2px` for cards (matches `ExpertiseSection` card style)
- Feature cards: `border: 1px solid var(--border)`, `background: var(--bg-secondary)`
- Architecture nodes: same card style with accent variant for primary nodes
- Outcome stats: centered text, large mono number in `var(--accent)`

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/components/sections/CaseStudySection.tsx` | Create |
| `src/app/page.tsx` | Import and mount `CaseStudySection` between Expertise and Reviews |
| `src/components/ui/Navbar.tsx` | Add `#case-study` anchor with label `"Work"` |
| `src/components/sections/ReviewsSection.tsx` | Update section number `"04"` → `"05"` |
| `src/components/sections/ContactSection.tsx` | Update section number `"05"` → `"06"` |

---

## Out of Scope

- No dedicated `/work/lavapp` page
- No screenshots embedded (text + diagrams only)
- No dark/light theme toggle changes
- No new dependencies
