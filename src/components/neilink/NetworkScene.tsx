"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useReducedMotion from "./useReducedMotion";

function NetworkParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const PARTICLE_COUNT = 200;
  const CONNECTION_DISTANCE = 1.8;

  const particles = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions, velocities };
  }, []);

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !lineRef.current) return;

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // When reduced motion is preferred, skip velocity and wave motion — just keep boundary wrapping
      if (!reducedMotion) {
        positions[i3] += particles.velocities[i3];
        positions[i3 + 1] += particles.velocities[i3 + 1];
        positions[i3 + 2] += particles.velocities[i3 + 2];

        // Subtle wave motion
        positions[i3] += Math.sin(time * 0.3 + i * 0.1) * 0.001;
        positions[i3 + 1] += Math.cos(time * 0.2 + i * 0.15) * 0.001;

        // Mouse influence
        const mouseWorldX = mouseRef.current.x * viewport.width * 0.5;
        const mouseWorldY = mouseRef.current.y * viewport.height * 0.5;
        const dx = positions[i3] - mouseWorldX;
        const dy = positions[i3 + 1] - mouseWorldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          const force = (2 - dist) * 0.001;
          positions[i3] += dx * force;
          positions[i3 + 1] += dy * force;
        }
      }

      // Boundary wrapping
      if (positions[i3] > 6) positions[i3] = -6;
      if (positions[i3] < -6) positions[i3] = 6;
      if (positions[i3 + 1] > 4) positions[i3 + 1] = -4;
      if (positions[i3 + 1] < -4) positions[i3 + 1] = 4;
      if (positions[i3 + 2] > 3) positions[i3 + 2] = -3;
      if (positions[i3 + 2] < -3) positions[i3 + 2] = 3;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Update connections — warm neutral color instead of neon green
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const i3 = i * 3;
        const j3 = j * 3;
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = 1 - dist / CONNECTION_DISTANCE;
          linePositions.push(
            positions[i3], positions[i3 + 1], positions[i3 + 2],
            positions[j3], positions[j3 + 1], positions[j3 + 2]
          );
          // Softer, more neutral teal instead of bright green
          lineColors.push(
            0.18 * opacity, 0.7 * opacity, 0.65 * opacity,
            0.18 * opacity, 0.7 * opacity, 0.65 * opacity
          );
        }
      }
    }

    const lineGeom = lineRef.current.geometry;
    lineGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    lineGeom.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(lineColors, 3)
    );
    lineGeom.attributes.position.needsUpdate = true;
    lineGeom.attributes.color.needsUpdate = true;
  });

  return (
    <group onPointerMove={handlePointerMove as never}>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#2dd4bf"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function DataFlowRings({ reducedMotion }: { reducedMotion: boolean }) {
  const group1 = useRef<THREE.Mesh>(null);
  const group2 = useRef<THREE.Mesh>(null);
  const group3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // When reduced motion, freeze ring rotations
    if (reducedMotion) return;

    const time = state.clock.elapsedTime;
    if (group1.current) {
      group1.current.rotation.x = time * 0.15;
      group1.current.rotation.y = time * 0.1;
    }
    if (group2.current) {
      group2.current.rotation.x = -time * 0.12;
      group2.current.rotation.z = time * 0.08;
    }
    if (group3.current) {
      group3.current.rotation.y = time * 0.1;
      group3.current.rotation.z = -time * 0.06;
    }
  });

  return (
    <>
      <mesh ref={group1}>
        <torusGeometry args={[3.5, 0.008, 16, 100]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={0.08} />
      </mesh>
      <mesh ref={group2}>
        <torusGeometry args={[4, 0.006, 16, 100]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.06} />
      </mesh>
      <mesh ref={group3}>
        <torusGeometry args={[4.5, 0.005, 16, 100]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.04} />
      </mesh>
    </>
  );
}

export default function NetworkScene() {
  // Note: useReducedMotion can't be used directly here because this is
  // rendered inside a Canvas (Three.js context), not a React DOM context.
  // We pass it as a prop from the parent component.
  // However, since NetworkScene is lazy-loaded and rendered in a Canvas,
  // we use a simple approach: check the media query directly.
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <NetworkParticles reducedMotion={reducedMotion} />
      <DataFlowRings reducedMotion={reducedMotion} />
    </Canvas>
  );
}
