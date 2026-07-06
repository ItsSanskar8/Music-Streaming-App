"use client";

// ============================================================================
//  ThreeHeroScene v3 — Gentle 3D particle background for the entire landing
//  page. Lazy-loaded (next/dynamic, ssr:false).
//
//  Designed to sit as a fixed full-page backdrop behind ALL sections:
//    • Soft, subtle ambient lighting (no harsh point lights)
//    • Gentle floating particle field (snow-like)
//    • Transparent canvas with pointer-events: none
// ============================================================================

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticleField from "@/components/3d/ParticleField";

export default function ThreeHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <ParticleField count={600} />
      </Suspense>
    </Canvas>
  );
}
