"use client";

// ------------------------------------------------------------------
//  AuroraBackground — fixed, full-screen animated gradient blobs.
//  Sits behind everything to give the app its "futuristic" glow.
// ------------------------------------------------------------------

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base deep-space color */}
      <div className="absolute inset-0 bg-void" />

      {/* Slow-moving aurora blobs */}
      <div className="aurora-blob left-[-10%] top-[-10%] h-[40vw] w-[40vw] animate-aurora bg-neon-purple/40" />
      <div className="aurora-blob right-[-10%] top-[10%] h-[35vw] w-[35vw] animate-aurora bg-neon-blue/30 [animation-delay:-6s]" />
      <div className="aurora-blob bottom-[-15%] left-[20%] h-[40vw] w-[40vw] animate-aurora bg-neon-pink/30 [animation-delay:-12s]" />

      {/* Subtle grid overlay for a "tech" feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
