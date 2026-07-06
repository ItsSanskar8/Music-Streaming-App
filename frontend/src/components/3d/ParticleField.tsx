"use client";

// ============================================================================
//  ParticleField v5 — Gentle snow-like particle system for page-wide
//  background ambiance.
//
//  Designed to run behind all landing page sections:
//    • Soft, low-saturation ice-blue particles
//    • Slow, gentle drift in all directions (snow/floating effect)
//    • Large, transparent particles with size variation
//    • Minimal rotation — just a subtle background ambiance
//    • No connection lines (keeps it clean and subtle)
//    • Low particle count for good performance
// ============================================================================

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";

interface Props {
  /** Total particles. Default 600 (keeps perf light for full-page usage). */
  count?: number;
}

export default function ParticleField({ count = 600 }: Props) {
  const innerRef = useRef<Points>(null);
  const outerRef = useRef<Points>(null);

  // ── Generate particle data ────────────────────────────────────────────
  // Two layers: a main inner cloud and a sparser outer halo, both with
  // soft blue-white colours and gentle sizing.
  const innerCount = Math.floor(count * 0.7);
  const outerCount = count - innerCount;

  const innerData = useMemo(() => {
    const positions = new Float32Array(innerCount * 3);
    const colors = new Float32Array(innerCount * 3);
    const sizes = new Float32Array(innerCount);

    for (let i = 0; i < innerCount; i++) {
      // Loose sphere, spread 3–8 units
      const r = 3 + ((Math.sin(i * 13.37) * 1000) % 1) * 5;
      const theta = i * 2.399963;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / innerCount);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Gentle ice-blue: very desaturated blue with slight cyan tint
      const brightness = 0.6 + ((Math.sin(i * 7.777) * 1000) % 1) * 0.25;
      colors[i * 3] = 0.55 + (1.0 - 0.55) * brightness * 0.2;
      colors[i * 3 + 1] = 0.7 + (1.0 - 0.7) * brightness * 0.2;
      colors[i * 3 + 2] = 0.95 + brightness * 0.05;

      // Size: medium, with gentle variation
      sizes[i] = 0.04 + ((Math.sin(i * 19.42) * 1000) % 1) * 0.06;
    }

    return { positions, colors, sizes };
  }, [innerCount]);

  const outerData = useMemo(() => {
    const positions = new Float32Array(outerCount * 3);
    const colors = new Float32Array(outerCount * 3);
    const sizes = new Float32Array(outerCount);

    for (let i = 0; i < outerCount; i++) {
      // Wider spread: 7–12 units
      const r = 7 + ((Math.sin(i * 29.07) * 1000) % 1) * 5;
      const theta = i * 1.909859 + 1.5;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / outerCount);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Even more desaturated outer halo
      colors[i * 3] = 0.6;
      colors[i * 3 + 1] = 0.7;
      colors[i * 3 + 2] = 0.95;

      // Slightly larger for outer
      sizes[i] = 0.06 + ((Math.sin(i * 27.1) * 1000) % 1) * 0.08;
    }

    return { positions, colors, sizes };
  }, [outerCount]);

  // ── Animation loop — gentle drifting ─────────────────────────────────
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (innerRef.current) {
      // Very slow overall rotation — barely perceptible
      innerRef.current.rotation.y += delta * 0.015;
      innerRef.current.rotation.x = Math.sin(t * 0.03) * 0.03;
      innerRef.current.rotation.z = Math.cos(t * 0.025) * 0.02;
    }

    if (outerRef.current) {
      // Opposite drift, even slower
      outerRef.current.rotation.y -= delta * 0.008;
      outerRef.current.rotation.x = Math.cos(t * 0.02) * 0.02;
    }
  });

  // ── Material config ───────────────────────────────────────────────────
  const materialProps = {
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
    blending: 2 as const, // AdditiveBlending
  };

  return (
    <group renderOrder={-1}>
      {/* Inner particles */}
      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={innerCount}
            array={innerData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={innerCount}
            array={innerData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={innerCount}
            array={innerData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          {...materialProps}
          size={0.055}
          vertexColors
          opacity={0.25}
        />
      </points>

      {/* Outer particles — more transparent and slightly larger */}
      <points ref={outerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={outerCount}
            array={outerData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={outerCount}
            array={outerData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={outerCount}
            array={outerData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          {...materialProps}
          size={0.09}
          vertexColors
          opacity={0.12}
        />
      </points>
    </group>
  );
}
