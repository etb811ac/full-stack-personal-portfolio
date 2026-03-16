# Three.js Scene Redesign — Spec
**Date:** 2026-03-16
**Status:** Approved by user

---

## Overview

Replace both existing Three.js scenes (`HeroScene.tsx` and `SolverScene.tsx`) with a unified **Network/Constellation** aesthetic — orange glowing nodes connected by edges, animated continuously. The hero scene expands to cover more of the screen with a cinematic overlap layout. The solver scene drops its tab buttons and silently morphs between 5 thematic network topologies.

**Out of scope:** Section layout changes outside what is specified here, typography, color tokens, GSAP scroll animations (beyond the targeted adjustments below), Lenis.

---

## Aesthetic Direction

**Network / Constellation:** Force-directed-style graph of orange nodes (`#ff6b35`) connected by semi-transparent edges. Nodes pulse gently (opacity flicker). Edges breathe as a whole. The graph slowly drifts and rotates. Mouse parallax on the hero. Orange glow rings on hub nodes.

Color palette:
- Node fill: `#ff6b35`
- Secondary nodes: `#ff8c5a`
- Distant/dim nodes: `#cc5528`
- Edges: `rgba(255, 107, 53, 0.3–0.5)` depending on importance
- Pulse rings: `rgba(255, 107, 53, 0.08–0.15)`

---

## globals.css — Add `--bg-primary-rgb`

Add to the `[data-theme="dark"]` block:
```css
--bg-primary-rgb: 13, 13, 13;
```

Add to the `[data-theme="light"]` block:
```css
--bg-primary-rgb: 250, 246, 239;
```

**Format contract:** The value is a bare comma-separated RGB triplet (no `rgb()` wrapper). This allows use as `rgba(var(--bg-primary-rgb), 0.7)` directly in CSS/inline styles.

---

## HeroSection.tsx — Layout Change

### What changes

Inside `section-content-col`, the current structure is a `max-w-[1400px]` two-column grid. Replace only the **grid** behavior on that div:
- Remove: `className="... grid grid-cols-1 lg:grid-cols-2 items-center"`
- Add: `style={{ position: 'relative', overflow: 'hidden' }}` (keep `className="w-full max-w-[1400px] mx-auto"` and the inline `padding` and `gap` styles)

Inside this now-relative wrapper:

**Remove Tailwind height classes from scene div:** The existing `hero-3d-container` div has Tailwind classes `h-[500px]` and `lg:h-[500px]`. These must be removed — they conflict with the new `height: '100%'` inline style.

**Scene div (`hero-3d-container`)** — currently the right column, becomes absolutely positioned with an **explicit height** (not `height: '100%'`) to avoid dependency on the parent height chain:
```tsx
<div
  className="hero-3d-container opacity-0"  {/* remove h-[500px] lg:h-[500px] w-full relative — keep only hero-3d-container opacity-0 */}
  style={{
    position: 'absolute',
    right: 0,
    top: 0,
    height: 'calc(100vh - 80px)', // explicit height — matches section's visible area (100vh minus paddingTop)
    minHeight: '600px',           // floor for small viewports
    width: '80%',
    zIndex: 0,
    // No pointerEvents: 'none' — canvas must receive mouse events for R3F pointer/parallax
  }}
>
  <HeroScene />
</div>
```

**Gradient fade mask** — new div, added after the scene div:
```tsx
<div
  style={{
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '60%',
    background: `linear-gradient(90deg, rgba(var(--bg-primary-rgb), 1) 0%, rgba(var(--bg-primary-rgb), 1) 35%, rgba(var(--bg-primary-rgb), 0.75) 60%, transparent 100%)`,
    zIndex: 1,
    pointerEvents: 'none',
  }}
/>
```

**Text content div** — currently left column, becomes normal-flow (no position change needed). Keep existing markup exactly. It sits above the absolute scene and gradient (z stacking is handled by the gradient mask). Keep `className="z-[2]"` to ensure it is above the gradient.

**Wrapper height:** The `position: relative` wrapper only needs `position: 'relative'` and `overflow: 'hidden'` added. Do not set an explicit height on the wrapper — the `section-content-col` and intermediate divs do not have explicit heights, so a percentage-based height on the scene child would collapse. Instead, give the scene div an **explicit height directly** (see below).

