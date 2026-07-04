import type { Config } from "tailwindcss";

// Tailwind config for SoundVerse.
// Custom colors, fonts and animations live here so the whole app stays consistent.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep space background palette
        void: "#05040f",
        nebula: "#0b0820",
        // Neon accent colors used across the app
        neon: {
          purple: "#a855f7",
          pink: "#ec4899",
          blue: "#38bdf8",
          cyan: "#22d3ee",
          green: "#34d399",
        },
      },
      fontFamily: {
        // Font is loaded in app/layout.tsx via next/font
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(168, 85, 247, 0.35)",
        "glow-pink": "0 0 25px rgba(236, 72, 153, 0.35)",
      },
      keyframes: {
        // Slow moving aurora blobs in the background
        aurora: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 20px) scale(0.95)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        // Each waveform bar bounces on its own timing
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        wave: "wave 1s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
