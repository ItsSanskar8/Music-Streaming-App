"use client";

// ============================================================================
//  ThreeHeroScene v4 — Neon club 3D particle background for the entire
//  landing page. Lazy-loaded (next/dynamic, ssr:false).
//
//  Designed to sit as a fixed full-page backdrop behind ALL sections:
//    • Colored point lights for DJ night atmosphere
//    • Vibrant neon particle field with additive glow
//    • Transparent canvas with pointer-events: none
// ============================================================================

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticleField from "@/components/3d/ParticleField";

export default function ThreeHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <Suspense fallback={null}>
        {/* Haze / fog for club atmosphere */}
        <fogExp2 attach="fog" args={["#050510", 0.035]} />
        <ambientLight intensity={0.08} />
        <pointLight position={[12, 10, 8]} intensity={100} color="#FF1493" />
        <pointLight position={[-12, -8, 10]} intensity={80} color="#245BFF" />
        <pointLight position={[8, -10, -6]} intensity={60} color="#00F5D4" />
        <pointLight position={[-9, 11, -8]} intensity={50} color="#7C5CFF" />
        <ParticleField count={600} />
      </Suspense>
    </Canvas>
  );
}