Update the wrapper div style (remove the grid, add position/overflow):
```tsx
style={{
  padding: '0 var(--space-2xl)',
  gap: 'var(--space-3xl)',
  position: 'relative',
  overflow: 'hidden',
}}
```

### GSAP — no changes needed

The `.hero-3d-container` class is retained on the scene wrapper div. GSAP animations are unchanged:
- `x: 80 → 0, opacity: 0 → 1` reveal still works.
- `y: -60` scroll parallax still works. The parent wrapper has `overflow: hidden`, so the 60px upward shift is clipped cleanly within the section. The section's existing bottom gradient fade (`h-[200px]`) covers any gap.

### Loading fallback — update style

The `dynamic()` loading fallback currently has `background: 'var(--bg-secondary)', borderRadius: '16px'`. Change to `background: 'transparent'` and remove `borderRadius` so it does not appear as a visible rounded block in the new full-bleed layout:
```tsx
loading: () => (
  <div className="w-full h-full flex items-center justify-center" style={{ background: 'transparent' }}>
    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '14px' }}>
      Loading 3D...
    </span>
  </div>
),
```

---

## HeroScene.tsx — Full Rewrite

Remove all existing components (GlassTorus, WireframeIcosahedron, SmallSpheres, MouseFollower, Particles). Full rewrite.

### Node rendering — individual meshes (NOT instancedMesh)

Use **120 individual `<mesh>` elements** for nodes. `instancedMesh` cannot support per-instance opacity animation without a custom shader. 120 individual meshes is well within Three.js performance limits.

### Node data

```tsx
interface HeroNode {
  position: [number, number, number];
  radius: number;
  isHub: boolean;
  speed: number;    // oscillation speed for opacity flicker
  phase: number;    // phase offset
  baseOpacity: number;
}
```

Generate with `useMemo` (stable across renders):
- 3 hub nodes: `radius: 0.08`, scattered in central zone (x: −3..3, y: −2..2, z: −1..0), `baseOpacity: 0.9`
- 15 mid nodes: `radius: 0.05`, distributed across scene, `baseOpacity: 0.75`
- 102 small nodes: `radius: 0.03`, scattered across full space (x: −8..8, y: −5..5, z: −3..1), `baseOpacity: 0.55`

All `speed` and `phase` values: random on generation (`speed: 0.4 + Math.random() * 0.8`, `phase: Math.random() * Math.PI * 2`).

### Mesh refs — ref array pattern

```tsx
const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

// In JSX:
{nodes.map((node, i) => (
  <mesh key={i} ref={(el) => { nodeRefs.current[i] = el; }} position={node.position}>
    <sphereGeometry args={[node.radius, 12, 12]} />
    <meshStandardMaterial color="#ff6b35" transparent opacity={node.baseOpacity} />
  </mesh>
))}
```

### Per-node opacity animation (in `useFrame`)

```tsx
nodeRefs.current.forEach((mesh, i) => {
  if (!mesh) return;
  const node = nodes[i];
  const mat = mesh.material as THREE.MeshStandardMaterial;
  mat.opacity = node.baseOpacity + Math.sin(state.clock.elapsedTime * node.speed + node.phase) * 0.25;
});
```

### Edges

Connect node pairs within distance 3.5 units. Cap at 180 edges. Build a `THREE.BufferGeometry` with line segments (2 vertices per edge). Use a single `THREE.LineBasicMaterial`:

```tsx
const edgeMaterialRef = useRef(new THREE.LineBasicMaterial({ color: '#ff6b35', transparent: true, opacity: 0.35 }));

// In useFrame:
edgeMaterialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
```

The edge geometry is built once from the static node positions and does not change each frame.

### Glow rings on hub nodes

Each hub gets two `<mesh>` siblings with `<ringGeometry>`:
```tsx
<mesh position={hubNode.position}>
  <ringGeometry args={[hubNode.radius * 2.5, hubNode.radius * 3.5, 32]} />
  <meshBasicMaterial color="#ff6b35" transparent opacity={0.12} side={THREE.DoubleSide} />
</mesh>
```

### Mouse parallax

