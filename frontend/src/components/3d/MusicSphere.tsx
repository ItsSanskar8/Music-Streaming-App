"use client";

// The hero's centerpiece: a slowly-morphing royal-blue→cyan orb (distorted
// icosahedron) wrapped by two rotating "waveform" rings. Pure R3F/drei; no
// textures or assets. Rendered only inside <ThreeHeroScene>.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh, Group } from "three";

export default function MusicSphere() {
  const sphere = useRef<Mesh>(null);
  const rings = useRef<Group>(null);

  useFrame((_, delta) => {
    if (sphere.current) sphere.current.rotation.y += delta * 0.15;
    if (rings.current) {
      rings.current.rotation.z += delta * 0.25;
      rings.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      {/* Morphing orb */}
      <mesh ref={sphere}>
        <icosahedronGeometry args={[1.35, 24]} />
        <MeshDistortMaterial
          color="#245BFF"
          emissive="#00F5D4"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.6}
          distort={0.38}
          speed={1.6}
        />
      </mesh>

      {/* Waveform rings */}
      <group ref={rings}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.1, 0.018, 16, 120]} />
          <meshStandardMaterial
            color="#00F5D4"
            emissive="#00F5D4"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.6, Math.PI / 5, 0]}>
          <torusGeometry args={[2.55, 0.012, 16, 120]} />
          <meshStandardMaterial
            color="#245BFF"
            emissive="#245BFF"
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
