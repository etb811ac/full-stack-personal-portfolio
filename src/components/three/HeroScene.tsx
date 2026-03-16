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
  const driftAngle = useRef(0);
  const parallaxY = useRef(0);
  const parallaxX = useRef(0);

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
    driftAngle.current = (driftAngle.current + 0.0003) % (Math.PI * 2);
    parallaxY.current += (state.pointer.x * 0.3 - parallaxY.current) * 0.02;
    parallaxX.current += (-state.pointer.y * 0.2 - parallaxX.current) * 0.02;
    groupRef.current.rotation.y = driftAngle.current + parallaxY.current;
    groupRef.current.rotation.x = parallaxX.current;
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