```tsx
const groupRef = useRef<THREE.Group>(null!);
// In useFrame:
groupRef.current.rotation.y += (state.pointer.x * 0.3 - groupRef.current.rotation.y) * 0.02;
groupRef.current.rotation.x += (-state.pointer.y * 0.2 - groupRef.current.rotation.x) * 0.02;
groupRef.current.rotation.y += 0.0003; // additive slow drift
```

### Ambient particles

```tsx
function Particles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.01;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.007) * 0.08;
    }
  });
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#666666" transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}
```

### Canvas setup

```tsx
<Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
  <ambientLight intensity={0.3} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />
  <pointLight position={[-3, 2, 4]} intensity={0.5} color="#ff6b35" />
  {/* hemisphereLight is removed — it is NOT carried over from the old HeroScene */}
  <group ref={groupRef}>
    {/* nodes, edges, glow rings */}
  </group>
  <Particles />
</Canvas>
```

---

## SolverSection.tsx — Remove Tab Buttons

Remove: the entire tab button row (`<div className="absolute bottom-6 left-1/2 ...">` and its `{sceneSteps.map(...)}` content), the `sceneSteps` array constant, the `handleStepClick` function, and the `intervalRef` useRef declaration (no longer needed).

Replace the auto-cycle logic with:
```tsx
const [activeScene, setActiveScene] = useState(0);
useEffect(() => {
  const id = setInterval(() => setActiveScene(p => (p + 1) % 5), 3000);
  return () => clearInterval(id);
}, []);
```

Keep: GSAP `.solver-3d-wrap` animation, the `SolverScene` component receiving `activeScene` prop, all content (heading, paragraphs, trait tags).

---

## SolverScene.tsx — Full Rewrite

### Lights — retain exactly

```tsx
<ambientLight intensity={0.4} />
<directionalLight position={[3, 3, 5]} intensity={0.7} />
<pointLight position={[-2, 1, 3]} intensity={0.4} color="#ff6b35" />
<hemisphereLight args={['#ffffff', '#444444', 0.5]} />
```

### `NetworkGraph` shared component (used by Scenes 1 and 2 only)

Scenes 3, 4, and 5 render their own nodes directly because they need per-mesh ref access or dynamic position updates that `NetworkGraph` cannot expose externally.

```tsx
interface NodeDef { position: [number, number, number]; radius: number; color?: string; isHub?: boolean; }
interface EdgeDef { from: number; to: number; }

function NetworkGraph({ nodes, edges, opacity }: { nodes: NodeDef[]; edges: EdgeDef[]; opacity: number }) {
  // ...build edge geometry from nodes + edges...
  return (
    <>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.position}>
            <sphereGeometry args={[node.radius, 12, 12]} />
            <meshStandardMaterial
              color={node.color ?? '#ff6b35'}
              transparent
              opacity={opacity}             // opacity prop applied to EVERY node material
            />
          </mesh>
          {node.isHub && (
            <mesh position={node.position}>
              <ringGeometry args={[node.radius * 2.5, node.radius * 3.5, 32]} />
              <meshBasicMaterial
                color="#ff6b35"
                transparent
                opacity={opacity * 0.12}   // glow ring also respects opacity prop
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="#ff6b35" transparent opacity={opacity * 0.35} />
      </lineSegments>
    </>
  );
}
```

**Edge geometry construction inside `NetworkGraph`:**
```tsx
const edgeGeometry = useMemo(() => {
  const positions = new Float32Array(edges.length * 2 * 3); // 2 vertices per edge, 3 floats each
  edges.forEach(({ from, to }, i) => {
    const a = nodes[from].position;
    const b = nodes[to].position;
    const v = i * 6;
    positions[v]     = a[0]; positions[v + 1] = a[1]; positions[v + 2] = a[2];
    positions[v + 3] = b[0]; positions[v + 4] = b[1]; positions[v + 5] = b[2];
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geo;
}, [nodes, edges]); // nodes/edges are static per-scene, so this runs once per scene mount
```

**Key rule:** Every `material` inside `NetworkGraph` must multiply its base opacity by the `opacity` prop. This ensures the SceneManager cross-fade works correctly — no material pops at the transition boundaries.

### SceneManager — retain existing opacity-fade pattern

