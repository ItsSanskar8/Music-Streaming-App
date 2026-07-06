"use client";

// ============================================================================
//  ParticleField v10 — Roaming neon particles + atmosphere glow orbs.
//
//  Removed the searchlight beams. Now just:
//    • 500 roaming neon particles floating independently like dust in light
//    • 2 soft pulsing glow orbs for atmospheric depth
// ============================================================================

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, Points } from "three";

// ── Neon palette ────────────────────────────────────────────────────────
const NEON_RGB = [
  [1.0, 0.08, 0.58], [0.14, 0.36, 1.0], [0.0, 0.96, 0.83],
  [0.49, 0.36, 1.0], [1.0, 0.0, 1.0],   [0.22, 1.0, 0.08],
  [1.0, 0.27, 0.0],
] as const;

function neonColor(i: number): [number, number, number] {
  const len = NEON_RGB.length;
  return NEON_RGB[Math.abs(Math.floor(((Math.sin(i * 47.11) * 1000) % 1) * len)) % len] as [number, number, number];
}

interface Props {
  count?: number;
}

export default function ParticleField({ count = 500 }: Props) {
  const pointRef = useRef<Points>(null);
  const orb1 = useRef<Mesh>(null);
  const orb2 = useRef<Mesh>(null);

  // ── Roaming particle data ─────────────────────────────────────────────
  const particleCount = count;
  const basePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3 + ((Math.sin(i * 13.37) * 1000) % 1) * 16;
      const theta = i * 2.399963;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [particleCount]);

  const particlePhases = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      arr[i] = ((Math.sin(i * 7.777) * 1000) % 1) * Math.PI * 2;
    }
    return arr;
  }, [particleCount]);

  const colors = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const [r, g, b] = neonColor(i);
      const bright = 0.6 + ((Math.sin(i * 23.45) * 1000) % 1) * 0.4;
      arr[i * 3] = r * bright;
      arr[i * 3 + 1] = g * bright;
      arr[i * 3 + 2] = b * bright;
    }
    return arr;
  }, [particleCount]);

  // ── Animation loop ────────────────────────────────────────────────────
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // === Roaming particles: per-vertex independent drift ===
    if (pointRef.current) {
      const pos = pointRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        const p = particlePhases;
        pos[i]     = basePositions[i]     + Math.sin(t * 0.2  + p[i])     * 1.2;
        pos[i + 1] = basePositions[i + 1] + Math.sin(t * 0.15 + p[i + 1]) * 1.0;
        pos[i + 2] = basePositions[i + 2] + Math.sin(t * 0.18 + p[i + 2]) * 1.4;
      }
      pointRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // === Pulsing glow orbs ===
    if (orb1.current) {
      const s = 1 + Math.sin(t * 0.2) * 0.2;
      orb1.current.scale.setScalar(s);
      orb1.current.position.x = Math.sin(t * 0.08) * 6;
      orb1.current.position.z = Math.cos(t * 0.08) * 6;
    }
    if (orb2.current) {
      const s = 1 + Math.sin(t * 0.25 + 1) * 0.15;
      orb2.current.scale.setScalar(s);
      orb2.current.position.x = Math.sin(t * 0.06 + 2) * 7;
      orb2.current.position.z = Math.cos(t * 0.06 + 2) * 7;
    }
  });

  return (
    <group renderOrder={-1}>
      {/* ============ ROAMING PARTICLES ============ */}
      <points ref={pointRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={new Float32Array(basePositions)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          depthWrite={false}
          sizeAttenuation
          blending={2}
          size={0.07}
          vertexColors
          opacity={0.55}
        />
      </points>

      {/* ============ ATMOSPHERE GLOW ORBS ============ */}
      <mesh ref={orb1}>
        <sphereGeometry args={[3.5, 20, 16]} />
        <meshBasicMaterial
          color="#FF1493"
          transparent
          opacity={0.06}
          blending={2}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={orb2}>
        <sphereGeometry args={[4, 20, 16]} />
        <meshBasicMaterial
          color="#245BFF"
          transparent
          opacity={0.05}
          blending={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
