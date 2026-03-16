# Portfolio Design Overhaul — Spec
**Date:** 2026-03-16
**Status:** Approved by user

---

## Overview

Complete visual redesign of Esteban Acuña's personal portfolio. Keeps the existing 5-section structure and all functionality (Three.js scenes, GSAP, Lenis, theme toggle). Changes typography, color system, layout composition, and light mode.

**Out of scope (future):** Three.js scene geometry/object redesign. Three.js material colors ARE in scope — they must be updated from lime to orange/amber to match the new accent system.

---

## Aesthetic Direction

**Editorial Dark × Structured Asymmetry**

Pure black backgrounds, electric orange accent, condensed editorial typography, architectural column-based layout with numbered section identifiers. Light mode uses warm magazine paper tones — the same orange accent is preserved in both themes (never inverted).

---

## Typography

### Font Loading
Load all fonts via `next/font/google` in `src/app/layout.tsx`, replacing the existing `@import` in `globals.css`. Use the `variable` option and attach CSS variable names to `<html>`.

```tsx
// src/app/layout.tsx
import { Bebas_Neue, Instrument_Serif, DM_Sans, IBM_Plex_Mono } from 'next/font/google'

const bebasNeue = Bebas_Neue({ weight: ['400'], variable: '--font-display', subsets: ['latin'] })
const instrumentSerif = Instrument_Serif({ weight: ['400'], style: ['italic'], variable: '--font-accent', subsets: ['latin'] })
const dmSans = DM_Sans({ weight: ['300', '400', '600'], variable: '--font-body', subsets: ['latin'] })
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '500'], variable: '--font-mono', subsets: ['latin'] })

// Apply all four variable classes to <html>
```

Remove the existing `@import url('https://fonts.googleapis.com/...')` from `globals.css`.

### Font Replacements

| Role | Font | CSS Variable | Replaces |
|---|---|---|---|
| Display | Bebas Neue | `--font-display` | Space Grotesk |
| Accent/italic | Instrument Serif italic | `--font-accent` | — (new variable) |
| Body | DM Sans | `--font-body` | Inter |
| Mono | IBM Plex Mono | `--font-mono` | JetBrains Mono |

Update `globals.css` CSS variable definitions:
```css
--font-display: var(--font-display); /* set by next/font */
--font-body: var(--font-body);       /* set by next/font */
--font-mono: var(--font-mono);       /* set by next/font */
--font-accent: var(--font-accent);   /* set by next/font — NEW */
```

### Heading Pattern
Bebas Neue for the primary word(s), Instrument Serif italic for one accented word per heading:
- `PROBLEM` *solver*
- `TOOLS` *of the trade*
- `WHAT PEOPLE` *say*
- `LET'S BUILD` *something great*

```html
<h2>
  <span style="fontFamily: var(--font-display)">TOOLS</span>
  <em style="fontFamily: var(--font-accent); fontStyle: italic; color: var(--accent)">of the trade</em>
</h2>
```

**Scale:** Keep existing clamp-based sizes. H1 stays at `clamp(3.5rem, 8vw, 7rem)`.

---

## Color System

### Dark Mode (default)

Replace all existing token values. Token names are preserved where they exist; new ones are added.