The `useState`-in-`useFrame` opacity pattern (calling `setCurrentOpacities` at 60fps) is **intentionally retained** for simplicity — do not refactor to refs.

Wrap each scene in `<Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>`.

---

### Scene 1: Auto / Mechanical — Gear-Ring

**Nodes (9 total):**
- Hub: `[0, 0, 0]`, radius 0.12, isHub: true
- 8 outer nodes at radius 1.2 from center: `position = [cos(i/8 * 2π) * 1.2, sin(i/8 * 2π) * 1.2, 0]` for i = 0..7, radius 0.07

**Edges:** 8 spokes (each outer → center) + 8 ring edges (each outer → next, wrapping).

**Animation:** Wrap in a `useRef<THREE.Group>` and rotate: `groupRef.current.rotation.z += 0.003` per frame in `useFrame`.

---

### Scene 2: Electronics — Grid Matrix

**Nodes (9 total):** 3×3 grid. `position = [(col - 1) * 0.8, (row - 1) * 0.8, 0]` for col, row in 0..2. Center node (col=1, row=1, index 4) is hub with radius 0.10; others radius 0.06.

**Edges:** Horizontal neighbors + vertical neighbors (no diagonals). 12 edges total.

**Animation:**
- Group Y-sway: `group.rotation.y = Math.sin(t * 0.2) * 0.2`
- Edge material opacity pulse: `0.35 + Math.sin(t * 1.2) * 0.1`

---

### Scene 3: Code — Dependency Tree

**Does NOT use `NetworkGraph`.** Scene 3 needs per-mesh `position.y` mutations in `useFrame` (for the bobbing animation). `NetworkGraph` owns its internal mesh refs and does not expose them, so Scene 3 renders its own nodes directly — same pattern as Scene 5.

**Nodes (11 total):**
- Root: `[0, 1.5, 0]`, radius 0.10, isHub: true
- L2 (2): `[-0.9, 0.5, 0]` and `[0.9, 0.5, 0]`, radius 0.07
- L3 (4): `[-1.4, -0.5, 0]`, `[-0.4, -0.5, 0]`, `[0.4, -0.5, 0]`, `[1.4, -0.5, 0]`, radius 0.055
- L4 (4): `[-1.6, -1.5, 0]`, `[-0.6, -1.5, 0]`, `[0.6, -1.5, 0]`, `[1.6, -1.5, 0]`, radius 0.04, color: `#cc5528`

**Edges (via NetworkGraph):** Root→L2[0], Root→L2[1], L2[0]→L3[0], L2[0]→L3[1], L2[1]→L3[2], L2[1]→L3[3], L3[0]→L4[0], L3[1]→L4[1], L3[2]→L4[2], L3[3]→L4[3].

**Opacity prop:** Scene 3 accepts `opacity: number` from `SceneManager` and applies it to all node materials and the edge `LineBasicMaterial`, exactly as `NetworkGraph` does.

**Dashed cross-link (separate from NetworkGraph):** A `THREE.Line` between L3[1] (`[-0.4, -0.5, 0]`) and L3[2] (`[0.4, -0.5, 0]`) using `THREE.LineDashedMaterial({ color: '#ff6b35', dashSize: 0.1, gapSize: 0.08, opacity: 0.3, transparent: true })`. **Required:** call `geometry.computeLineDistances()` on this geometry — without it, dashes render as a solid line.

**Node level map for animation:** Store a `level` value alongside each node's base Y position so `useFrame` can apply level-based phase offsets. Define a `CodeNode` array that extends `NodeDef`:
```tsx
interface CodeNode extends NodeDef { level: number; baseY: number; phase: number; }
const codeNodes: CodeNode[] = [
  { position: [0,    1.5, 0], radius: 0.10, isHub: true, level: 0, baseY: 1.5,  phase: 0 },
  { position: [-0.9, 0.5, 0], radius: 0.07,              level: 1, baseY: 0.5,  phase: 0.5 },
  { position: [0.9,  0.5, 0], radius: 0.07,              level: 1, baseY: 0.5,  phase: 1.0 },
  { position: [-1.4,-0.5, 0], radius: 0.055,             level: 2, baseY: -0.5, phase: 0.3 },
  { position: [-0.4,-0.5, 0], radius: 0.055,             level: 2, baseY: -0.5, phase: 0.8 },
  { position: [0.4, -0.5, 0], radius: 0.055,             level: 2, baseY: -0.5, phase: 1.3 },
  { position: [1.4, -0.5, 0], radius: 0.055,             level: 2, baseY: -0.5, phase: 1.8 },
  { position: [-1.6,-1.5, 0], radius: 0.04, color: '#cc5528', level: 3, baseY: -1.5, phase: 0.2 },
  { position: [-0.6,-1.5, 0], radius: 0.04, color: '#cc5528', level: 3, baseY: -1.5, phase: 0.7 },
  { position: [0.6, -1.5, 0], radius: 0.04, color: '#cc5528', level: 3, baseY: -1.5, phase: 1.2 },
  { position: [1.6, -1.5, 0], radius: 0.04, color: '#cc5528', level: 3, baseY: -1.5, phase: 1.7 },
];
```

