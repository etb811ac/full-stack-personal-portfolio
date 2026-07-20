# LavApp Case Study — System Design Chapter

**Date:** 2026-07-20
**Status:** Approved

## Goal

Add a dedicated "System Design" chapter to the LavApp case study (`/work/lavapp`) showing how the app is structured end to end. Chapter 02 "Architecture" stays as the high-level overview; the new chapter goes deeper with a layered system diagram and annotated layer notes.

## Structure change

The case study grows from 5 to 6 chapters:

| Num | Label | Change |
|-----|-------|--------|
| 01 | The Problem | unchanged |
| 02 | Architecture | unchanged (keeps existing `ArchDiagram` node strip) |
| **03** | **System Design** | **new** |
| 04 | Key Features | renumbered (was 03) |
| 05 | Tech Deep-Dives | renumbered (was 04) |
| 06 | Outcome | renumbered (was 05) |

## New chapter content

**Label:** "System Design" · **Title:** "How the app is structured"

### 1. Intro paragraph

One short paragraph: the app is structured in layers — every request passes through middleware for auth/tenant context before touching the app layer, isolation is enforced in the database, and third-party state arrives via webhooks.

### 2. Layered diagram (`SystemDesignDiagram` component)

A vertical stack of 4 tiers in the site's existing visual language (mono labels, `var(--border)` boxes, `var(--accent)` highlights, `var(--bg-secondary)` fills):

1. **CLIENT** — Dashboard (staff Kanban) · Public status page (customers) · Admin
2. **EDGE** — Next.js middleware: session auth + tenant context on every request
3. **APP LAYER** — route groups `(auth)` `(dashboard)` `(admin)` + API domains: queue, payments, whatsapp, ai/eta, email, employees
4. **DATA + EXTERNAL** (side-by-side pair):
   - **DATA** — Supabase Postgres + RLS, 17 incremental migrations
   - **EXTERNAL** — Paddle (inbound webhooks ⇄), WhatsApp, Claude, Resend (outbound →)

Details:
- Thin vertical connector lines between tiers.
- An accent highlight sweeps tier-by-tier on a `setInterval` (same pattern as the existing `ArchDiagram`).
- Fully static under `prefers-reduced-motion: reduce`.
- Responsive: the Data/External side-by-side row stacks vertically ≤768px.

### 3. Layer notes

A compact annotated list below the diagram — one row per tier: mono label + one sentence stating the responsibility and key decision:

- **Client** — three surfaces, one codebase: staff dashboard, customer status page, platform admin.
- **Edge** — middleware resolves session and tenant before any page renders.
- **App layer** — route groups separate concerns; API routes are grouped by domain, not by verb.
- **Data** — tenant isolation lives in Postgres RLS policies, not application code.
- **External** — billing state is webhook-driven (never polled); notifications are fire-and-forget outbound.

## Implementation constraints

- Everything lives in `src/app/work/lavapp/LavAppCaseStudy.tsx`, following its existing conventions: data consts at top, small diagram component, CSS added to the inline `<style>` block, chapter appended to the `CHAPTERS` array (with renumbering).
- Content grounded in the actual LavApp repo (`lavapp_ JUST FOR REFERENCE/`) — no invented facts.
- No new dependencies. No changes to other pages.
- Chapter reveals use the existing `.cs-chapter-reveal` GSAP scroll-trigger pattern automatically (it applies per `.cs-chapter`).

## Out of scope

- Changes to chapter 02's existing content or diagram.
- Data-model/table diagrams, codebase-structure blocks (considered, not selected).
- Any modification to the LavApp product itself.