| Token | New Value | Old Value | Notes |
|---|---|---|---|
| `--bg-primary` | `#0d0d0d` | `#0a0a0a` | Intentional change |
| `--bg-secondary` | `#111111` | `#111111` | Unchanged |
| `--bg-tertiary` | `#1a1a1a` | `#1a1a1a` | Unchanged |
| `--bg-elevated` | `#1f1f1f` | `#1e1e1e` | Slight adjustment |
| `--bg-hover` | `#252525` | `#252525` | Unchanged — keep |
| `--accent` | `#ff6b35` | `#c8ff00` | Lime → Orange |
| `--accent-dim` | `#cc5528` | `#a3cc00` | Updated |
| `--accent-glow` | `rgba(255, 107, 53, 0.12)` | `rgba(200, 255, 0, 0.15)` | Updated |
| `--text-primary` | `#f5f5f5` | `#f5f5f5` | Unchanged |
| `--text-secondary` | `#888888` | `#a0a0a0` | Slightly darker |
| `--text-tertiary` | `#555555` | `#666666` | Slightly darker |
| `--text-inverse` | `#0d0d0d` | `#0a0a0a` | Updated to match bg |
| `--border` | `#1f1f1f` | `#222222` | Slight adjustment |
| `--border-subtle` | `#161616` | `#1a1a1a` | Keep — updated value |
| `--border-accent` | `rgba(255, 107, 53, 0.3)` | `rgba(200, 255, 0, 0.3)` | Updated |
| `--nav-bg` | `rgba(13, 13, 13, 0.88)` | `rgba(10, 10, 10, 0.85)` | Updated |
| `--gradient-hero` | `linear-gradient(135deg, #0d0d0d 0%, #111118 50%, #0d0d0d 100%)` | old value | Updated |
| `--gradient-card` | `linear-gradient(145deg, #1a1a1a 0%, #111111 100%)` | old value | Unchanged |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.3)` | old | Unchanged |
| `--shadow-md` | `0 4px 24px rgba(0,0,0,0.4)` | old | Unchanged |
| `--shadow-lg` | `0 8px 48px rgba(0,0,0,0.5)` | old | Unchanged |
| `--shadow-glow` | `0 0 40px rgba(255, 107, 53, 0.08)` | old lime value | Updated to orange |

### Light Mode (Magazine Paper)

| Token | Value | Notes |
|---|---|---|
| `--bg-primary` | `#faf6ef` | Warm off-white |
| `--bg-secondary` | `#f0e8dc` | Slightly warmer |
| `--bg-tertiary` | `#e8ddd0` | — |
| `--bg-elevated` | `#ede4d8` | — |
| `--bg-hover` | `#e4d9cc` | — |
| `--accent` | `#ff6b35` | Same as dark — never inverted |
| `--accent-dim` | `#e55a25` | — |
| `--accent-glow` | `rgba(255, 107, 53, 0.10)` | — |
| `--text-primary` | `#1a1610` | Warm near-black |
| `--text-secondary` | `#7a6e62` | Warm mid-gray |
| `--text-tertiary` | `#b0a496` | Warm light |
| `--text-inverse` | `#faf6ef` | — |
| `--border` | `#ddd4c4` | — |
| `--border-subtle` | `#e8ddd0` | — |
| `--border-accent` | `rgba(255, 107, 53, 0.4)` | — |
| `--nav-bg` | `rgba(250, 246, 239, 0.90)` | — |
| `--gradient-hero` | `linear-gradient(135deg, #faf6ef 0%, #f5eedd 50%, #faf6ef 100%)` | — |
| `--gradient-card` | `linear-gradient(145deg, #f0e8dc 0%, #faf6ef 100%)` | — |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.06)` | — |
| `--shadow-md` | `0 4px 24px rgba(0,0,0,0.10)` | — |
| `--shadow-lg` | `0 8px 48px rgba(0,0,0,0.14)` | — |
| `--shadow-glow` | `0 0 40px rgba(255, 107, 53, 0.06)` | — |

---

## Layout System — Structured Asymmetry

### Orange Top-Bar
A `<div>` element added directly in `src/app/layout.tsx`, as the first child of `<body>`, before any other content including the `<Navbar>`:

```tsx
<body>
  <div style={{ height: '2px', background: 'var(--accent)', width: '100%' }} />
  <Navbar />
  {children}
