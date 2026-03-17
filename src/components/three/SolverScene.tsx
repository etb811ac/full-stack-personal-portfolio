'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Park position (parked nodes morph here and fade out) ─────────────────────

const PARK: [number, number, number] = [0, 0, 0.2];

// ─── 5 topology configurations ── target positions for all 17 nodes ────────────

const CONFIGS: [number, number, number][][] = [
  // 0: Ring / Gear ── hub + 8-node wheel, 8 parked
  [
    [0, 0, 0],
    [ 1.2,   0,     0], [ 0.849,  0.849, 0], [0,  1.2, 0], [-0.849,  0.849, 0],
    [-1.2,   0,     0], [-0.849, -0.849, 0], [0, -1.2, 0], [ 0.849, -0.849, 0],
    PARK, PARK, PARK, PARK, PARK, PARK, PARK, PARK,
  ],
  // 1: Grid / Electronics ── 3×3 grid, 8 parked
  [
    [-0.8,  0.8, 0], [0,  0.8, 0], [0.8,  0.8, 0],
    [-0.8,  0,   0], [0,  0,   0], [0.8,  0,   0],
    [-0.8, -0.8, 0], [0, -0.8, 0], [0.8, -0.8, 0],
    PARK, PARK, PARK, PARK, PARK, PARK, PARK, PARK,
  ],
  // 2: Tree / Code dependency ── 11 nodes, 6 parked
  [
    [0, 1.5, 0],
    [-0.9,  0.5, 0], [ 0.9,  0.5, 0],
    [-1.4, -0.5, 0], [-0.4, -0.5, 0], [0.4, -0.5, 0], [1.4, -0.5, 0],
    [-1.6, -1.5, 0], [-0.6, -1.5, 0], [0.6, -1.5, 0], [1.6, -1.5, 0],
    PARK, PARK, PARK, PARK, PARK, PARK,
  ],
  // 3: PCB Radial ── hub + 6 inner + 8 outer, 2 parked
  [
    [0, 0, 0],
    [ 0.9,   0,     0], [ 0.45,  0.779, 0], [-0.45,  0.779, 0],
    [-0.9,   0,     0], [-0.45, -0.779, 0], [ 0.45, -0.779, 0],
    [ 1.65,  0,     0], [ 1.167,  1.167, 0], [0,  1.65, 0], [-1.167,  1.167, 0],
    [-1.65,  0,     0], [-1.167, -1.167, 0], [0, -1.65, 0], [ 1.167, -1.167, 0],
    PARK, PARK,
  ],
  // 4: Cluster / Solder ── all 17 active
  [
    [0, 0, 0], [0.25, 0.18, 0.1], [-0.2, 0.22, -0.05], [0.15, -0.2, 0.08], [-0.18, -0.15, 0.12],
    [ 0.9,    0,      0.10], [-0.9,    0,     -0.10],
    [ 0.636,  0.636,  0.15], [-0.636,  0.636, -0.05],
    [-0.636, -0.636,  0.10], [ 0.636, -0.636, -0.10],
    [ 1.7,    0,      0.10], [-1.7,    0,     -0.10],
    [ 1.202,  1.202,  0.15], [-1.202,  1.202, -0.05],
    [-1.202, -1.202,  0.10], [ 1.202, -1.202, -0.10],
  ],
];

// ─── Edge lists per topology ──────────────────────────────────────────────────

const CONFIG_EDGES: [number, number][][] = [
  // 0: Ring ── 8 spokes + 8 ring = 16 edges
  [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
    [1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,1],
  ],
  // 1: Grid ── 12 edges
  [
    [0,1],[1,2],[3,4],[4,5],[6,7],[7,8],
    [0,3],[1,4],[2,5],[3,6],[4,7],[5,8],
  ],
  // 2: Tree ── 10 edges
  [
    [0,1],[0,2],
    [1,3],[1,4],[2,5],[2,6],
    [3,7],[4,8],[5,9],[6,10],
  ],
  // 3: PCB Radial ── 20 edges
  [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],
    [1,7],[2,8],[3,9],[4,11],[5,12],[6,14],
    [7,8],[9,10],[10,11],[13,14],
  ],
  // 4: Cluster ── 10 core + 12 tendril = 22 edges
  [
    [0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[2,4],[3,4],[1,4],[2,3],
    [0,5],[5,11],[0,6],[6,12],[1,7],[7,13],[2,8],[8,14],[3,9],[9,15],[4,10],[10,16],
  ],
];

