'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 500 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#666666"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GlassTorus() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
        <meshPhysicalMaterial color="#c8ff00" transmission={0.9} roughness={0.05} thickness={0.5} ior={1.5} />
      </mesh>
    </Float>
  );
}

function WireframeIcosahedron() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={[2.5, 1.5, -1]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial wireframe color="#444444" />
      </mesh>
    </Float>
  );
}

function SmallSpheres() {
  const groupRef = useRef<THREE.Group>(null!);
  const spheres = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        position: [
          Math.cos((i / 8) * Math.PI * 2) * 3,
          Math.sin((i / 8) * Math.PI * 2) * 0.5,
          Math.sin((i / 8) * Math.PI * 2) * 3,
        ] as [number, number, number],
        scale: 0.05 + Math.random() * 0.08,
      })),
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.position}>
          <sphereGeometry args={[s.scale, 16, 16]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function MouseFollower() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const pointer = state.pointer;
    target.current.x = pointer.x * 0.5;
    target.current.y = pointer.y * 0.3;

    if (groupRef.current) {
      groupRef.current.rotation.y += (target.current.x - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-target.current.y - groupRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <GlassTorus />
      <WireframeIcosahedron />
      <SmallSpheres />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-3, 2, 4]} intensity={0.5} color="#c8ff00" />
        <hemisphereLight args={['#ffffff', '#444444', 0.5]} />
        <MouseFollower />
        <Particles count={400} />
      </Canvas>
    </div>
  );
}
