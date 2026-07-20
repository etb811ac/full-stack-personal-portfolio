# LavApp System Design Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "System Design" chapter (03) to the LavApp case study with a 4-tier layered diagram and annotated layer notes, per `docs/specs/2026-07-20-lavapp-system-design-chapter-design.md`.

**Architecture:** Everything lives in `src/app/work/lavapp/LavAppCaseStudy.tsx`, following its existing conventions — data consts at the top, a small `SystemDesignDiagram` component next to `ArchDiagram`, CSS in the inline `<style>` block, and a new entry in the `CHAPTERS` array (with renumbering of later chapters).

**Tech Stack:** Next.js 16 / React 19 client component, inline CSS with the site's design tokens (`--border`, `--accent`, `--bg-secondary`, `--font-mono`), `setInterval` sweep animation.

## Global Constraints

- No new dependencies. No changes to any file other than `src/app/work/lavapp/LavAppCaseStudy.tsx`.
- Diagram must be fully static under `prefers-reduced-motion: reduce` (guard the `setInterval` with a `matchMedia` check, same as `loadGSAP` does).
- Responsive: the Data/External side-by-side pair stacks vertically at `max-width: 768px` (add to the existing responsive media query block).
- Content facts come from the spec (grounded in the real LavApp repo): route groups `(auth)` `(dashboard)` `(admin)`, API domains queue/payments/whatsapp/ai/email/employees, Supabase Postgres + RLS with 17 migrations, Paddle inbound webhooks, WhatsApp/Claude/Resend outbound.
- This repo has no unit-test framework; verification is `npm run lint`, `npm run build`, and a visual check of `/work/lavapp` (do not add a test framework).

---

### Task 1: SystemDesignDiagram component, data, and styles

**Files:**
- Modify: `src/app/work/lavapp/LavAppCaseStudy.tsx` (data consts after `ARCH_NODES` block ~line 73; component after `ArchDiagram` ~line 110; CSS inside the `<style>` block after the `/* ── Architecture diagram ── */` rules ~line 405)

**Interfaces:**
- Produces: `SystemDesignDiagram` React component (no props) and `SYS_NOTES` const (`{ label: string; note: string }[]`), both consumed by Task 2's chapter entry.

- [ ] **Step 1: Add the data consts** — insert after the `ARCH_NODES` array (before `function ArchDiagram()`):

```tsx
// ── System design layered diagram ─────────────────────────────────────────────

const SYS_TIERS = [
  {
    key: 'client',
    label: 'Client',
    items: [
      { name: 'Dashboard', sub: 'staff Kanban' },
      { name: 'Status page', sub: 'customers' },
      { name: 'Admin', sub: 'platform' },
    ],
  },
  {
    key: 'edge',
    label: 'Edge',
    items: [
      { name: 'Next.js middleware', sub: 'session auth + tenant context on every request' },
    ],
  },
  {
    key: 'app',
    label: 'App layer',
    items: [
      { name: '(auth) · (dashboard) · (admin)', sub: 'route groups' },
      { name: 'queue · payments · whatsapp · ai · email · employees', sub: 'API domains' },
    ],
  },
  {
    key: 'data',
    label: 'Data',
    items: [
      { name: 'Supabase Postgres + RLS', sub: '17 incremental migrations' },
    ],
  },
  {
    key: 'external',
    label: 'External',
    items: [
      { name: 'Paddle', sub: '⇄ webhooks' },
      { name: 'WhatsApp', sub: '→ outbound' },
      { name: 'Claude', sub: '→ outbound' },
      { name: 'Resend', sub: '→ outbound' },
    ],
  },
];

const SYS_NOTES = [
  { label: 'Client', note: 'Three surfaces, one codebase — staff dashboard, customer status page, platform admin.' },
  { label: 'Edge', note: 'Middleware resolves the session and tenant before any page renders.' },
  { label: 'App layer', note: 'Route groups separate concerns; API routes are grouped by domain, not by verb.' },
  { label: 'Data', note: 'Tenant isolation lives in Postgres RLS policies, not application code.' },
  { label: 'External', note: 'Billing state is webhook-driven, never polled; notifications are fire-and-forget outbound.' },
];
```

- [ ] **Step 2: Add the component** — insert after `function ArchDiagram() { ... }` (after its closing brace):

