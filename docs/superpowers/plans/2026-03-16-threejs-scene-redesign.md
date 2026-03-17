# Three.js Scene Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace both Three.js scenes with a unified Network/Constellation aesthetic — orange glowing node graphs — and update the hero layout so the scene bleeds cinematically into the text.

**Architecture:** HeroScene becomes a large 120-node network that bleeds from the right with a CSS gradient mask; SolverScene replaces 5 themed objects with 5 thematic network topologies that morph via opacity cross-fade. Both use individual `<mesh>` elements (not instanced) with per-mesh ref arrays for animation. Scenes 3–5 render nodes/edges directly for per-mesh ref access; Scenes 1–2 use a shared `NetworkGraph` helper.

**Tech Stack:** React Three Fiber (`@react-three/fiber`), `@react-three/drei` (Float), `three.js` (BufferGeometry, LineBasicMaterial, LineDashedMaterial), Next.js dynamic import, GSAP (unchanged).

**Spec:** `docs/superpowers/specs/2026-03-16-threejs-scene-redesign.md`

**No unit tests exist for Three.js components in this project.** Verification = `npm run build` (TypeScript + Next.js compilation) plus visual inspection in browser.

---

## Chunk 1: CSS Token + Hero Layout

### Task 1: Add `--bg-primary-rgb` CSS variable

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the variable to both theme blocks**

Open `src/app/globals.css`. Find the `[data-theme="dark"]` block and add inside it:
```css
--bg-primary-rgb: 13, 13, 13;
```

Find the `[data-theme="light"]` block and add inside it:
```css
--bg-primary-rgb: 250, 246, 239;
```

**Format contract:** Value is a bare comma-separated RGB triplet — no `rgb()` wrapper — so it can be used as `rgba(var(--bg-primary-rgb), 0.7)` directly in CSS and inline styles.

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/estebanacuna/Sites/full-stack-personal-portfolio
npm run build
```
Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add --bg-primary-rgb CSS token for hero gradient mask"
```

---

### Task 2: Update HeroSection layout

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

Current structure inside `section-content-col`:
```tsx
<div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center"
  style={{ padding: '0 var(--space-2xl)', gap: 'var(--space-3xl)' }}>
  <div className="z-[2]">{/* text content */}</div>
  <div className="hero-3d-container w-full h-[500px] lg:h-[500px] opacity-0 relative">
    <HeroScene />
  </div>
</div>
```

Target structure: Remove the grid. The `hero-3d-container` becomes absolutely positioned, bleeding from the right. A gradient mask fades it toward the text.

- [ ] **Step 1: Update the dynamic loading fallback**

Find the `dynamic()` call at the top of the file. Replace the entire loading callback:

```tsx
// BEFORE:
loading: () => (
  <div
    className="w-full h-full flex items-center justify-center"
    style={{ background: 'var(--bg-secondary)', borderRadius: '16px' }}
  >
    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '14px' }}>
      Loading 3D...
    </span>
  </div>
),

// AFTER:
loading: () => (
  <div
    className="w-full h-full flex items-center justify-center"
    style={{ background: 'transparent' }}
  >
    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '14px' }}>
      Loading 3D...
    </span>
  </div>
),
```

Only change: remove `borderRadius: '16px'` and change `background` to `'transparent'`. The `<span>` child is preserved unchanged.

- [ ] **Step 2a: Edit the wrapper div — remove grid classes**

Find the wrapper div on line 92 (the `max-w-[1400px]` div):

```tsx
// BEFORE:
<div
  className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center"
  style={{ padding: '0 var(--space-2xl)', gap: 'var(--space-3xl)' }}
>

// AFTER:
<div
  className="w-full max-w-[1400px] mx-auto"
  style={{ padding: '0 var(--space-2xl)', gap: 'var(--space-3xl)', position: 'relative', overflow: 'hidden' }}
>
```

Changes: remove `grid grid-cols-1 lg:grid-cols-2 items-center` from className; add `position: 'relative', overflow: 'hidden'` to the existing style (keep `gap: 'var(--space-3xl)'` — has no visual effect without grid but spec retains it).

- [ ] **Step 2b: Replace the hero-3d-container div**

Find the existing hero-3d-container div and replace it:

