# Portfolio Design Overhaul Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio's visual identity to Editorial Dark × Structured Asymmetry — Bebas Neue + Instrument Serif typography, electric orange accent (#ff6b35), magazine paper light mode, ghost section numbers with column dividers.

**Architecture:** Token-first approach — fix globals.css and layout.tsx first so all subsequent component changes inherit the new design system automatically. Then work section by section top-to-bottom. Each task is independently committable.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, `next/font/google`, Three.js / R3F, GSAP

**Spec:** `docs/superpowers/specs/2026-03-16-portfolio-design-overhaul.md`

---

## Chunk 1: Foundation — Tokens, Fonts, Top-bar

### Task 1: Font Loading via next/font/google

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (remove @import only)

- [ ] **Step 1: Read current layout.tsx and globals.css**

  Verify current state before editing. Confirm `globals.css` line 1 has the Google Fonts `@import` to remove.

- [ ] **Step 2: Update layout.tsx — add next/font/google imports and apply variables**

  Replace entire `src/app/layout.tsx` with:

  ```tsx
  import type { Metadata } from 'next';
  import { Bebas_Neue, Instrument_Serif, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
  import './globals.css';
  import { ThemeProvider } from '@/context/ThemeProvider';

  const bebasNeue = Bebas_Neue({
    weight: ['400'],
    variable: '--font-display',
    subsets: ['latin'],
    display: 'swap',
  });

  const instrumentSerif = Instrument_Serif({
    weight: ['400'],
    style: ['italic'],
    variable: '--font-accent',
    subsets: ['latin'],
    display: 'swap',
  });

  const dmSans = DM_Sans({
    weight: ['300', '400', '600'],
    variable: '--font-body',
    subsets: ['latin'],
    display: 'swap',
  });

  const ibmPlexMono = IBM_Plex_Mono({
    weight: ['400', '500'],
    variable: '--font-mono',
    subsets: ['latin'],
    display: 'swap',
  });

  export const metadata: Metadata = {
    title: 'Esteban Acuña — Full-Stack Developer & Maker',
    description: 'Full-stack developer specializing in Next.js, React, Three.js, Python, and AI integration. Building digital experiences where code meets craft.',
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html
        lang="en"
        data-theme="dark"
        suppressHydrationWarning
        className={`${bebasNeue.variable} ${instrumentSerif.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
      >
        <body>
          <div className="top-accent-bar" />
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }
  ```

- [ ] **Step 3: Remove Google Fonts @import from globals.css**

  Delete the first line of `src/app/globals.css`. It is exactly:
  ```
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  ```
  After deletion, `@import "tailwindcss";` becomes line 1. Do not remove that line.

- [ ] **Step 4: Verify dev server starts without errors**

  Run: `npm run dev`
  Expected: Compiles successfully, no font-related errors in terminal.

- [ ] **Step 5: Commit**

  ```bash
  git add src/app/layout.tsx src/app/globals.css
  git commit -m "feat: load fonts via next/font/google, add top-bar div"
  ```

---

### Task 2: Color Tokens + Font Variables in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the :root block — remove old font variables, keep spacing + transitions**

  Replace the existing `:root` block (find it by the `/* Spacing scale */` comment) with:

  ```css
  :root {
    /* Spacing scale (8px base) */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;
    --space-3xl: 64px;
    --space-4xl: 96px;
    --space-5xl: 128px;
    --space-6xl: 192px;

    /* Transitions */
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
    --duration-fast: 200ms;
    --duration-normal: 400ms;
    --duration-slow: 800ms;
    --duration-glacial: 1200ms;
  }
  ```

  **Important:** Do NOT redeclare `--font-display`, `--font-body`, `--font-mono`, or `--font-accent` inside `:root`. These are injected by `next/font/google` as CSS custom properties on the `<html>` element via the `className` prop in `layout.tsx`. Redeclaring them as `var(--font-display)` creates a circular self-reference that breaks the cascade. Simply remove the old hardcoded font variable lines (`--font-display: 'Space Grotesk'...` etc.) — the new values will be available automatically from `layout.tsx`.

- [ ] **Step 2: Replace the dark theme block**

  Replace the `[data-theme="dark"]` block with:

  ```css
  [data-theme="dark"] {
    --bg-primary: #0d0d0d;
    --bg-secondary: #111111;
    --bg-tertiary: #1a1a1a;
    --bg-elevated: #1f1f1f;
    --bg-hover: #252525;

    --text-primary: #f5f5f5;
    --text-secondary: #888888;
    --text-tertiary: #555555;
    --text-inverse: #0d0d0d;

    --accent: #ff6b35;
    --accent-dim: #cc5528;
    --accent-glow: rgba(255, 107, 53, 0.12);

    --border: #1f1f1f;
    --border-subtle: #161616;
    --border-accent: rgba(255, 107, 53, 0.3);

    --gradient-hero: linear-gradient(135deg, #0d0d0d 0%, #111118 50%, #0d0d0d 100%);
    --gradient-card: linear-gradient(145deg, #1a1a1a 0%, #111111 100%);

    --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 48px rgba(0,0,0,0.5);
    --shadow-glow: 0 0 40px rgba(255, 107, 53, 0.08);

    --nav-bg: rgba(13, 13, 13, 0.88);
  }
  ```

- [ ] **Step 3: Replace the light theme block**

  Replace the `[data-theme="light"]` block with:

  ```css
  [data-theme="light"] {
    --bg-primary: #faf6ef;
    --bg-secondary: #f0e8dc;
    --bg-tertiary: #e8ddd0;
    --bg-elevated: #ede4d8;
    --bg-hover: #e4d9cc;

    --text-primary: #1a1610;
    --text-secondary: #7a6e62;
    --text-tertiary: #b0a496;
    --text-inverse: #faf6ef;

    --accent: #ff6b35;
    --accent-dim: #e55a25;
    --accent-glow: rgba(255, 107, 53, 0.10);

    --border: #ddd4c4;
    --border-subtle: #e8ddd0;
    --border-accent: rgba(255, 107, 53, 0.4);

    --gradient-hero: linear-gradient(135deg, #faf6ef 0%, #f5eedd 50%, #faf6ef 100%);
    --gradient-card: linear-gradient(145deg, #f0e8dc 0%, #faf6ef 100%);

    --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.10);
    --shadow-lg: 0 8px 48px rgba(0,0,0,0.14);
    --shadow-glow: 0 0 40px rgba(255, 107, 53, 0.06);

    --nav-bg: rgba(250, 246, 239, 0.90);
  }
  ```

- [ ] **Step 4: Add top-bar, font utility classes, card base, and button base styles**

  After the existing `.grain-overlay` block in `globals.css`, add:

  ```css
  /* ============================================
     TOP ACCENT BAR
     ============================================ */
  .top-accent-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent);
    z-index: 10000;
  }

  /* ============================================
     FONT UTILITY CLASSES
     ============================================ */
  .font-display {
    font-family: var(--font-display);
  }

  .font-accent {
    font-family: var(--font-accent);
    font-style: italic;
  }

  .font-body {
    font-family: var(--font-body);
  }

  .font-mono {
    font-family: var(--font-mono);
  }

  /* ============================================
     SECTION LAYOUT (ghost number + divider)
     ============================================ */
  .section-wrapper {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-xl);
    width: 100%;
  }

  .section-num-col {
    width: 72px;
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    padding-top: var(--space-xl);
  }

  .section-num {
    font-family: var(--font-display);
    font-size: clamp(4rem, 8vw, 8rem);
    line-height: 1;
    color: var(--text-primary);
    opacity: 0.05;
    user-select: none;
  }

  .section-divider-line {
    width: 1px;
    background: var(--border);
    align-self: stretch;
    flex-shrink: 0;
    margin-right: var(--space-2xl);
  }

  .section-content-col {
    flex: 1;
    min-width: 0;
    padding: var(--space-6xl) 0;
  }

  @media (max-width: 768px) {
    .section-num-col,
    .section-divider-line {
      display: none;
    }
    .section-wrapper {
      padding: 0 var(--space-lg);
    }
    .section-content-col {
      padding: var(--space-4xl) 0;
    }
  }

  /* ============================================
     SECTION OVERLINE LABEL
     ============================================ */
  .section-overline {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: var(--space-lg);
    display: block;
  }

  /* ============================================
     EDITORIAL HEADING (Bebas + Instrument Serif)
     ============================================ */
  .editorial-heading {
    line-height: 0.9;
    letter-spacing: 0.02em;
    margin-bottom: var(--space-2xl);
  }

  .editorial-heading .display-word {
    font-family: var(--font-display);
    color: var(--text-primary);
    display: block;
  }

  .editorial-heading .accent-word {
    font-family: var(--font-accent);
    font-style: italic;
    color: var(--accent);
    display: block;
  }

  /* ============================================
     BUTTONS
     ============================================ */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--accent);
    color: var(--text-inverse);
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 14px 28px;
    border: none;
    border-radius: 0;
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out-expo);
  }

  .btn-primary:hover {
    background: var(--accent-dim);
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: transparent;
    color: var(--text-secondary);
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 14px 28px;
    border: 1px solid var(--border);
    border-radius: 0;
    cursor: pointer;
    transition: border-color var(--duration-fast) var(--ease-out-expo),
                color var(--duration-fast) var(--ease-out-expo);
  }

  .btn-ghost:hover {
    border-color: rgba(255, 107, 53, 0.5);
    color: var(--text-primary);
  }

  /* ============================================
     CARD BASE (sharp editorial)
     ============================================ */
  .card-editorial {
    border: 1px solid var(--border);
    border-radius: 0;
    background: var(--bg-secondary);
    transition: box-shadow var(--duration-fast) var(--ease-out-expo),
                background var(--duration-fast) var(--ease-out-expo);
  }

  .card-editorial:hover {
    box-shadow: inset 3px 0 0 var(--accent);
    background: color-mix(in srgb, var(--bg-secondary) 88%, var(--accent) 12%);
  }
  ```

- [ ] **Step 5: Update marquee styles**

  In `globals.css`, replace the `.marquee-content span` block:

  ```css
  .marquee-content span {
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .marquee-content span.sep {
    color: var(--accent);
    opacity: 0.6;
  }
  ```

- [ ] **Step 6: Verify in browser — check dark and light mode**

  Run: `npm run dev`, open `http://localhost:3000`
  Expected:
  - Orange top-bar line visible at top of page
  - Body text is DM Sans (not Inter/Space Grotesk)
  - Dark background is `#0d0d0d` (slightly different from before)
  - Toggle to light mode: warm cream background, orange accent preserved

- [ ] **Step 7: Commit**

  ```bash
  git add src/app/globals.css
  git commit -m "feat: overhaul design tokens — orange accent, magazine paper light mode, editorial utilities"
  ```

---

## Chunk 2: Navbar + Hero Section

### Task 3: Navbar Redesign

**Files:**
- Modify: `src/components/ui/Navbar.tsx`

- [ ] **Step 1: Read current Navbar.tsx**

  Read `src/components/ui/Navbar.tsx` in full before editing.

- [ ] **Step 2: Update logo treatment**

  Find the logo JSX (currently renders `esteban.dev` or similar). Replace with:

  ```tsx
  <a href="#hero" className="navbar-logo" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none' }}>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
      ESTEBAN
    </span>
    <em style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--accent)' }}>
      Acuña
    </em>
  </a>
  ```

- [ ] **Step 3: Update nav link hover styles**

  Find the nav link styles (inline styles or className). Update each nav `<a>` to use DM Sans and orange underline on hover:

  ```tsx
  // Nav link style object or className additions:
  style={{
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    position: 'relative',
  }}
  ```

  Add a CSS rule to `globals.css` for the nav link underline (after the `.btn-ghost` block):

  ```css
  /* ============================================
     NAVBAR NAV LINKS
     ============================================ */
  .nav-link {
    position: relative;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out-expo);
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--accent);
    transition: width var(--duration-normal) var(--ease-out-expo);
  }

  .nav-link:hover {
    color: var(--text-primary);
  }

  .nav-link:hover::after {
    width: 100%;
  }
  ```

  Apply `className="nav-link"` to each desktop nav link `<a>`.

  **Important:** The current Navbar renders each link's underline as a child `<span>` element (with Tailwind classes like `group-hover:w-full`). When applying `className="nav-link"`, also remove that inner `<span>` underline element from each desktop nav link — otherwise both the old white underline (from the `<span>`) and the new orange underline (from `::after`) will appear simultaneously. The `::after` pseudo-element from `.nav-link` replaces the `<span>` entirely.

- [ ] **Step 3b: Re-skin mobile menu links**

  Find the mobile menu `<a>` links (rendered when `mobileOpen` is true). Apply the same font treatment as desktop links but without the `::after` underline — instead use a left border on hover:

  ```tsx
  // Mobile nav link style:
  style={{
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
    display: 'block',
    transition: 'color var(--duration-fast)',
  }}
  // onMouseEnter: color → var(--text-primary)
  // onMouseLeave: color → var(--text-secondary)
  ```

- [ ] **Step 4: Verify navbar renders correctly**

  Run: `npm run dev`
  Expected:
  - Logo shows `ESTEBAN` in Bebas Neue + *Acuña* in italic orange, no `.dev` suffix
  - Nav links are DM Sans uppercase, orange underline grows on hover

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/ui/Navbar.tsx src/app/globals.css
  git commit -m "feat: navbar — editorial logo, orange underline links"
  ```

---

### Task 4: Hero Section Redesign

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Read current HeroSection.tsx**

  Read `src/components/sections/HeroSection.tsx` in full before editing.

- [ ] **Step 2: Add ghost column layout wrapper**

  Wrap the section's inner content with the section-wrapper layout. The section should use `id="hero"` (keep existing). Add the ghost `01` column structure:

  ```tsx
  <section id="hero" style={{ background: 'var(--gradient-hero)', minHeight: '100vh', paddingTop: '80px' }}>
    <div className="section-wrapper">
      <div className="section-num-col">
        <span className="section-num">01</span>
      </div>
      <div className="section-divider-line" />
      <div className="section-content-col">
        {/* existing two-column hero content goes here */}
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Update the status badge**

  Find the "Available for projects" badge. Replace its styles:

  ```tsx
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-accent)',
    borderRadius: '0',
    padding: '6px 14px',
    marginBottom: 'var(--space-lg)',
  }}>
    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)' }}>
      Available for projects
    </span>
  </div>
  ```

- [ ] **Step 4: Update the name treatment**

  Find the hero name heading. Replace with Bebas Neue + Instrument Serif italic:

  ```tsx
  <h1 style={{ lineHeight: '0.9', marginBottom: 'var(--space-lg)' }}>
    <span style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(3.5rem, 8vw, 7rem)',
      letterSpacing: '0.02em',
      color: 'var(--text-primary)',
      display: 'block',
    }}>
      ESTEBAN
    </span>
    <em style={{
      fontFamily: 'var(--font-accent)',
      fontStyle: 'italic',
      fontSize: 'clamp(3rem, 7vw, 6.2rem)',
      color: 'var(--accent)',
      display: 'block',
    }}>
      Acuña
    </em>
  </h1>
  ```

- [ ] **Step 5: Update the tagline**

  Find the "Full-Stack Developer" tagline. Replace styles:

  ```tsx
  <p style={{
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    letterSpacing: '2px',
    color: 'var(--text-tertiary)',
    marginBottom: 'var(--space-xl)',
  }}>
    // Full-Stack Developer
  </p>
  ```

- [ ] **Step 6: Update CTA buttons**

  Find the two CTA buttons. Replace with:

  ```tsx
  <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-2xl)' }}>
    <a href="#contact" className="btn-primary">Get in Touch</a>
    <a href="#expertise" className="btn-ghost">View Expertise</a>
  </div>
  ```

- [ ] **Step 7: Verify hero section**

  Run: `npm run dev`
  Expected:
  - Ghost `01` visible at far left (very faint)
  - `ESTEBAN` in tall condensed Bebas Neue
  - *Acuña* in italic orange Instrument Serif below
  - Orange status badge
  - Sharp-edge buttons (primary orange, ghost)

- [ ] **Step 8: Commit**

  ```bash
  git add src/components/sections/HeroSection.tsx
  git commit -m "feat: hero section — editorial layout, orange badge, Bebas name treatment"
  ```

---

### Task 5: Update Three.js Material Colors

**Files:**
- Modify: `src/components/three/HeroScene.tsx`
- Modify: `src/components/three/SolverScene.tsx`

- [ ] **Step 1: Read both Three.js files**

  Read `src/components/three/HeroScene.tsx` and `src/components/three/SolverScene.tsx` in full.

- [ ] **Step 2: Update HeroScene material colors**

  Apply these exact replacements in `HeroScene.tsx`. For each, use find-and-replace on the exact string:
  - `#c8ff00` → `#ff6b35`
  - `#a3cc00` → `#cc5528`
  - `#c8ff` (if present as partial hex) → `#ff6b35`
  - Any `color="lime"` or `color="rgb(200,255,0)"` → `color="#ff6b35"`
  - Any `emissive` prop that was lime-colored → `#cc5528`
  - Any `color="#666666"` on particles → leave unchanged (neutral grey particles are correct)
  - Any other color not matching the above → leave unchanged

- [ ] **Step 3: Update SolverScene material colors**

  Apply these exact replacements in `SolverScene.tsx`:
  - `#c8ff00` → `#ff6b35`
  - `#a3cc00` → `#cc5528`
  - Any `emissive` or `color` prop using lime/green glow → `#ff6b35`
  - Any PCB-green color (e.g. `#00ff88`, `#22c55e`, `#00b366`) → `#ff8c5a` (orange-light; apply to all such occurrences consistently — do not leave some green and change others)
  - Any other color not matching the above → leave unchanged

- [ ] **Step 4: Verify 3D scenes render with orange tones**

  Run: `npm run dev`
  Expected: Hero 3D scene shows orange/amber tones instead of lime green. Solver scene tabs show orange glow on active state.

- [ ] **Step 5: Run TypeScript check**

  Run: `npx tsc --noEmit`
  Expected: No errors. Three.js files are the most likely source of type issues — fix any that appear before committing.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/three/HeroScene.tsx src/components/three/SolverScene.tsx
  git commit -m "feat: 3D scenes — update material colors lime → orange/amber"
  ```

---

## Chunk 3: Remaining Sections

### Task 6: Problem Solver Section

**Files:**
- Modify: `src/components/sections/SolverSection.tsx`

- [ ] **Step 1: Read current SolverSection.tsx**

  Read `src/components/sections/SolverSection.tsx` in full.

- [ ] **Step 2: Wrap in section-wrapper layout with ghost 02**

  Wrap the section content in the same pattern as Hero:

  ```tsx
  <section id="about" style={{ background: 'var(--bg-primary)' }}>
    <div className="section-wrapper">
      <div className="section-num-col">
        <span className="section-num">02</span>
      </div>
      <div className="section-divider-line" />
      <div className="section-content-col">
        {/* existing content */}
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Update the section heading**

  Find the "I'm a problem solver by nature" heading. Replace with editorial treatment:

  ```tsx
  <h2 className="editorial-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
    <span className="display-word">I'M A PROBLEM</span>
    <em className="accent-word" style={{ fontSize: '0.85em' }}>solver</em>
    <span className="display-word">BY NATURE</span>
  </h2>
  ```

- [ ] **Step 4: Update the section overline label**

  Find the section label (e.g., "Section 02" or similar). Replace with:

  ```tsx
  <span className="section-overline">02 — About</span>
  ```

- [ ] **Step 5: Update tab buttons styling**

  Find the 5-tab switcher buttons. Update the active/inactive state styles:

  ```tsx
  // Active tab style:
  style={{
    background: 'var(--accent)',
    color: 'var(--text-inverse)',
    border: '1px solid var(--accent)',
    borderRadius: '0',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '1px',
    padding: '8px 16px',
    cursor: 'pointer',
  }}

  // Inactive tab style:
  style={{
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '0',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '1px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'border-color var(--duration-fast), color var(--duration-fast)',
  }}
  ```

- [ ] **Step 6: Update trait badges**

  Find the trait tag/badge elements. Replace pill-shape styles with sharp rectangles:

  ```tsx
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
      border: '1px solid var(--border)',
      borderRadius: '0',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '1px',
      color: 'var(--text-secondary)',
      background: 'transparent',
      transition: 'border-color var(--duration-fast), color var(--duration-fast)',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--accent)';
      e.currentTarget.style.color = 'var(--accent)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.color = 'var(--text-secondary)';
    }}
  >
    {trait}
  </span>
  ```

- [ ] **Step 7: Verify section**

  Run: `npm run dev`, scroll to problem solver section.
  Expected: Ghost `02`, editorial heading with italic orange *solver*, sharp tab buttons, rectangular trait badges.

- [ ] **Step 8: Commit**

  ```bash
  git add src/components/sections/SolverSection.tsx
  git commit -m "feat: solver section — ghost column, editorial heading, sharp tab/badge styles"
  ```

---

### Task 7: Expertise / Tech Stack Section

**Files:**
- Modify: `src/components/sections/ExpertiseSection.tsx`

- [ ] **Step 1: Read current ExpertiseSection.tsx**

  Read `src/components/sections/ExpertiseSection.tsx` in full.

- [ ] **Step 2: Add section-wrapper with ghost 03**

  Wrap content:

  ```tsx
  <section id="expertise" style={{ background: 'var(--bg-secondary)' }}>
    <div className="section-wrapper">
      <div className="section-num-col">
        <span className="section-num">03</span>
      </div>
      <div className="section-divider-line" />
      <div className="section-content-col">
        {/* existing content */}
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Update section overline and heading**

  ```tsx
  <span className="section-overline">03 — Expertise</span>
  <h2 className="editorial-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
    <span className="display-word">TOOLS</span>
    <em className="accent-word" style={{ fontSize: '0.85em' }}>of the trade</em>
  </h2>
  ```

- [ ] **Step 4: Update category headers**

  Find the category label text (e.g., "Frontend & Creative"). Apply Bebas Neue:

  ```tsx
  style={{
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--space-md)',
  }}
  ```

- [ ] **Step 5: Update tech cards to use card-editorial class**

  Find the tech card elements. Add `className="card-editorial"` (or apply equivalent inline styles with `border-radius: 0`). Remove any existing `border-radius` values. Ensure hover uses `box-shadow: inset 3px 0 0 var(--accent)` not border change.

  If cards use inline `onMouseEnter/Leave`, update:
  ```tsx
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = 'inset 3px 0 0 var(--accent)';
    e.currentTarget.style.background = 'var(--accent-glow)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.background = 'var(--bg-secondary)';
  }}
  ```

- [ ] **Step 6: Verify**

  Run: `npm run dev`, scroll to expertise section.
  Expected: Ghost `03`, "TOOLS / *of the trade*" heading, sharp cards with inset left-border on hover.

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/sections/ExpertiseSection.tsx
  git commit -m "feat: expertise section — ghost column, editorial heading, sharp card hover"
  ```