**Animation in `useFrame`:**
```tsx
nodeRefs.current.forEach((mesh, i) => {
  if (!mesh) return;
  const n = codeNodes[i];
  mesh.position.y = n.baseY + Math.sin(t * 0.8 + n.level * 1.2 + n.phase) * 0.05;
});
```
Use a mesh refs array with the same `ref={(el) => { nodeRefs.current[i] = el; }}` pattern.

---

### Scene 4: PCB — Radial Concentric Rings

**Component signature:** Scene 4 does NOT use `NetworkGraph` but still receives `opacity` from `SceneManager` and must apply it to all materials:
```tsx
function PCBScene({ opacity }: { opacity: number }) { ... }
```
Every `meshStandardMaterial`, `lineBasicMaterial`, and `meshBasicMaterial` (glow rings) inside this component must use `opacity={opacity * BASE}` where `BASE` is the desired base opacity (e.g. `opacity={opacity}` for nodes, `opacity={opacity * 0.35}` for edges). This is the same contract as `NetworkGraph`.

**Approach — single group, position-based rotation:**

Do NOT use separate `innerGroupRef` / `outerGroupRef` — edges spanning two independently rotating groups would become visually disconnected. Instead, use a single group and rotate ring nodes' positions directly in `useFrame` using accumulated angle offsets.

**Nodes:**
- Center hub: `[0, 0, 0]`, radius 0.12, isHub: true
- Inner ring (6): evenly spaced at radius 0.9 — `[cos(i/6 * 2π) * 0.9, sin(i/6 * 2π) * 0.9, 0]`
- Outer ring (8): evenly spaced at radius 1.65 — `[cos(i/8 * 2π) * 1.65, sin(i/8 * 2π) * 1.65, 0]`

**Edges:**
- Center → all 6 inner nodes (spokes)
- Each inner node → both adjacent inner neighbors (inner ring edges, 6 edges)
- Each inner node → its nearest outer node (6 edges, matching by angle proximity)

**Animation using accumulated angle offsets (in `useFrame`):**
```tsx
innerAngle.current += 0.0008;
outerAngle.current -= 0.0005;

// Update inner ring node positions
innerNodeRefs.current.forEach((mesh, i) => {
  const a = (i / 6) * Math.PI * 2 + innerAngle.current;
  mesh.position.x = Math.cos(a) * 0.9;
  mesh.position.y = Math.sin(a) * 0.9;
});

// Update outer ring node positions
outerNodeRefs.current.forEach((mesh, i) => {
  const a = (i / 8) * Math.PI * 2 + outerAngle.current;
  mesh.position.x = Math.cos(a) * 1.65;
  mesh.position.y = Math.sin(a) * 1.65;
});

// Rebuild edge geometry from current node world positions
// geometry.attributes.position.needsUpdate = true;
```

**Edge geometry — pre-allocated buffer with explicit write loop:**

Total edges: 6 spokes + 6 inner-ring + 6 inner-to-outer = 18 edges → 36 vertices → `Float32Array(108)`.

Pre-allocate once. **Critical:** `edgeGeo` holds a `BufferAttribute` that wraps the *same* `Float32Array` reference as `edgePositions`. Mutating `edgePositions` in `useFrame` is what updates the GPU buffer — they are the same object:
```tsx
const edgePositions = useMemo(() => new Float32Array(108), []);
const edgeGeo = useMemo(() => {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
  return g;
}, [edgePositions]); // dep on edgePositions to be explicit about the shared reference
```