```tsx
function SystemDesignDiagram() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActiveIdx(n => (n + 1) % SYS_TIERS.length), 900);
    return () => clearInterval(id);
  }, []);

  const renderTier = (idx: number) => {
    const tier = SYS_TIERS[idx];
    return (
      <div className={`sd-tier${activeIdx === idx ? ' active' : ''}`}>
        <span className="sd-tier-label">{tier.label}</span>
        <div className="sd-tier-items">
          {tier.items.map((it) => (
            <div key={it.name} className="sd-item">
              {it.name}
              <span>{it.sub}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="sd-diagram">
      {renderTier(0)}
      <div className="sd-connector" aria-hidden="true" />
      {renderTier(1)}
      <div className="sd-connector" aria-hidden="true" />
      {renderTier(2)}
      <div className="sd-connector" aria-hidden="true" />
      <div className="sd-split">
        {renderTier(3)}
        {renderTier(4)}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add the CSS** — insert inside the `<style>` block, right after the `.arch-arrow.active { color: var(--accent); }` rule:

```css
        /* ── System design diagram ── */
        .sd-diagram {
          margin-top: var(--space-xl);
          display: flex;
          flex-direction: column;
        }
        .sd-tier {
          border: 1px solid var(--border);
          border-radius: 2px;
          background: var(--bg-secondary);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .sd-tier.active {
          border-color: color-mix(in srgb, var(--accent) 55%, transparent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 12%, transparent);
        }
        .sd-tier-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-tertiary);
          transition: color 0.3s ease;
        }
        .sd-tier.active .sd-tier-label { color: var(--accent); }
        .sd-tier-items {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .sd-item {
          padding: 6px 10px;
          border: 1px solid var(--border);
          border-radius: 2px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-secondary);
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sd-item span { font-size: 9px; color: var(--text-tertiary); }
        .sd-connector {
          width: 1px;
          height: 14px;
          margin-left: 28px;
          background: linear-gradient(to bottom, var(--accent), color-mix(in srgb, var(--accent) 25%, transparent));
        }
        .sd-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        /* ── Layer notes ── */
        .sd-notes {
          margin-top: var(--space-xl);
          display: flex;
          flex-direction: column;
        }
        .sd-note {
          display: grid;
          grid-template-columns: 92px 1fr;
          gap: var(--space-md);
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
          align-items: baseline;
        }
        .sd-note:last-child { border-bottom: none; }
        .sd-note-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--accent);
        }
        .sd-note-text {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          line-height: 1.6;
        }
```

- [ ] **Step 4: Add responsive rule** — inside the existing `@media (max-width: 768px)` block (after `.outcome-grid { grid-template-columns: 1fr; }`):

```css
          .sd-split { grid-template-columns: 1fr; }
          .sd-note { grid-template-columns: 1fr; gap: 2px; }
```

- [ ] **Step 5: Lint** — Run: `npm run lint` — Expected: passes (unused-var warnings for `SYS_NOTES`/`SystemDesignDiagram` are acceptable until Task 2 wires them; if eslint errors on unused vars, proceed to Task 2 before committing and commit both tasks together).

- [ ] **Step 6: Commit** (if lint passes cleanly):

```bash
git add src/app/work/lavapp/LavAppCaseStudy.tsx
git commit -m "feat(lavapp): add SystemDesignDiagram component and styles"
```

---

### Task 2: Insert chapter 03 and renumber

**Files:**
- Modify: `src/app/work/lavapp/LavAppCaseStudy.tsx` (the `CHAPTERS` array)

**Interfaces:**
- Consumes: `SystemDesignDiagram` component and `SYS_NOTES` const from Task 1.

- [ ] **Step 1: Insert the new chapter object** into `CHAPTERS` between the `num: '02'` (Architecture) and the Key Features entries:

```tsx
  {
    num: '03',
    label: 'System Design',
    title: 'How the app is structured',
    content: (
      <>
        <p>
          The app is structured in layers. Every request passes through Next.js middleware — which
          resolves the session and tenant — before it reaches a page or API route. Tenant isolation
          is enforced in the database, and third-party state arrives via webhooks rather than polling.
        </p>
        <SystemDesignDiagram />
        <div className="sd-notes">
          {SYS_NOTES.map((n) => (
            <div key={n.label} className="sd-note">
              <span className="sd-note-label">{n.label}</span>
              <span className="sd-note-text">{n.note}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
```

- [ ] **Step 2: Renumber the later chapters** — change `num: '03'` (Key Features) → `'04'`, `num: '04'` (Tech Deep-Dives) → `'05'`, `num: '05'` (Outcome) → `'06'`. Touch only the `num` fields of those three existing entries.

- [ ] **Step 3: Lint** — Run: `npm run lint` — Expected: no errors.

- [ ] **Step 4: Build** — Run: `npm run build` — Expected: compiles successfully, `/work/lavapp` in the route list.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/lavapp/LavAppCaseStudy.tsx
git commit -m "feat(lavapp): add System Design chapter with layered diagram and layer notes"
```

---

### Task 3: Visual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server** — Run: `npm run dev` (background).

- [ ] **Step 2: Screenshot `/work/lavapp`** with the Playwright MCP browser at desktop width (1280px): navigate to `http://localhost:3000/work/lavapp`, scroll to the "System Design" chapter, screenshot. Expected: chapter 03 between Architecture and Key Features; 4-tier diagram with connectors; Data/External side by side; sweep highlight cycling; layer notes list below.

- [ ] **Step 3: Screenshot at mobile width** (390px). Expected: Data/External stacked vertically; notes stack label-over-text; no horizontal overflow.

- [ ] **Step 4: Check chapter numbering** — confirm chapters read 01–06 in order and the Outcome chapter is `06`.

- [ ] **Step 5: Stop the dev server.**
