"use client";

// GlassSkeleton — a pulsing gradient placeholder shown while data loads.
// `variant` gives a couple of common shapes; anything else uses className.

interface GlassSkeletonProps {
  className?: string;
  variant?: "card" | "row" | "text" | "circle";
  count?: number;
}

export default function GlassSkeleton({
  className = "",
  variant = "card",
  count = 1,
}: GlassSkeletonProps) {
  const base = "skeleton rounded-2xl border border-white/[0.06]";

  const shape = (i: number) => {
    switch (variant) {
      case "row":
        return (
          <div key={i} className="flex items-center gap-4 rounded-xl p-3">
            <div className={`${base} h-12 w-12 rounded-lg`} />
            <div className="flex-1 space-y-2">
              <div className={`${base} h-3 w-1/2 rounded`} />
              <div className={`${base} h-3 w-1/3 rounded`} />
            </div>
            <div className={`${base} h-3 w-10 rounded`} />
          </div>
        );
      case "text":
        return <div key={i} className={`${base} h-3 w-full rounded ${className}`} />;
      case "circle":
        return <div key={i} className={`${base} rounded-full ${className}`} />;
      case "card":
      default:
        return (
          <div key={i} className="space-y-3">
            <div className={`${base} aspect-square w-full`} />
            <div className={`${base} h-3 w-3/4 rounded`} />
            <div className={`${base} h-3 w-1/2 rounded`} />
          </div>
        );
    }
  };

  return <>{Array.from({ length: count }).map((_, i) => shape(i))}</>;
}
