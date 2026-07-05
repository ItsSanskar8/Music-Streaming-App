"use client";

// The landing hero's WebGL canvas. Lazy-loaded (next/dynamic, ssr:false) from
// the landing page so three.js stays out of the initial bundle. Renders the
// morphing orb + particle field with soft blue/cyan lighting.

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import MusicSphere from "@/components/3d/MusicSphere";
import ParticleField from "@/components/3d/ParticleField";

export default function ThreeHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={60} color="#245BFF" />
        <pointLight position={[-5, -3, 2]} intensity={40} color="#00F5D4" />
        <MusicSphere />
        <ParticleField count={800} />
      </Suspense>
    </Canvas>
  );
}