// ─── Node sizes ───────────────────────────────────────────────────────────────

const NODE_RADII = [
  0.12,
  0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08,
  0.06, 0.06, 0.06, 0.06, 0.06, 0.06,
  0.05, 0.05,
];

// ─── MorphingScene ────────────────────────────────────────────────────────────

const MAX_EDGES = 22;

function MorphingScene({ activeScene }: { activeScene: number }) {
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null!);
  const hubRingRef = useRef<THREE.Mesh>(null!);
  const activeSceneRef = useRef(activeScene);
  activeSceneRef.current = activeScene;

  // Mutable lerped positions, seeded to config 0
  const lerpedPos = useRef<[number, number, number][]>(
    CONFIGS[0].map(p => [p[0], p[1], p[2]])
  );

  const edgePositions = useMemo(() => new Float32Array(MAX_EDGES * 6), []);
  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    return g;
  }, [edgePositions]);

  useFrame((state) => {
    const scene = activeSceneRef.current;
    const config = CONFIGS[scene];
    const edges = CONFIG_EDGES[scene];
    const t = state.clock.elapsedTime;

    // Lerp all 17 node positions toward target config
    for (let i = 0; i < 17; i++) {
      const target = config[i];
      const cur = lerpedPos.current[i];
      cur[0] += (target[0] - cur[0]) * 0.04;
      cur[1] += (target[1] - cur[1]) * 0.04;
      cur[2] += (target[2] - cur[2]) * 0.04;

      const mesh = nodeRefs.current[i];
      if (!mesh) continue;
      mesh.position.set(cur[0], cur[1], cur[2]);

      // Fade parked nodes out, active nodes in
      const isParked = config[i] === PARK;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const targetOpacity = isParked ? 0 : 0.85;
      mat.opacity += (targetOpacity - mat.opacity) * 0.05;
    }

    // Hub ring follows node 0
    if (hubRingRef.current) {
      const p = lerpedPos.current[0];
      hubRingRef.current.position.set(p[0], p[1], p[2]);
    }

    // Pulse edge opacity
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = 0.3 + Math.sin(t * 0.5) * 0.1;
    }

    // Rebuild edge buffer from current lerped positions
    let v = 0;
    for (let e = 0; e < MAX_EDGES; e++) {
      if (e < edges.length) {
        const [a, b] = edges[e];
        const pa = lerpedPos.current[a];
        const pb = lerpedPos.current[b];
        edgePositions[v++] = pa[0]; edgePositions[v++] = pa[1]; edgePositions[v++] = pa[2];
        edgePositions[v++] = pb[0]; edgePositions[v++] = pb[1]; edgePositions[v++] = pb[2];
      } else {
        edgePositions[v] = 0; edgePositions[v+1] = 0; edgePositions[v+2] = 0;
        edgePositions[v+3] = 0; edgePositions[v+4] = 0; edgePositions[v+5] = 0;
        v += 6;
      }
    }
    edgeGeo.attributes.position.needsUpdate = true;
  });

  return (
    <Float speed={1} rotationIntensity={0.06} floatIntensity={0.12}>
      <group>
        {/* Hub glow ring — tracks node 0 */}
        <mesh ref={hubRingRef} position={[0, 0, 0]}>
          <ringGeometry args={[0.26, 0.36, 32]} />
          <meshBasicMaterial color="#ff6b35" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>

        {/* 17 morphing nodes */}
        {Array.from({ length: 17 }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => { nodeRefs.current[i] = el; }}
            position={[...CONFIGS[0][i]]}
          >
            <sphereGeometry args={[NODE_RADII[i], 12, 12]} />
            <meshStandardMaterial color="#ff6b35" transparent opacity={0.85} />
          </mesh>
        ))}

        {/* Dynamic edge buffer */}
        <lineSegments geometry={edgeGeo}>
          <lineBasicMaterial ref={edgeMatRef} color="#ff6b35" transparent opacity={0.35} />
        </lineSegments>
      </group>
    </Float>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SolverScene({ activeScene }: { activeScene: number }) {
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
        <MorphingScene activeScene={activeScene} />
      </Canvas>
    </div>
  );
}
