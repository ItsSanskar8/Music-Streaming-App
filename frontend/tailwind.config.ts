import type { Config } from "tailwindcss";

// ============================================================================
//  NOVA v4 — Design System: Cinematic, Futuristic, Music-First.
//  Black + royal blue + emerald/cyan glow · premium glassmorphism · 3D tilt ·
//  aura backgrounds · breathable gradient shadows · scroll-driven animations.
// ============================================================================
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: "#030305",
          bg2: "#0A0F1F",
          blue: "#245BFF",
          cyan: "#00F5D4",
          violet: "#7C5CFF",
          rose: "#FB7185",
          gold: "#FBBF24",
          black: "#030305",
          surface: "#0A0F1F",
          elevated: "#12182B",
          primary: "#FFFFFF",
          secondary: "rgba(255,255,255,0.65)",
          muted: "rgba(255,255,255,0.45)",
        },
        brand: {
          ink: "#030305",
          navy: "#0A0F1F",
          lavender: "#7C5CFF",
          cyan: "#00F5D4",
          blue: "#245BFF",
          rose: "#FB7185",
          gold: "#FBBF24",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["4rem", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        "display-sm": ["3.25rem", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
        "4xl": "80px",
      },
      boxShadow: {
        "glow-blue": "0 0 40px -8px rgba(36,91,255,0.55), 0 0 80px -16px rgba(36,91,255,0.25)",
        "glow-cyan": "0 0 40px -8px rgba(0,245,212,0.45), 0 0 80px -16px rgba(0,245,212,0.2)",
        "glow-violet": "0 0 40px -8px rgba(124,92,255,0.4), 0 0 80px -16px rgba(124,92,255,0.2)",
        "glow-white": "0 0 32px -8px rgba(255,255,255,0.15)",
        glass: "0 8px 40px rgba(0,0,0,0.55)",
        "glass-lg": "0 24px 80px rgba(0,0,0,0.65)",
        "glass-2xl": "0 40px 120px rgba(0,0,0,0.75)",
        apple: "0 8px 30px rgba(0,0,0,0.5)",
        "apple-lg": "0 20px 60px rgba(0,0,0,0.6)",
      },
      transitionTimingFunction: {
        nova: "cubic-bezier(0.22, 1, 0.36, 1)",
        "nova-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up-lg": {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-lg": {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-18px) rotate(1deg)" },
          "66%": { transform: "translateY(-6px) rotate(-1deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "aurora-shift": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(4%,-3%,0) scale(1.08)" },
          "66%": { transform: "translate3d(-3%,4%,0) scale(0.96)" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "breath-glow": {
          "0%,100%": { boxShadow: "0 0 20px -8px rgba(0,245,212,0.3)" },
          "50%": { boxShadow: "0 0 40px -4px rgba(0,245,212,0.6)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-slower": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "80%,100%": { transform: "scale(3)", opacity: "0" },
        },
        "morph-blob": {
          "0%,100%": { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
          "33%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "66%": { borderRadius: "40% 60% 70% 30% / 40% 50% 50% 60%" },
        },
        "eq-bar": {
          "0%,100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        "tilt-float": {
          "0%,100%": { transform: "perspective(1000px) rotateX(2deg) rotateY(-2deg)" },
          "50%": { transform: "perspective(1000px) rotateX(-1deg) rotateY(1deg)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-up-lg": "slide-up-lg 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-down": "slide-down 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-right": "slide-right 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        float: "float 6s ease-in-out infinite",
        "float-lg": "float-lg 8s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "aurora-shift": "aurora-shift 26s ease-in-out infinite",
        "text-shimmer": "text-shimmer 4s ease-in-out infinite",
        "breath-glow": "breath-glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "spin-slower": "spin-slower 30s linear infinite",
        "ping-slow": "ping-slow 4s ease-out infinite",
        "morph-blob": "morph-blob 8s ease-in-out infinite",
        "scan-line": "scan-line 12s linear infinite",
        "eq-bar": "eq-bar 1.1s ease-in-out infinite",
        "tilt-float": "tilt-float 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