```tsx
// BEFORE:
{/* Right: 3D Scene */}
<div className="hero-3d-container w-full h-[500px] lg:h-[500px] opacity-0 relative">
  <HeroScene />
</div>

// AFTER:
{/* 3D scene: absolutely positioned, bleeds from the right */}
<div
  className="hero-3d-container opacity-0"
  style={{
    position: 'absolute',
    right: 0,
    top: 0,
    height: 'calc(100vh - 80px)',
    minHeight: '600px',
    width: '80%',
    zIndex: 0,
  }}
>
  <HeroScene />
</div>
```

Changes: remove `w-full h-[500px] lg:h-[500px] relative` from className; add inline style block. Keep `hero-3d-container opacity-0` in className — GSAP targets `hero-3d-container` for x-reveal and y-parallax.

- [ ] **Step 2c: Add the gradient fade mask div**

Insert a new div immediately after the `hero-3d-container` closing tag (before `{/* Left: Content */}`):

```tsx
{/* Gradient fade mask: fades scene toward the text on the left */}
<div
  style={{
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '60%',
    background: 'linear-gradient(90deg, rgba(var(--bg-primary-rgb), 1) 0%, rgba(var(--bg-primary-rgb), 1) 35%, rgba(var(--bg-primary-rgb), 0.75) 60%, transparent 100%)',
    zIndex: 1,
    pointerEvents: 'none',
  }}
/>
```

- [ ] **Step 2d: Leave the text content div unchanged**

The `{/* Left: Content */}` div (`<div className="z-[2]">`) stays exactly as-is. Do not add any inline style. The `z-[2]` class is already present and ensures it sits above the gradient mask. All inner children (status badge, h1, tagline, subtitle, CTA buttons) are untouched.

**Do NOT change the `section-wrapper` / `section-num-col` / `section-divider-line` / `section-content-col` shell above this wrapper.**

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```
Expected: No TypeScript errors, no build failures.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```
Open http://localhost:3000. Verify:
- Hero text is visible on the left
- The 3D scene (glass torus / old scene) bleeds in from the right
- The gradient fade is visible between text and scene
- No layout shift visible

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: hero layout — 3D scene bleeds from right with gradient mask"
```

---

## Chunk 2: HeroScene Rewrite

### Task 3: Rewrite HeroScene.tsx

**Files:**
- Modify: `src/components/three/HeroScene.tsx`

Full rewrite. Remove: GlassTorus, WireframeIcosahedron, SmallSpheres, MouseFollower. Keep nothing from the existing file.

- [ ] **Step 1: Write the new HeroScene.tsx**

Replace the entire file with:

```tsx
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroNode {
  position: [number, number, number];
  radius: number;
  isHub: boolean;
  speed: number;
  phase: number;
  baseOpacity: number;
}

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