</body>
```

This is **not** part of `Navbar.tsx`. Add `src/app/layout.tsx` to the files-to-modify list.

### Ghost Section Numbers
Each section component gets a left column with a ghost number. Only the 5 page sections receive this treatment — Navbar and Footer do not.

```tsx
<section id="hero">
  <div className="section-wrapper"> {/* max-width: 1200px, centered, flex row */}
    <div className="section-number"> {/* ~80px wide, flex-shrink: 0 */}
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem,8vw,8rem)', opacity: 0.05, color: 'var(--text-primary)', lineHeight: 1 }}>01</span>
    </div>
    <div className="section-divider" /> {/* 1px wide, background: var(--border), align-self: stretch */}
    <div className="section-content"> {/* flex: 1 */}
      {/* section content */}
    </div>
  </div>
</section>
```

Numbers per section: Hero=`01`, Problem Solver=`02`, Expertise=`03`, Reviews=`04`, Contact=`05`.

### Heading Pattern (implementation)

```tsx
<h2>
  <span className="font-display">TOOLS</span>{' '}
  <em className="font-accent" style={{ color: 'var(--accent)' }}>of the trade</em>
</h2>
```

Where `font-display` applies `font-family: var(--font-display)` and `font-accent` applies `font-family: var(--font-accent); font-style: italic`.

### Buttons
- **Primary:** `background: var(--accent)`, `color: var(--text-inverse)`, `font-family: var(--font-body)`, `font-weight: 600`, `letter-spacing: 1px`, `text-transform: uppercase`, `border-radius: 0`, `padding: 12px 28px`
- **Ghost:** `border: 1px solid var(--border)`, `color: var(--text-secondary)`, `border-radius: 0`, hover: `border-color: rgba(255, 107, 53, 0.5)`

### Cards — Hover Left Accent
To avoid layout shift when adding a left border on hover, use `box-shadow` instead of `border`:

```css
/* default */
.card { border: 1px solid var(--border); border-radius: 0; }

/* hover — use inset box-shadow to avoid layout shift */
.card:hover {
  box-shadow: inset 3px 0 0 var(--accent);
  background: var(--accent-glow);
}
```

---

## Per-Section Redesign

### Navbar
- **Top-bar:** Rendered in `layout.tsx`, not Navbar (see above)
- **Logo:** Drop the `.dev` suffix. New logo: `ESTEBAN` in Bebas Neue + *Acuña* in Instrument Serif italic, inline, no separator
- **Nav links:** DM Sans. On hover: only the underline turns orange (`var(--accent)`); text color stays `var(--text-primary)`. Underline implemented via `::after` pseudo-element with `background: var(--accent)`
- **Theme toggle:** Keep behavior, re-skin
- **Mobile menu:** Keep behavior, re-skin

### Hero (section 01)
- **Layout:** Left ghost `01` column + divider; right has content (top) + 3D scene (bottom/right)
- **Badge:** `IBM Plex Mono`, `● AVAILABLE FOR PROJECTS`, orange text, `background: var(--accent-glow)`, `border: 1px solid var(--border-accent)`, `border-radius: 0`
- **Name:** `ESTEBAN` (Bebas Neue, `--text-primary`) + line break + *Acuña* (Instrument Serif italic, `var(--accent)`)
- **Tagline:** `IBM Plex Mono`, `// Full-Stack Developer`, `var(--text-tertiary)`
- **CTAs:** Primary orange "Get in Touch" + ghost "View Expertise"
- **3D scene (HeroScene):** Keep geometry and animations. Update material colors: primary mesh → `#ff6b35` (orange), particles → `#cc5528` (amber-dark), secondary mesh → `#ff8c5a` (orange-light)
- **Scroll indicator:** Keep, re-skin to use `var(--accent)` color

### Problem Solver (section 02)
- **Heading:** `I'M A PROBLEM` (Bebas) + *solver* (Instrument Serif italic, orange) + `BY NATURE` (Bebas, new line)
- **3D tab switcher:** Keep 5 tabs. Active tab: `background: var(--accent)`, `color: var(--text-inverse)`. Inactive: `border: 1px solid var(--border)`. 3D scene glow color → orange
- **Trait badges:** `border-radius: 0`, `border: 1px solid var(--border)`, hover: `border-color: var(--accent)`, `color: var(--accent)`

