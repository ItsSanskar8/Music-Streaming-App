"use client";

// Lightweight CSS waveform — a row of blue→cyan bars that pulse when `active`.
// Pure CSS (no canvas / no rAF), so it's cheap to render in many cards at once.
// Bar heights are deterministic (index-based) to avoid SSR hydration drift.

interface Props {
  bars?: number;
  active?: boolean;
  className?: string;
  /** Tailwind height utility, e.g. "h-8". */
  heightClass?: string;
}

export default function AnimatedWaveform({
  bars = 5,
  active = true,
  className = "",
  heightClass = "h-6",
}: Props) {
  return (
    <div
      className={`flex items-end gap-[3px] ${heightClass} ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Deterministic pseudo-random base height + stagger.
        const base = 30 + ((i * 37) % 60);
        const delay = ((i * 90) % 700) / 1000;
        return (
          <span
            key={i}
            className="w-[3px] flex-1 origin-bottom rounded-full bg-gradient-to-t from-nova-blue to-nova-cyan"
            style={{
              height: `${base}%`,
              animation: active
                ? `waveform 0.9s ease-in-out ${delay}s infinite`
                : "none",
              opacity: active ? 1 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