function HeroNetwork() {
  const groupRef = useRef<THREE.Group>(null!);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

  const nodes = useMemo<HeroNode[]>(() => {
    const result: HeroNode[] = [];
    // 3 hub nodes — central zone
    for (let i = 0; i < 3; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 1,
        ],
        radius: 0.08,
        isHub: true,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: 0.9,
      });
    }
    // 15 mid nodes
    for (let i = 0; i < 15; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
        ],
        radius: 0.05,
        isHub: false,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: 0.75,
      });
    }
    // 102 small nodes
    for (let i = 0; i < 102; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
        ],
        radius: 0.03,
        isHub: false,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: 0.55,
      });
    }
    return result;
  }, []);

  const edges = useMemo<[number, number][]>(() => {
    const pairs: { i: number; j: number; dist: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const [ax, ay, az] = nodes[i].position;
        const [bx, by, bz] = nodes[j].position;
        const dist = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2);
        if (dist < 3.5) pairs.push({ i, j, dist });
      }
    }
    pairs.sort((a, b) => a.dist - b.dist);
    return pairs.slice(0, 180).map(p => [p.i, p.j]);
  }, [nodes]);

  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      const pa = nodes[a].position;
      const pb = nodes[b].position;
      const v = i * 6;
      positions[v]     = pa[0]; positions[v + 1] = pa[1]; positions[v + 2] = pa[2];
      positions[v + 3] = pb[0]; positions[v + 4] = pb[1]; positions[v + 5] = pb[2];
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodes, edges]);

  const edgeMaterial = useRef(
    new THREE.LineBasicMaterial({ color: '#ff6b35', transparent: true, opacity: 0.35 })
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    edgeMaterial.current.opacity = 0.3 + Math.sin(t * 0.4) * 0.1;
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const node = nodes[i];
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = node.baseOpacity + Math.sin(t * node.speed + node.phase) * 0.25;
    });
    groupRef.current.rotation.y += (state.pointer.x * 0.3 - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.x += (-state.pointer.y * 0.2 - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += 0.0003;
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh
            ref={(el) => { nodeRefs.current[i] = el; }}
            position={node.position}
          >
            <sphereGeometry args={[node.radius, 12, 12]} />
            <meshStandardMaterial color="#ff6b35" transparent opacity={node.baseOpacity} />
          </mesh>
          {node.isHub && (
            <mesh position={node.position}>
              <ringGeometry args={[node.radius * 2.5, node.radius * 3.5, 32]} />
              <meshBasicMaterial
                color="#ff6b35"
                transparent
                opacity={0.12}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
      <lineSegments geometry={edgeGeometry} material={edgeMaterial.current} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-3, 2, 4]} intensity={0.5} color="#ff6b35" />
        <HeroNetwork />
        <Particles />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: No TypeScript errors. If there are TypeScript issues with `lineSegments` or `meshBasicMaterial`, these are R3F JSX elements — check that `@react-three/fiber` types are up to date.

- [ ] **Step 3: Visual check**

```bash
npm run dev
```
Open http://localhost:3000. In the hero section verify:
- Orange constellation network visible, bleeding in from the right
- Nodes pulse gently (opacity animation)
- Moving the mouse rotates the graph slightly
- Gradient masks the left edge, text is readable

- [ ] **Step 4: Commit**

```bash
git add src/components/three/HeroScene.tsx
git commit -m "feat: hero 3D — network constellation scene (120 nodes, 180 edges, mouse parallax)"
```

---

## Chunk 3: Solver Tab Removal + SolverScene Rewrite

### Task 4: Remove tab buttons from SolverSection

**Files:**
- Modify: `src/components/sections/SolverSection.tsx`

- [ ] **Step 1: Remove tab-related code**

Remove these declarations near the top of the component:
```tsx
// DELETE these:
const sceneSteps = [
  { label: '🔧 Auto', id: 0 },
  { label: '⚡ Electronics', id: 1 },
  { label: '💻 Code', id: 2 },
  { label: '🔌 PCB', id: 3 },
  { label: '🔥 Solder', id: 4 },
];
```

Remove the `handleStepClick` function entirely:
```tsx
// DELETE:
const handleStepClick = (id: number) => {
  setActiveScene(id);
  if (intervalRef.current) clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    setActiveScene((prev) => (prev + 1) % sceneSteps.length);
  }, 3000);
};
```

Remove `intervalRef`:
```tsx
// DELETE:
const intervalRef = useRef<NodeJS.Timeout | null>(null);
```

Replace the auto-cycle `useEffect` with a simplified version:
```tsx
// REPLACE the existing auto-cycle useEffect with:
useEffect(() => {
  const id = setInterval(() => setActiveScene(p => (p + 1) % 5), 3000);
  return () => clearInterval(id);
}, []);
```

- [ ] **Step 2: Remove the tab button row from JSX**

Find and remove the entire tab button div inside the `solver-3d-wrap`:
```tsx
// DELETE this entire block (the absolute-positioned tabs div):
<div
  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center z-[2]"
  style={{ gap: 'var(--space-sm)' }}
>
  {sceneSteps.map((step) => (
    <button
      key={step.id}
      onClick={() => handleStepClick(step.id)}
      // ...
    >
      {step.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Clean up unused imports**

Remove `useRef` from imports if it's no longer used (check — `sectionRef` still uses it for GSAP, so keep it). The `NodeJS.Timeout` type reference is gone with `intervalRef`.

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```
Expected: No TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/SolverSection.tsx
git commit -m "feat: solver section — remove tab buttons, scene auto-cycles silently"
```

---

### Task 5: Rewrite SolverScene.tsx

**Files:**
- Modify: `src/components/three/SolverScene.tsx`

Full rewrite. All 5 existing scene components replaced. `SceneManager` updated. New scenes: GearScene (NetworkGraph), ElectronicsScene (direct), CodeScene (direct), PCBScene (direct + dynamic buffer), SolderScene (direct + dynamic buffer).

- [ ] **Step 1: Write the new SolverScene.tsx**

Replace the entire file content with:

```tsx
'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Shared types ─────────────────────────────────────────────────────────────

interface NodeDef {
  position: [number, number, number];
  radius: number;
  color?: string;
  isHub?: boolean;
}
interface EdgeDef { from: number; to: number; }

// ─── NetworkGraph (used by GearScene only) ────────────────────────────────────

function NetworkGraph({
  nodes, edges, opacity,
}: { nodes: NodeDef[]; edges: EdgeDef[]; opacity: number }) {
  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
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
  }, [nodes, edges]);

  return (
    <>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.position}>
            <sphereGeometry args={[node.radius, 12, 12]} />
            <meshStandardMaterial
              color={node.color ?? '#ff6b35'}
              transparent
              opacity={opacity}
            />
          </mesh>
          {node.isHub && (
            <mesh position={node.position}>
              <ringGeometry args={[node.radius * 2.5, node.radius * 3.5, 32]} />
              <meshBasicMaterial
                color="#ff6b35"
                transparent
                opacity={opacity * 0.12}
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

// ─── Scene 1: Gear-Ring ───────────────────────────────────────────────────────

function GearScene({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  const nodes = useMemo<NodeDef[]>(() => {
    const result: NodeDef[] = [{ position: [0, 0, 0], radius: 0.12, isHub: true }];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      result.push({ position: [Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0], radius: 0.07 });
    }
    return result;
  }, []);

  const edges = useMemo<EdgeDef[]>(() => {
    const result: EdgeDef[] = [];
    for (let i = 1; i <= 8; i++) result.push({ from: i, to: 0 });         // spokes
    for (let i = 1; i <= 8; i++) result.push({ from: i, to: (i % 8) + 1 }); // ring
    return result;
  }, []);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.z += 0.003;
  });

  return (
    <group ref={groupRef}>
      <NetworkGraph nodes={nodes} edges={edges} opacity={opacity} />
    </group>
  );
}

// ─── Scene 2: Electronics Grid ────────────────────────────────────────────────

function ElectronicsScene({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null!);

  const nodes = useMemo<NodeDef[]>(() => {
    const result: NodeDef[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        result.push({
          position: [(col - 1) * 0.8, (row - 1) * 0.8, 0],
          radius: row === 1 && col === 1 ? 0.10 : 0.06,
          isHub: row === 1 && col === 1,
        });
      }
    }
    return result;
  }, []);

  const edges = useMemo<EdgeDef[]>(() => {
    const result: EdgeDef[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (col < 2) result.push({ from: row * 3 + col, to: row * 3 + col + 1 });
        if (row < 2) result.push({ from: row * 3 + col, to: (row + 1) * 3 + col });
      }
    }
    return result;
  }, []);

  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
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
  }, [nodes, edges]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = (0.35 + Math.sin(t * 1.2) * 0.1) * opacity;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.position}>
            <sphereGeometry args={[node.radius, 12, 12]} />
            <meshStandardMaterial color="#ff6b35" transparent opacity={opacity} />
          </mesh>
          {node.isHub && (
            <mesh position={node.position}>
              <ringGeometry args={[node.radius * 2.5, node.radius * 3.5, 32]} />
              <meshBasicMaterial
                color="#ff6b35" transparent opacity={opacity * 0.12} side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial ref={edgeMatRef} color="#ff6b35" transparent opacity={opacity * 0.35} />
      </lineSegments>
    </group>
  );
}

