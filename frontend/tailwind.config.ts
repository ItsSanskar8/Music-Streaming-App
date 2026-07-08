import type { Config } from "tailwindcss";

// ============================================================================
//  NOVA v6 — Design System: Champagne Noir.
//  Luxury music streaming — warm blacks, champagne gold accents,
//  muted sage emerald, off-white typography, refined glass.
// ============================================================================
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: "#0F0F12",         // warm charcoal — not pure black
          bg2: "#16161A",        // slightly lighter warm surface
          blue: "#C9A96E",       // champagne gold — Nova's signature
          cyan: "#5A9E8F",       // muted sage emerald — secondary accent
          violet: "#9B8EC4",     // muted lavender
          rose: "#D4768A",       // muted rose
          gold: "#C9A96E",       // champagne gold
          black: "#0F0F12",
          surface: "#16161A",
          elevated: "#1C1C21",
          primary: "#F5F0EB",    // warm off-white
          secondary: "rgba(245,240,235,0.55)",
          muted: "rgba(245,240,235,0.35)",
        },
        brand: {
          ink: "#0F0F12",
          navy: "#16161A",
          lavender: "#9B8EC4",
          cyan: "#5A9E8F",
          blue: "#C9A96E",
          rose: "#D4768A",
          gold: "#C9A96E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["4rem", { lineHeight: "0.96", letterSpacing: "-0.045em" }],
        "display-sm": ["3.25rem", { lineHeight: "1.0", letterSpacing: "-0.035em" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
        "4xl": "80px",
      },
      boxShadow: {
        // Luxury glow — champagne gold warmth
        "glow-indigo":
          "0 0 32px -8px rgba(201,169,110,0.35), 0 0 64px -16px rgba(201,169,110,0.15)",
        "glow-emerald":
          "0 0 32px -8px rgba(90,158,143,0.30), 0 0 64px -16px rgba(90,158,143,0.12)",
        "glow-violet":
          "0 0 32px -8px rgba(155,142,196,0.30), 0 0 64px -16px rgba(155,142,196,0.12)",
        "glow-white": "0 0 24px -8px rgba(245,240,235,0.10)",
        // Refined glass — deeper, more layered
        glass: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)",
        "glass-lg":
          "0 20px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.30)",
        "glass-2xl":
          "0 32px 100px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.35)",
        apple: "0 8px 30px rgba(0,0,0,0.45)",
        "apple-lg": "0 20px 60px rgba(0,0,0,0.55)",
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
          "50%": { transform: "translateY(-10px)" },
        },
        "float-lg": {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-14px) rotate(0.5deg)" },
          "66%": { transform: "translateY(-4px) rotate(-0.5deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.03)" },
        },
        "aurora-shift": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(3%,-2%,0) scale(1.05)" },
          "66%": { transform: "translate3d(-2%,3%,0) scale(0.97)" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "breath-glow": {
          "0%,100%": { boxShadow: "0 0 16px -8px rgba(90,158,143,0.25)" },
          "50%": { boxShadow: "0 0 32px -4px rgba(90,158,143,0.45)" },
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
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "80%,100%": { transform: "scale(2.5)", opacity: "0" },
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
        "slide-up":
          "slide-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-up-lg":
          "slide-up-lg 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-down":
          "slide-down 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-right":
          "slide-right 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        "scale-in":
          "scale-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        float: "float 7s ease-in-out infinite",
        "float-lg": "float-lg 9s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "aurora-shift": "aurora-shift 30s ease-in-out infinite",
        "text-shimmer": "text-shimmer 4s ease-in-out infinite",
        "breath-glow": "breath-glow 4s ease-in-out infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        "spin-slower": "spin-slower 36s linear infinite",
        "ping-slow": "ping-slow 4s ease-out infinite",
        "morph-blob": "morph-blob 10s ease-in-out infinite",
        "scan-line": "scan-line 14s linear infinite",
        "eq-bar": "eq-bar 1.1s ease-in-out infinite",
        "tilt-float": "tilt-float 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