**Null refs during first frame:** React populates `ref` callbacks synchronously during the initial render commit, so all refs will be assigned before the first `useFrame` call. Do not guard with `continue` — instead, initialize all positions to `[0,0,0]` by default in the pre-allocated buffer, so any stale slots safely draw degenerate (zero-length) line segments that are invisible.

Write loop in `useFrame` (v = vertex index × 3):
```tsx
let v = 0;
// 6 spokes: center → each inner node
for (let i = 0; i < 6; i++) {
  const inner = innerNodeRefs.current[i];
  if (!inner) { v += 6; continue; } // skip but advance v to keep buffer aligned
  // vertex A: center hub (always at origin)
  edgePositions[v++] = 0; edgePositions[v++] = 0; edgePositions[v++] = 0;
  // vertex B: inner node current position
  edgePositions[v++] = inner.position.x; edgePositions[v++] = inner.position.y; edgePositions[v++] = 0;
}
// 6 inner ring edges: inner[i] → inner[(i+1)%6]
for (let i = 0; i < 6; i++) {
  const a = innerNodeRefs.current[i];
  const b = innerNodeRefs.current[(i + 1) % 6];
  if (!a || !b) { v += 6; continue; }
  edgePositions[v++] = a.position.x; edgePositions[v++] = a.position.y; edgePositions[v++] = 0;
  edgePositions[v++] = b.position.x; edgePositions[v++] = b.position.y; edgePositions[v++] = 0;
}
// 6 inner-to-outer edges: inner[i] → outer[i] (matched by index — same angular spacing)
for (let i = 0; i < 6; i++) {
  const inner = innerNodeRefs.current[i];
  // Outer ring has 8 nodes; nearest outer to inner[i] is outer[Math.round(i * 8/6) % 8]
  const outerIdx = Math.round(i * 8 / 6) % 8;
  const outer = outerNodeRefs.current[outerIdx];
  if (!inner || !outer) { v += 6; continue; }
  edgePositions[v++] = inner.position.x; edgePositions[v++] = inner.position.y; edgePositions[v++] = 0;
  edgePositions[v++] = outer.position.x; edgePositions[v++] = outer.position.y; edgePositions[v++] = 0;
}
edgeGeo.attributes.position.needsUpdate = true;
```

---

### Scene 5: Solder — Dense Cluster + Tendrils

**Does NOT use `NetworkGraph`.** Custom component with dynamic node positions.

**Core cluster (5 nodes, static base positions, dynamic jitter):**

Define base positions as a constant array so `useFrame` can reference them by index:
```tsx
const CORE_BASES: [number, number, number][] = [
  [0,     0,     0   ], // hub (index 0)
  [0.25,  0.18,  0.1 ], // c1  (index 1)
  [-0.20, 0.22, -0.05], // c2  (index 2)
  [0.15, -0.20,  0.08], // c3  (index 3)
  [-0.18,-0.15,  0.12], // c4  (index 4)
];
const CORE_PHASES = [0, 0.7, 1.4, 2.1, 2.8]; // per-node phase offsets
```

In `useFrame`, `basePos` for core node `i` is `CORE_BASES[i]`.

**6 tendril chains:** 2 tendrils start from the hub (at opposite angles), 1 tendril each from c1–c4:

| Tendril | Origin | Angle (rad) | Z offset |
|---|---|---|---|
| T0 | hub | 0 | 0.1 |
| T1 | hub | π | -0.1 |
| T2 | c1 | π/4 | 0.15 |
| T3 | c2 | 3π/4 | -0.05 |
| T4 | c3 | 5π/4 | 0.1 |
| T5 | c4 | 7π/4 | -0.1 |

Each tendril: `tip1` at direction × 0.9, radius 0.045, color: `#ff8c5a`. `tip2` at direction × 1.7, radius 0.025, color: `#cc5528`.