// ─── Scene 3: Code Dependency Tree ───────────────────────────────────────────

interface CodeNode extends NodeDef { level: number; baseY: number; phase: number; }

const CODE_NODES: CodeNode[] = [
  { position: [0,     1.5,  0], radius: 0.10, isHub: true,        level: 0, baseY:  1.5, phase: 0.0 },
  { position: [-0.9,  0.5,  0], radius: 0.07,                     level: 1, baseY:  0.5, phase: 0.5 },
  { position: [ 0.9,  0.5,  0], radius: 0.07,                     level: 1, baseY:  0.5, phase: 1.0 },
  { position: [-1.4, -0.5,  0], radius: 0.055,                    level: 2, baseY: -0.5, phase: 0.3 },
  { position: [-0.4, -0.5,  0], radius: 0.055,                    level: 2, baseY: -0.5, phase: 0.8 },
  { position: [ 0.4, -0.5,  0], radius: 0.055,                    level: 2, baseY: -0.5, phase: 1.3 },
  { position: [ 1.4, -0.5,  0], radius: 0.055,                    level: 2, baseY: -0.5, phase: 1.8 },
  { position: [-1.6, -1.5,  0], radius: 0.04, color: '#cc5528',   level: 3, baseY: -1.5, phase: 0.2 },
  { position: [-0.6, -1.5,  0], radius: 0.04, color: '#cc5528',   level: 3, baseY: -1.5, phase: 0.7 },
  { position: [ 0.6, -1.5,  0], radius: 0.04, color: '#cc5528',   level: 3, baseY: -1.5, phase: 1.2 },
  { position: [ 1.6, -1.5,  0], radius: 0.04, color: '#cc5528',   level: 3, baseY: -1.5, phase: 1.7 },
];