---

### Task 8: Reviews Section

**Files:**
- Modify: `src/components/sections/ReviewsSection.tsx`

- [ ] **Step 1: Read current ReviewsSection.tsx**

  Read `src/components/sections/ReviewsSection.tsx` in full.

- [ ] **Step 2: Add section-wrapper with ghost 04**

  ```tsx
  <section id="reviews" style={{ background: 'var(--bg-primary)' }}>
    <div className="section-wrapper">
      <div className="section-num-col">
        <span className="section-num">04</span>
      </div>
      <div className="section-divider-line" />
      <div className="section-content-col">
        {/* existing content */}
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Update section overline and heading**

  ```tsx
  <span className="section-overline">04 — Reviews</span>
  <h2 className="editorial-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
    <span className="display-word">WHAT PEOPLE</span>
    <em className="accent-word" style={{ fontSize: '0.85em' }}>say</em>
  </h2>
  ```

- [ ] **Step 4: Update review cards**

  Find review card containers. Apply `className="card-editorial"` and update the quote mark style:

  ```tsx
  // Quote mark:
  <span style={{
    fontFamily: 'var(--font-accent)',
    fontStyle: 'italic',
    fontSize: '4rem',
    lineHeight: '1',
    color: 'var(--accent)',
    display: 'block',
    marginBottom: 'var(--space-sm)',
  }}>
    "
  </span>
  ```

  Remove any existing `border-radius` from cards. Add `padding: 'var(--space-xl)'` if not already present.

- [ ] **Step 5: Verify**

  Run: `npm run dev`, scroll to reviews.
  Expected: Ghost `04`, editorial heading, large orange quote marks, sharp cards.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/sections/ReviewsSection.tsx
  git commit -m "feat: reviews section — ghost column, editorial heading, orange quote marks"
  ```