**`basePos` definition for tendril tip animation:** Store the tip node's own initial rest position (the constant offset from center, computed once at construction time) in a `baseTip1Positions` and `baseTip2Positions` array alongside the tendril definitions:
```tsx
const tendrils = useMemo(() => [
  // T0: hub, angle=0, zOffset=0.1
  { originIdx: 0 /* hub */, angle: 0,          z: 0.1  },
  { originIdx: 0 /* hub */, angle: Math.PI,    z: -0.1 },
  { originIdx: 1 /* c1  */, angle: Math.PI/4,  z: 0.15 },
  { originIdx: 2 /* c2  */, angle: 3*Math.PI/4,z: -0.05},
  { originIdx: 3 /* c3  */, angle: 5*Math.PI/4,z: 0.1  },
  { originIdx: 4 /* c4  */, angle: 7*Math.PI/4,z: -0.1 },
].map((t, i) => {
  const dx = Math.cos(t.angle); const dy = Math.sin(t.angle);
  return {
    ...t,
    phase: i * 1.05,
    tip1Base: [dx * 0.9, dy * 0.9, t.z] as [number, number, number], // rest position for tip1
    tip2Base: [dx * 1.7, dy * 1.7, t.z] as [number, number, number], // rest position for tip2
  };
}), []);
```

In `useFrame`, `basePos` for tip1 of tendril `i` is `tendrils[i].tip1Base`; for tip2 it is `tendrils[i].tip2Base`.

**Core jitter (in `useFrame`):** Each core node oscillates with high-frequency, small amplitude:
```tsx
coreRefs.current[i].position.x = basePos.x + Math.sin(t * 3.5 + phase) * 0.02;
coreRefs.current[i].position.y = basePos.y + Math.cos(t * 3.5 + phase * 1.3) * 0.02;
```

**Tendril tip animation (in `useFrame`):**
```tsx
// tip1
tip1Refs.current[i].position.x = basePos.x + Math.sin(t * 1.2 + phase) * 0.08;
tip1Refs.current[i].position.y = basePos.y + Math.cos(t * 1.0 + phase) * 0.08;
// tip2
tip2Refs.current[i].position.x = basePos.x + Math.sin(t * 0.8 + phase * 0.7) * 0.15;
tip2Refs.current[i].position.y = basePos.y + Math.cos(t * 0.7 + phase * 0.7) * 0.15;
```

**Edge geometry:** Pre-allocate for all edges:
- Core fully connected: 5 nodes → 10 edges → 20 vertices
- 6 tendril chains × 2 segments each: 12 edges → 24 vertices
- Total: 44 vertices → `Float32Array(132)` (44 × 3)

Mutate in `useFrame` from current mesh positions. Set `geometry.attributes.position.needsUpdate = true`.

**Glow rings on hub:** 2 concentric `<ringGeometry>` meshes at radius 0.3–0.4 and 0.5–0.65, `opacity: 0.15` and `0.07`.

---

## Files to Modify

| File | Changes |
|---|---|
| `src/app/globals.css` | Add `--bg-primary-rgb` to dark and light mode blocks |
| `src/components/sections/HeroSection.tsx` | Replace two-column grid with position:relative container; add scene wrapper (absolute) + gradient mask; update loading fallback to transparent bg |
| `src/components/three/HeroScene.tsx` | Full rewrite: 120 individual node meshes with ref array, LineSegments edges, mouse parallax, slow drift, ambient particles. No hemisphereLight. |
| `src/components/three/SolverScene.tsx` | Full rewrite: NetworkGraph component (used by Scenes 1–2) + 5 topology components (Scenes 1–2 via NetworkGraph; Scenes 3–5 render nodes directly) + updated SceneManager |
| `src/components/sections/SolverSection.tsx` | Remove tab buttons, sceneSteps, handleStepClick, intervalRef; replace with simplified auto-cycle |

---

## What Is NOT Changing

- `section-wrapper` / `section-num-col` / `section-divider-line` / `section-content-col` shell in HeroSection
- `.hero-3d-container` class name (GSAP targets it)
- GSAP `.hero-animate` reveal animation
- GSAP `.hero-3d-container` x-reveal and y parallax animations
- Solver GSAP `.solver-3d-wrap` animation
- SolverScene `activeScene: number` prop interface
- All section content: headings, body text, trait tags, CTAs, scroll indicator
- Color tokens, typography, button styles, cards, navbar, footer
- `next/font` setup
- Mobile responsiveness
- ChatWidget, contact form, testimonials
