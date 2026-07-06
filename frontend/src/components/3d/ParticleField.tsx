"use client";

// A drifting cloud of glowing points around the orb — "neon audio particles".
// Uses a plain three.js points buffer (version-stable, no drei Points API).

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";

export default function ParticleField({ count = 900 }: { count?: number }) {
  const ref = useRef<Points>(null);

  // Deterministic-ish positions in a sphere shell (seeded loop, no Math.random
  // dependence on render order — computed once via useMemo).
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 4;
      const theta = i * 2.399963; // golden-angle spiral
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
      ref.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00F5D4"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
