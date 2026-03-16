# Three.js Scene Redesign — Spec
**Date:** 2026-03-16
**Status:** Approved by user

---

## Overview

Replace both existing Three.js scenes (`HeroScene.tsx` and `SolverScene.tsx`) with a unified **Network/Constellation** aesthetic — orange glowing nodes connected by edges, animated continuously. The hero scene expands to full-bleed with a cinematic overlap layout. The solver scene drops its tab buttons and silently morphs between 5 thematic network topologies.

**Out of scope:** Section layout changes, typography, color tokens, GSAP scroll animations, Lenis — all unchanged.

---

## Aesthetic Direction

**Network / Constellation:** Force-directed-style graph of orange nodes (`#ff6b35`) connected by semi-transparent edges. Nodes pulse gently (opacity flicker). Edges fade in/out. The whole graph breathes and slowly drifts. Mouse parallax on the hero. Orange glow rings on hub nodes.

Color palette (same as existing design system):
- Node fill: `#ff6b35`
- Secondary nodes: `#ff8c5a`
- Distant/dim nodes: `#cc5528`
- Edges: `rgba(255, 107, 53, 0.3–0.5)` depending on importance
- Pulse rings: `rgba(255, 107, 53, 0.08–0.15)`

---

## HeroScene Redesign

### Layout Change (in `HeroSection.tsx`)

The 3D canvas currently sits in the right column of a two-column grid. Change it to a full-bleed positioned element that bleeds from the right, overlapping the text column.

**Current structure (simplified):**
```tsx
<div className="grid grid-cols-2">
  <div>{/* text content */}</div>
  <div>{/* 3D scene */}</div>
</div>
```

**New structure:**
```tsx
<div style={{ position: 'relative' }}>
  {/* Scene: absolutely positioned, full width, behind text */}
  <div style={{
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    zIndex: 0,
    pointerEvents: 'none',
  }}>
    <HeroScene />
  </div>
  {/* Gradient fade mask: left-to-right, covers ~50% from left */}
  <div style={{
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    background: 'linear-gradient(90deg, var(--bg-primary) 0%, var(--bg-primary) 40%, rgba(var(--bg-primary-rgb), 0.7) 70%, transparent 100%)',
    zIndex: 1,
    pointerEvents: 'none',
  }} />
  {/* Text content: above gradient */}
  <div style={{ position: 'relative', zIndex: 2 }}>
    {/* existing text content */}
  </div>
</div>
```

**Note on gradient:** `--bg-primary` is `#0d0d0d` in dark mode and `#faf6ef` in light mode. To avoid hardcoding hex in the mask, add a CSS variable `--bg-primary-rgb` (dark: `13,13,13`; light: `250,246,239`) to `globals.css` alongside the existing `--bg-primary` tokens.

### HeroScene.tsx — New Scene

**Remove:** GlassTorus, WireframeIcosahedron, SmallSpheres, MouseFollower wrapper (replace with new implementation).

**New components:**

#### `HeroNetwork` (main scene component)
- ~120 nodes randomly distributed across a wide area (x: -8 to 8, y: -5 to 5, z: -3 to 1)
- Edges: connect nodes within distance threshold ~3.5 units (cap at ~180 edges total)
- Node sizes: varied — 3 "hub" nodes (radius 0.08), 15 "mid" nodes (radius 0.05), rest "small" (radius 0.03)
- Hub nodes get a glow ring: `<mesh>` with `<ringGeometry>` and `meshBasicMaterial` at low opacity

#### Node animation
Each node breathes independently:
```tsx
// Per-node opacity flicker via shader or per-mesh opacity animation
// Simple approach: useFrame drives opacity on each PointsMaterial or mesh
opacity = 0.5 + Math.sin(clock.elapsedTime * speed + phaseOffset) * 0.3
```

Use instanced rendering (`<instancedMesh>`) for all nodes for performance.

#### Edge rendering
Use `THREE.LineSegments` with a `BufferGeometry` built from node pairs. Update edge opacity in `useFrame` based on combined node opacities.

#### Mouse parallax
```tsx
// Lerp whole graph group toward mouse position
groupRef.current.rotation.y += (pointer.x * 0.3 - groupRef.current.rotation.y) * 0.02;
groupRef.current.rotation.x += (-pointer.y * 0.2 - groupRef.current.rotation.x) * 0.02;
```

#### Slow drift
The whole graph group rotates very slowly: `rotation.y += 0.0005` per frame.

#### Particles
Keep a subtle ambient particle field (200 pts, `#666666`, opacity 0.3) for depth — same as existing but sparser.

#### Canvas setup
```tsx
<Canvas
  camera={{ position: [0, 0, 7], fov: 50 }}
  dpr={[1, 1.5]}
  gl={{ antialias: true, alpha: true }}
  style={{ background: 'transparent' }}
>
```