const CODE_EDGES: EdgeDef[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 5 }, { from: 2, to: 6 },
  { from: 3, to: 7 }, { from: 4, to: 8 }, { from: 5, to: 9 }, { from: 6, to: 10 },
];

function CodeScene({ opacity }: { opacity: number }) {
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dashMatRef = useRef(
    new THREE.LineDashedMaterial({
      color: '#ff6b35', dashSize: 0.1, gapSize: 0.08, transparent: true, opacity: 0.3,
    })
  );

  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(CODE_EDGES.length * 6);
    CODE_EDGES.forEach(({ from, to }, i) => {
      const a = CODE_NODES[from].position;
      const b = CODE_NODES[to].position;
      const v = i * 6;
      positions[v]     = a[0]; positions[v + 1] = a[1]; positions[v + 2] = a[2];
      positions[v + 3] = b[0]; positions[v + 4] = b[1]; positions[v + 5] = b[2];
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Dashed cross-link between L3[1] (index 4) and L3[2] (index 5)
  const dashGeometry = useMemo(() => {
    const positions = new Float32Array([-0.4, -0.5, 0, 0.4, -0.5, 0]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.computeLineDistances(); // required — without this, LineDashedMaterial renders solid
    return geo;
  }, []);

  const dashLine = useMemo(
    () => new THREE.Line(dashGeometry, dashMatRef.current),
    [dashGeometry]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    dashMatRef.current.opacity = opacity * 0.3;
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const n = CODE_NODES[i];
      mesh.position.y = n.baseY + Math.sin(t * 0.8 + n.level * 1.2 + n.phase) * 0.05;
    });
  });

  return (
    <>
      {CODE_NODES.map((node, i) => (
        <group key={i}>
          <mesh
            ref={(el) => { nodeRefs.current[i] = el; }}
            position={[node.position[0], node.position[1], node.position[2]]}
          >
            <sphereGeometry args={[node.radius, 12, 12]} />
            <meshStandardMaterial
              color={node.color ?? '#ff6b35'} transparent opacity={opacity}
            />
          </mesh>
          {node.isHub && (
            <mesh position={node.position}>
              <ringGeometry args={[node.radius * 2.5, node.radius * 3.5, 32]} />
              <meshBasicMaterial
                color="#ff6b35" transparent opacity={opacity * 0.12} side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="#ff6b35" transparent opacity={opacity * 0.4} />
      </lineSegments>
      <primitive object={dashLine} />
    </>
  );
}

// ─── Scene 4: PCB Radial ──────────────────────────────────────────────────────

function PCBScene({ opacity }: { opacity: number }) {
  const innerNodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const outerNodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const innerAngle = useRef(0);
  const outerAngle = useRef(0);

  // Pre-allocated edge buffer: 18 edges × 2 verts × 3 floats = 108 floats
  const edgePositions = useMemo(() => new Float32Array(108), []);
  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    return g;
  }, [edgePositions]);

  const innerBaseAngles = useMemo(
    () => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2),
    []
  );
  const outerBaseAngles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2),
    []
  );

  useFrame(() => {
    innerAngle.current += 0.0008;
    outerAngle.current -= 0.0005;

    innerNodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const a = innerBaseAngles[i] + innerAngle.current;
      mesh.position.x = Math.cos(a) * 0.9;
      mesh.position.y = Math.sin(a) * 0.9;
    });
    outerNodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const a = outerBaseAngles[i] + outerAngle.current;
      mesh.position.x = Math.cos(a) * 1.65;
      mesh.position.y = Math.sin(a) * 1.65;
    });

    // Rebuild edge buffer — advance v by 6 on null refs to keep alignment
    let v = 0;
    for (let i = 0; i < 6; i++) {
      const inner = innerNodeRefs.current[i];
      if (!inner) { v += 6; continue; }
      edgePositions[v++] = 0;              edgePositions[v++] = 0;              edgePositions[v++] = 0;
      edgePositions[v++] = inner.position.x; edgePositions[v++] = inner.position.y; edgePositions[v++] = 0;
    }
    for (let i = 0; i < 6; i++) {
      const a = innerNodeRefs.current[i];
      const b = innerNodeRefs.current[(i + 1) % 6];
      if (!a || !b) { v += 6; continue; }
      edgePositions[v++] = a.position.x; edgePositions[v++] = a.position.y; edgePositions[v++] = 0;
      edgePositions[v++] = b.position.x; edgePositions[v++] = b.position.y; edgePositions[v++] = 0;
    }
    for (let i = 0; i < 6; i++) {
      const inner = innerNodeRefs.current[i];
      const outerIdx = Math.round(i * 8 / 6) % 8;
      const outer = outerNodeRefs.current[outerIdx];
      if (!inner || !outer) { v += 6; continue; }
      edgePositions[v++] = inner.position.x; edgePositions[v++] = inner.position.y; edgePositions[v++] = 0;
      edgePositions[v++] = outer.position.x; edgePositions[v++] = outer.position.y; edgePositions[v++] = 0;
    }
    edgeGeo.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {/* Hub */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#ff6b35" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.3, 0.42, 32]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={opacity * 0.12} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner ring */}
      {innerBaseAngles.map((a, i) => (
        <mesh
          key={`inner-${i}`}
          ref={(el) => { innerNodeRefs.current[i] = el; }}
          position={[Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0]}
        >
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#ff6b35" transparent opacity={opacity} />
        </mesh>
      ))}
      {/* Outer ring */}
      {outerBaseAngles.map((a, i) => (
        <mesh
          key={`outer-${i}`}
          ref={(el) => { outerNodeRefs.current[i] = el; }}
          position={[Math.cos(a) * 1.65, Math.sin(a) * 1.65, 0]}
        >
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#ff8c5a" transparent opacity={opacity * 0.8} />
        </mesh>
      ))}
      {/* Dynamic edge buffer */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#ff6b35" transparent opacity={opacity * 0.35} />
      </lineSegments>
    </>
  );
}

