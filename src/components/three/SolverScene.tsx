'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Abstract 3D representations for each "problem solver" scene
// 1. Auto/Wrench - Gear-like shape
// 2. Electronics - Circuit board / grid
// 3. Code - Matrix of floating cubes
// 4. PCB - Circular board with traces
// 5. Solder - Glowing point with tendrils

function GearShape({ opacity = 1 }: { opacity: number }) {
  const ref = useRef<THREE.Group>(null!);
  const teeth = 12;
  const toothPositions = useMemo(() => {
    return Array.from({ length: teeth }, (_, i) => {
      const angle = (i / teeth) * Math.PI * 2;
      return { x: Math.cos(angle) * 1.2, y: Math.sin(angle) * 1.2, angle };
    });
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[1, 0.15, 16, teeth * 2]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.3} transparent opacity={opacity} />
      </mesh>
      {toothPositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, 0]} rotation={[0, 0, pos.angle]}>
          <boxGeometry args={[0.15, 0.35, 0.15]} />
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 6]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.3} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function CircuitGrid({ opacity = 1 }: { opacity: number }) {
  const ref = useRef<THREE.Group>(null!);
  const nodes = useMemo(() => {
    const n: { x: number; y: number; z: number; size: number }[] = [];
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        if (Math.random() > 0.3) {
          n.push({ x: x * 0.5, y: y * 0.5, z: (Math.random() - 0.5) * 0.2, size: 0.04 + Math.random() * 0.06 });
        }
      }
    }
    return n;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {/* Grid lines */}
      {[-2, -1, 0, 1, 2].map((val) => (
        <group key={`grid-${val}`}>
          <mesh position={[0, val * 0.5, 0]}>
            <boxGeometry args={[2.5, 0.005, 0.005]} />
            <meshBasicMaterial color="#c8ff00" transparent opacity={opacity * 0.3} />
          </mesh>
          <mesh position={[val * 0.5, 0, 0]}>
            <boxGeometry args={[0.005, 2.5, 0.005]} />
            <meshBasicMaterial color="#c8ff00" transparent opacity={opacity * 0.3} />
          </mesh>
        </group>
      ))}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <mesh key={i} position={[n.x, n.y, n.z]}>
          <sphereGeometry args={[n.size, 8, 8]} />
          <meshStandardMaterial color="#c8ff00" emissive="#c8ff00" emissiveIntensity={0.3} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

function CodeMatrix({ opacity = 1 }: { opacity: number }) {
  const ref = useRef<THREE.Group>(null!);
  const cubes = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      pos: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2] as [number, number, number],
      size: 0.05 + Math.random() * 0.1,
      speed: 0.5 + Math.random() * 1.5,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const cube = cubes[i];
        if (cube && child) {
          child.position.y = cube.pos[1] + Math.sin(state.clock.elapsedTime * cube.speed + cube.offset) * 0.3;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {cubes.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#c8ff00' : '#888'}
            emissive={i % 3 === 0 ? '#c8ff00' : '#000'}
            emissiveIntensity={i % 3 === 0 ? 0.2 : 0}
            transparent
            opacity={opacity}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function PCBBoard({ opacity = 1 }: { opacity: number }) {
  const ref = useRef<THREE.Group>(null!);
  const traces = useMemo(() => {
    return Array.from({ length: 20 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.9;
      return {
        start: [Math.cos(angle) * r * 0.3, Math.sin(angle) * r * 0.3, 0] as [number, number, number],
        end: [Math.cos(angle) * r, Math.sin(angle) * r, 0] as [number, number, number],
        width: 0.01 + Math.random() * 0.02,
      };
    });
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {/* Board */}
      <mesh>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#1a3a1a" transparent opacity={opacity * 0.8} />
      </mesh>
      {/* Traces */}
      {traces.map((t, i) => {
        const mid = [(t.start[0] + t.end[0]) / 2, (t.start[1] + t.end[1]) / 2, 0.01] as [number, number, number];
        const length = Math.sqrt(Math.pow(t.end[0] - t.start[0], 2) + Math.pow(t.end[1] - t.start[1], 2));
        const angle = Math.atan2(t.end[1] - t.start[1], t.end[0] - t.start[0]);
        return (
          <mesh key={i} position={mid} rotation={[0, 0, angle]}>
            <boxGeometry args={[length, t.width, 0.005]} />
            <meshStandardMaterial color="#c8ff00" emissive="#c8ff00" emissiveIntensity={0.2} transparent opacity={opacity} />
          </mesh>
        );
      })}
      {/* Components */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={`comp-${i}`} position={[Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0.03]}>
            <boxGeometry args={[0.12, 0.08, 0.04]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
}

function SolderingScene({ opacity = 1 }: { opacity: number }) {
  const ref = useRef<THREE.Group>(null!);
  const sparkPositions = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      pos: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2] as [number, number, number],
      speed: 1 + Math.random() * 3,
    }));
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        if (sparkPositions[i] && child) {
          const t = state.clock.elapsedTime * sparkPositions[i].speed;
          child.position.x = sparkPositions[i].pos[0] + Math.sin(t) * 0.2;
          child.position.y = sparkPositions[i].pos[1] + Math.cos(t) * 0.2;
        }
      });
    }
  });

  return (
    <group>
      {/* Iron tip */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI * 0.25]}>
        <coneGeometry args={[0.08, 1.5, 8]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} transparent opacity={opacity} />
      </mesh>
      {/* Glow at tip */}
      <mesh position={[0.4, 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff4400"
          emissiveIntensity={1.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Sparks */}
      <group ref={ref}>
        {sparkPositions.map((s, i) => (
          <mesh key={i} position={[s.pos[0] * 0.5 + 0.4, s.pos[1] * 0.5 + 0.1, s.pos[2] * 0.5]}>
            <sphereGeometry args={[0.015, 4, 4]} />
            <meshStandardMaterial
              color="#ffaa00"
              emissive="#ff6600"
              emissiveIntensity={1}
              transparent
              opacity={opacity * 0.7}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SceneManager({ activeScene }: { activeScene: number }) {
  const scenes = [GearShape, CircuitGrid, CodeMatrix, PCBBoard, SolderingScene];
  const [currentOpacities, setCurrentOpacities] = useState<number[]>(scenes.map((_, i) => (i === 0 ? 1 : 0)));
  const targetOpacities = useRef<number[]>(scenes.map((_, i) => (i === 0 ? 1 : 0)));

  useEffect(() => {
    targetOpacities.current = scenes.map((_, i) => (i === activeScene ? 1 : 0));
  }, [activeScene]);

  useFrame(() => {
    setCurrentOpacities((prev) =>
      prev.map((o, i) => {
        const target = targetOpacities.current[i];
        return o + (target - o) * 0.05;
      })
    );
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      {scenes.map((Scene, i) => {
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

interface SolverSceneProps {
  activeScene: number;
}

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
        <pointLight position={[-2, 1, 3]} intensity={0.4} color="#c8ff00" />
        <hemisphereLight args={['#ffffff', '#444444', 0.5]} />
        <SceneManager activeScene={activeScene} />
      </Canvas>
    </div>
  );
}
