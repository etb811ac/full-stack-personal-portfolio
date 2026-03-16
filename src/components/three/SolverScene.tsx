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

  // Dashed cross-link between L2[1] (index 4) and L2[2] (index 5)
  const dashGeometry = useMemo(() => {
    const positions = new Float32Array([-0.4, -0.5, 0, 0.4, -0.5, 0]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const dashLine = useMemo(() => {
    const line = new THREE.Line(dashGeometry, dashMatRef.current);
    line.computeLineDistances(); // required — without this, LineDashedMaterial renders solid
    return line;
  }, [dashGeometry]);

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
      edgePositions[v++] = 0;               edgePositions[v++] = 0;               edgePositions[v++] = 0;
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