// ─── Scene 5: Solder Cluster ──────────────────────────────────────────────────

const CORE_BASES: [number, number, number][] = [
  [0,      0,      0   ],
  [0.25,   0.18,   0.1 ],
  [-0.20,  0.22,  -0.05],
  [0.15,  -0.20,   0.08],
  [-0.18, -0.15,   0.12],
];
const CORE_PHASES = [0, 0.7, 1.4, 2.1, 2.8];
const CORE_RADII  = [0.13, 0.08, 0.07, 0.08, 0.06];

const TENDRIL_DEFS = ([
  { originIdx: 0, angle: 0,                  z:  0.10 },
  { originIdx: 0, angle: Math.PI,             z: -0.10 },
  { originIdx: 1, angle: Math.PI / 4,         z:  0.15 },
  { originIdx: 2, angle: 3 * Math.PI / 4,     z: -0.05 },
  { originIdx: 3, angle: 5 * Math.PI / 4,     z:  0.10 },
  { originIdx: 4, angle: 7 * Math.PI / 4,     z: -0.10 },
] as const).map((t, i) => {
  const dx = Math.cos(t.angle);
  const dy = Math.sin(t.angle);
  return {
    originIdx: t.originIdx,
    phase: i * 1.05,
    tip1Base: [dx * 0.9, dy * 0.9, t.z] as [number, number, number],
    tip2Base: [dx * 1.7, dy * 1.7, t.z] as [number, number, number],
  };
});