### Expertise / Tech Stack (section 03)
- **Heading:** `TOOLS` (Bebas) + *of the trade* (Instrument Serif italic, orange)
- **Category headers:** Bebas Neue, `var(--text-secondary)`
- **Cards:** `border-radius: 0`, `border: 1px solid var(--border)`. Hover: `box-shadow: inset 3px 0 0 var(--accent)`, `background: var(--accent-glow)`

### Testimonials / Reviews (section 04)
- **Heading:** `WHAT PEOPLE` (Bebas) + *say* (Instrument Serif italic, orange)
- **Quote mark (`"`):** Instrument Serif italic, `var(--accent)`, `font-size: 4rem`, `line-height: 1`
- **Cards:** `border-radius: 0`, `border: 1px solid var(--border)`
- **Star color:** Keep `#f59e0b` (amber — acceptable secondary color for ratings only)
- **Placeholder content:** Keep as-is, no changes to names/text

### Contact (section 05)
- **Heading:** `LET'S BUILD` (Bebas) + *something great* (Instrument Serif italic, orange)
- **Social links:** Left `2px` orange bar (`border-left: 2px solid var(--accent)`), DM Sans
- **Form inputs:** `border-radius: 0`, `border: 1px solid var(--border)`, focus: `box-shadow: 0 0 0 2px var(--accent)`, `border-color: var(--accent)`
- **Submit button:** Primary style (orange)

### Footer
- Font: `var(--font-body)` (DM Sans), `var(--text-tertiary)`
- Top: `1px solid var(--border)`
- Layout unchanged

### Marquee Dividers
- Text: DM Sans, `text-transform: uppercase`, `letter-spacing: 2px`, `var(--text-secondary)`
- Separator: replace current bullet with an orange dot (`color: var(--accent)`, `●`)

---

## What Is NOT Changing
- Five-section page structure and content
- Three.js scene geometry, objects, and animations (only material colors change — see Hero section above for SolverScene: same rule applies, update lime-colored materials to orange)
- GSAP scroll animation logic and triggers
- Lenis smooth scroll configuration
- Section IDs (`#hero`, `#about`, `#expertise`, `#reviews`, `#contact`)
- Mobile responsive layout and breakpoints
- ChatWidget
- Contact form submission behavior

---

## Files to Modify

| File | Changes |
|---|---|
| `src/app/globals.css` | Remove Google Fonts `@import`; update all color tokens; update font variable definitions; add `--font-accent` variable; add `.font-display`, `.font-accent`, `.font-body`, `.font-mono` utility classes |
| `src/app/layout.tsx` | Add `next/font/google` imports for all 4 fonts; apply variable classes to `<html>`; add orange top-bar `<div>` as first child of `<body>` |
| `src/components/ui/Navbar.tsx` | Logo: drop `.dev`, apply Bebas + Instrument Serif; nav link hover underline orange; re-skin mobile menu |
| `src/components/sections/HeroSection.tsx` | Ghost `01` column; name treatment (Bebas + Instrument Serif); badge style; CTA button styles |
| `src/components/three/HeroScene.tsx` | Update material colors to orange/amber palette |
| `src/components/three/SolverScene.tsx` | Update lime-colored materials to orange palette |
| `src/components/sections/SolverSection.tsx` | Ghost `02` column; heading treatment; tab button styles; trait badge styles |
| `src/components/sections/ExpertiseSection.tsx` | Ghost `03` column; heading treatment; card hover styles |
| `src/components/sections/ReviewsSection.tsx` | Ghost `04` column; heading treatment; quote mark; card styles |
| `src/components/sections/ContactSection.tsx` | Ghost `05` column; heading treatment; form input styles; social link bar accent |
| `src/components/ui/Footer.tsx` | Font to DM Sans; border style |
| `src/components/ui/Marquee.tsx` | Text font + separator re-skin |
