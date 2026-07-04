"use client";

// TiltCard — premium "3D" feel using pure CSS 3D transforms (NO Three.js).
// Tracks the cursor over the element and applies perspective + rotateX/rotateY
// so the card physically tilts toward the pointer like a floating glass slab.
// A soft radial "glare" follows the cursor for extra depth.

import { useRef, useState, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  max?: number; // max tilt in degrees
  glare?: boolean;
  scale?: number;
}

export default function TiltCard({
  children,
  className = "",
  onClick,
  max = 10,
  glare = true,
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, o: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rotateY = (px - 0.5) * 2 * max; // tilt toward cursor (x)
    const rotateX = -(py - 0.5) * 2 * max; // tilt toward cursor (y)
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
    });
    setGlarePos({ x: px * 100, y: py * 100, o: 0.14 });
  };

  const reset = () => {
    setStyle({
      transform:
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
    });
    setGlarePos((g) => ({ ...g, o: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{
        ...style,
        transition: "transform 0.25s cubic-bezier(0.25,0.1,0.25,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.o}), transparent 45%)`,
            transition: "background 0.1s linear",
          }}
        />
      )}
      {children}
    </div>
  );
}