function SolderScene({ opacity }: { opacity: number }) {
  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tip1Refs = useRef<(THREE.Mesh | null)[]>([]);
  const tip2Refs = useRef<(THREE.Mesh | null)[]>([]);

  // 10 core edges + 6 tendrils × 2 segments = 22 edges → 44 vertices → 132 floats
  const edgePositions = useMemo(() => new Float32Array(132), []);
  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    return g;
  }, [edgePositions]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    coreRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const base = CORE_BASES[i];
      const ph = CORE_PHASES[i];
      mesh.position.x = base[0] + Math.sin(t * 3.5 + ph) * 0.02;
      mesh.position.y = base[1] + Math.cos(t * 3.5 + ph * 1.3) * 0.02;
    });

    TENDRIL_DEFS.forEach((tendril, i) => {
      const { tip1Base, tip2Base, phase: ph } = tendril;
      const t1 = tip1Refs.current[i];
      const t2 = tip2Refs.current[i];
      if (t1) {
        t1.position.x = tip1Base[0] + Math.sin(t * 1.2 + ph) * 0.08;
        t1.position.y = tip1Base[1] + Math.cos(t * 1.0 + ph) * 0.08;
      }
      if (t2) {
        t2.position.x = tip2Base[0] + Math.sin(t * 0.8 + ph * 0.7) * 0.15;
        t2.position.y = tip2Base[1] + Math.cos(t * 0.7 + ph * 0.7) * 0.15;
      }
    });

    let v = 0;
    // Core fully connected: 10 edges
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        const a = coreRefs.current[i];
        const b = coreRefs.current[j];
        if (!a || !b) { v += 6; continue; }
        edgePositions[v++] = a.position.x; edgePositions[v++] = a.position.y; edgePositions[v++] = a.position.z;
        edgePositions[v++] = b.position.x; edgePositions[v++] = b.position.y; edgePositions[v++] = b.position.z;
      }
    }
    // Tendril chains: hub→tip1, tip1→tip2 (6 tendrils × 2 = 12 edges)
    TENDRIL_DEFS.forEach((tendril, i) => {
      const hub = coreRefs.current[tendril.originIdx];
      const t1  = tip1Refs.current[i];
      const t2  = tip2Refs.current[i];
      if (hub && t1) {
        edgePositions[v++] = hub.position.x; edgePositions[v++] = hub.position.y; edgePositions[v++] = hub.position.z;
        edgePositions[v++] = t1.position.x;  edgePositions[v++] = t1.position.y;  edgePositions[v++] = t1.position.z;
      } else { v += 6; }
      if (t1 && t2) {
        edgePositions[v++] = t1.position.x; edgePositions[v++] = t1.position.y; edgePositions[v++] = t1.position.z;
        edgePositions[v++] = t2.position.x; edgePositions[v++] = t2.position.y; edgePositions[v++] = t2.position.z;
      } else { v += 6; }
    });
    edgeGeo.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {CORE_BASES.map((base, i) => (
        <mesh key={`core-${i}`} ref={(el) => { coreRefs.current[i] = el; }} position={[...base]}>
          <sphereGeometry args={[CORE_RADII[i], 12, 12]} />
          <meshStandardMaterial color="#ff6b35" transparent opacity={opacity} />
        </mesh>
      ))}
      {/* Hub glow rings */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.30, 0.40, 32]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={opacity * 0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.50, 0.65, 32]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={opacity * 0.07} side={THREE.DoubleSide} />
      </mesh>
      {/* Tendril tips */}
      {TENDRIL_DEFS.map((t, i) => (
        <group key={`tendril-${i}`}>
          <mesh ref={(el) => { tip1Refs.current[i] = el; }} position={[...t.tip1Base]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#ff8c5a" transparent opacity={opacity * 0.8} />
          </mesh>
          <mesh ref={(el) => { tip2Refs.current[i] = el; }} position={[...t.tip2Base]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#cc5528" transparent opacity={opacity * 0.6} />
          </mesh>
        </group>
      ))}
      {/* Edge buffer */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#ff6b35" transparent opacity={opacity * 0.4} />
      </lineSegments>
    </>
  );
}

// ─── SceneManager ─────────────────────────────────────────────────────────────

const SCENE_COMPONENTS = [GearScene, ElectronicsScene, CodeScene, PCBScene, SolderScene];

function SceneManager({ activeScene }: { activeScene: number }) {
  const [currentOpacities, setCurrentOpacities] = useState<number[]>(
    SCENE_COMPONENTS.map((_, i) => (i === 0 ? 1 : 0))
  );
  const targetOpacities = useRef<number[]>(
    SCENE_COMPONENTS.map((_, i) => (i === 0 ? 1 : 0))
  );

  useEffect(() => {
    targetOpacities.current = SCENE_COMPONENTS.map((_, i) => (i === activeScene ? 1 : 0));
  }, [activeScene]);

  useFrame(() => {
    setCurrentOpacities((prev) =>
      prev.map((o, i) => o + (targetOpacities.current[i] - o) * 0.05)
    );
  });

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
      {SCENE_COMPONENTS.map((Scene, i) => {
        const opacity = currentOpacities[i];
        if (opacity < 0.01) return null;
        return (
          <group key={i}>
            <Scene opacity={opacity} />
          </group>
        );
      })}
    </Float>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

interface SolverSceneProps { activeScene: number; }

export default function SolverScene({ activeScene }: SolverSceneProps) {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 5]} intensity={0.7} />
        <pointLight position={[-2, 1, 3]} intensity={0.4} color="#ff6b35" />
        <hemisphereLight args={['#ffffff', '#444444', 0.5]} />
        <SceneManager activeScene={activeScene} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: No TypeScript errors. Common issues to watch for:
- `<primitive object={dashLine} />` — ensure `dashLine` is typed as `THREE.Line`
- `TENDRIL_DEFS` spread `[...t.tip1Base]` — TypeScript should infer `[number, number, number]` correctly; if not, cast as `[number, number, number]`
- `<hemisphereLight args={...}>` — if TypeScript complains, cast as `any` or check R3F drei version

- [ ] **Step 3: Visual check of all 5 solver scenes**

```bash
npm run dev
```
Open http://localhost:3000 and scroll to the Problem Solver section. Verify:
- No tab buttons visible
- Scene auto-cycles every 3 seconds
- Each scene morphs smoothly (opacity cross-fade, no hard cuts)
- Gear scene: rotating ring of nodes with spokes
- Electronics: 3×3 grid, edge pulse visible
- Code: tree topology with bobbing nodes, dashed cross-link between level-3 siblings
- PCB: inner + outer rings counter-rotating
- Solder: dense cluster with animated tendril tips

- [ ] **Step 4: Commit**

```bash
git add src/components/three/SolverScene.tsx
git commit -m "feat: solver 3D — 5 thematic network topologies with opacity morphing"
```

---

### Task 6: Final build and verification

- [ ] **Step 1: Full production build**

```bash
npm run build
```
Expected: Build completes with exit code 0. No TypeScript errors. Note any warnings but do not block on warnings.

- [ ] **Step 2: Visual smoke test**

```bash
npm run dev
```
Check each of these:
- [ ] Hero: constellation network visible, bleeds from right, gradient mask visible, text readable
- [ ] Hero: mouse movement creates parallax rotation
- [ ] Solver: scene auto-cycles, no tab buttons
- [ ] Solver: 5 scenes visually distinct and morph smoothly
- [ ] Light mode (toggle theme): gradient mask uses warm paper color correctly
- [ ] Mobile breakpoint: scenes still render within their containers
- [ ] No console errors in browser DevTools

- [ ] **Step 3: Commit final state**

```bash
git add -A
git status  # verify nothing unexpected
git commit -m "feat: Three.js scene redesign — network/constellation aesthetic complete"
```