---

### Task 9: Contact Section

**Files:**
- Modify: `src/components/sections/ContactSection.tsx`

- [ ] **Step 1: Read current ContactSection.tsx**

  Read `src/components/sections/ContactSection.tsx` in full.

- [ ] **Step 2: Add section-wrapper with ghost 05**

  ```tsx
  <section id="contact" style={{ background: 'var(--bg-secondary)' }}>
    <div className="section-wrapper">
      <div className="section-num-col">
        <span className="section-num">05</span>
      </div>
      <div className="section-divider-line" />
      <div className="section-content-col">
        {/* existing content */}
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Update section overline and heading**

  ```tsx
  <span className="section-overline">05 — Contact</span>
  <h2 className="editorial-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
    <span className="display-word">LET'S BUILD</span>
    <em className="accent-word" style={{ fontSize: '0.85em' }}>something great</em>
  </h2>
  ```

- [ ] **Step 4: Update social links**

  Find each social link `<a>`. Apply orange left-bar accent with hover handlers:

  ```tsx
  <a
    href={link.href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: '12px 16px',
      borderLeft: '2px solid var(--accent)',
      fontFamily: 'var(--font-body)',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      transition: 'color var(--duration-fast), background var(--duration-fast)',
      background: 'transparent',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--text-primary)';
      e.currentTarget.style.background = 'var(--accent-glow)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'var(--text-secondary)';
      e.currentTarget.style.background = 'transparent';
    }}
  >
    {link.icon} {link.label}
  </a>
  ```

- [ ] **Step 5: Update form input styles**

  Find the form `<input>` and `<textarea>` elements. Apply:

  ```tsx
  style={{
    width: '100%',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: '0',
    padding: '12px 16px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
  }}
  // onFocus: border-color → var(--accent), box-shadow → 0 0 0 2px var(--accent) at 30% opacity
  // onBlur: revert to border: 1px solid var(--border), box-shadow: none
  ```

  Add inline onFocus/onBlur:
  ```tsx
  onFocus={(e) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = 'var(--border)';
    e.currentTarget.style.boxShadow = 'none';
  }}
  ```

- [ ] **Step 6: Update submit button**

  Replace the submit button with:

  ```tsx
  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
    {submitted ? '✓ Message Sent' : 'Send Message'}
  </button>
  ```

- [ ] **Step 7: Verify**

  Run: `npm run dev`, scroll to contact.
  Expected: Ghost `05`, editorial heading, orange-bordered social links, sharp form inputs with orange focus ring, orange submit button.

- [ ] **Step 8: Commit**

  ```bash
  git add src/components/sections/ContactSection.tsx
  git commit -m "feat: contact section — ghost column, editorial heading, sharp form, orange social links"
  ```

---

### Task 10: Footer + Marquee

**Files:**
- Modify: `src/components/ui/Footer.tsx`
- Modify: `src/components/ui/Marquee.tsx`

- [ ] **Step 1: Read both files**

  Read `src/components/ui/Footer.tsx` and `src/components/ui/Marquee.tsx`.

- [ ] **Step 2: Update Footer**

  Update the footer to use DM Sans and the new border:

  ```tsx
  // Footer container:
  style={{
    borderTop: '1px solid var(--border)',
    padding: 'var(--space-xl) 0',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: 'var(--text-tertiary)',
  }}
  ```

  Update social link styles — remove any `border-radius` rounding, apply same color as nav links.

- [ ] **Step 3: Update Marquee separator**

  Find the separator element (`•` or similar). Change to orange dot:

  ```tsx
  <span className="sep" style={{ color: 'var(--accent)' }}>●</span>
  ```

  Ensure the text items use `font-family: var(--font-body)` (already handled by globals.css update in Task 2).

- [ ] **Step 4: Verify full page**

  Run: `npm run dev`. Scroll through the entire page.
  Expected full-page checklist:
  - [ ] Orange 2px top-bar at very top
  - [ ] Navbar: `ESTEBAN` *Acuña* logo, DM Sans links, orange underline on hover
  - [ ] Hero: Ghost `01`, Bebas name, italic orange *Acuña*, orange badge, sharp buttons
  - [ ] Marquee: Uppercase text, orange dot separators
  - [ ] Problem Solver: Ghost `02`, editorial heading with *solver* in orange
  - [ ] Expertise: Ghost `03`, `TOOLS` / *of the trade*, sharp cards with inset hover
  - [ ] Reviews: Ghost `04`, `WHAT PEOPLE` / *say*, large orange quote marks
  - [ ] Contact: Ghost `05`, form with orange focus, social links with orange left bar
  - [ ] Footer: DM Sans, subtle top border
  - [ ] Light mode: Toggle to light — warm cream background, orange accent preserved throughout

- [ ] **Step 5: Final commit**

  ```bash
  git add src/components/ui/Footer.tsx src/components/ui/Marquee.tsx
  git commit -m "feat: footer and marquee — DM Sans, orange dot separators"
  ```

---

## Post-Implementation

- [ ] Run `npm run build` — verify no TypeScript or build errors
- [ ] Check mobile layout at 375px width — ghost number columns should be hidden, content full-width
- [ ] Toggle theme multiple times — verify smooth transition, orange accent preserved in both themes
- [ ] Check all anchor links still work (`#about`, `#expertise`, `#reviews`, `#contact`)