---

## SolverScene Redesign

### Tab Buttons Removed (in `SolverSection.tsx`)

Remove the tab button row rendered below the 3D canvas. The `activeScene` state and auto-cycle interval remain — the scene still advances every 3 seconds, it just does so silently with no visible controls.

The `sceneSteps` array and `handleStepClick` can be removed since there are no buttons. Keep only:
```tsx
const [activeScene, setActiveScene] = useState(0);
useEffect(() => {
  const id = setInterval(() => setActiveScene(p => (p + 1) % 5), 3000);
  return () => clearInterval(id);
}, []);
```

### SolverScene.tsx — 5 Thematic Topologies

Replace all 5 existing scene components (GearShape, CircuitGrid, CodeMatrix, PCBBoard, SolderingScene) with 5 new network topologies. All share the same node/edge visual language but differ in topology and motion.

#### Shared infrastructure
- `NetworkGraph` component accepts `nodes: NodeDef[]` and `edges: EdgeDef[]` plus `opacity: number`
- Morphs smoothly using the existing `SceneManager` opacity-fade pattern
- All scenes use the same `meshStandardMaterial` for nodes and `LineSegments` for edges

```tsx
interface NodeDef {
  position: [number, number, number];
  radius: number;
  color?: string;
  isHub?: boolean;
}
interface EdgeDef {
  from: number; // node index
  to: number;
}
```

#### Scene 1: Auto / Mechanical — Gear-Ring Topology
- 8 outer nodes arranged in a circle (radius 1.2), evenly spaced
- 1 center hub node (larger, isHub: true)
- Edges: all outer nodes → center (spokes), each outer node → both neighbors (ring)
- Animation: entire graph rotates around Z axis at 0.3 rad/s

#### Scene 2: Electronics — Grid Matrix
- 3×3 grid of nodes at integer positions × 0.7 spacing, centered
- Center node: hub (larger)
- Edges: all horizontal and vertical neighbors connected
- Animation: gentle Y-axis sway `Math.sin(t * 0.2) * 0.15`; pulse animation on edges (opacity cycles sequentially through rows)

#### Scene 3: Code — Dependency Tree
- Root node at top center
- 2 child nodes (level 2), 4 grandchild nodes (level 3), 4 leaf nodes (level 4)
- Positions: tree layout, evenly spaced per level
- Edges: parent → children only; one dashed cross-link between level-3 siblings (rendered as a separate `LineDashedMaterial` segment)
- Animation: nodes at each level bob at slightly different phases; root pulses a glow ring

#### Scene 4: PCB — Radial Concentric Rings
- Center hub + 6 inner-ring nodes (radius 0.9) + 8 outer-ring nodes (radius 1.6)
- Edges: center → all inner, inner nodes → both adjacent inner neighbors, each inner → nearest outer
- Animation: slow Z rotation (0.08 rad/s); outer ring rotates slightly faster than inner (counter-rotate effect)

#### Scene 5: Solder — Dense Cluster + Tendrils
- Dense core: 5 tightly-packed nodes (radius 0.2–0.5 from center), hub at center
- 6 tendril chains: each starts at a core node and extends 2 more nodes outward with decreasing node size and opacity
- Edges: fully connected core cluster + tendril chains
- Animation: core nodes oscillate with high-frequency jitter (fast speed, small amplitude); tendril tips drift slowly outward and back

#### SceneManager (updated)
Keep existing opacity-fade pattern. Add Float wrapper per scene with low `rotationIntensity={0.05}` so scenes breathe gently.

---

## Files to Modify

| File | Changes |
|---|---|
| `src/app/globals.css` | Add `--bg-primary-rgb` token to dark and light mode blocks |
| `src/components/sections/HeroSection.tsx` | Change 3D scene wrapper to full-bleed positioned layout with gradient mask |
| `src/components/three/HeroScene.tsx` | Full rewrite: HeroNetwork with instanced nodes, LineSegments edges, mouse parallax, slow drift |
| `src/components/three/SolverScene.tsx` | Full rewrite: 5 NetworkGraph topology components + updated SceneManager |
| `src/components/sections/SolverSection.tsx` | Remove tab button row; simplify auto-cycle logic |

---

## What Is NOT Changing

- Section structure, IDs, layout, GSAP animations, Lenis
- Color tokens (reusing existing `--accent`, `--bg-primary`, etc.)
- `next/font` setup, typography, button styles, cards, navbar, footer
- The `activeScene` prop interface on SolverScene (still accepts `number`)
- Mobile responsiveness — scenes already use `w-full h-full` within their containers
- ChatWidget, contact form, testimonials
