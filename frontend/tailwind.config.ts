import type { Config } from "tailwindcss";

// ============================================================================
//  NOVA — futuristic, cinematic, music-first design tokens.
//  Black + royal blue + emerald/cyan glow · premium glassmorphism.
//  Legacy `nova.*` / `brand.*` keys are kept (aliased to the new palette) so
//  pre-existing components keep compiling during the redesign.
// ============================================================================
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nova: {
          // --- canonical Nova palette ---
          bg: "#050505", // page background (near-black)
          bg2: "#0A0F1F", // secondary deep-space navy
          blue: "#245BFF", // primary accent — royal blue
          cyan: "#00F5D4", // secondary accent — emerald/cyan glow
          violet: "#7C5CFF", // supporting depth accent

          // --- legacy aliases (kept so old components still build) ---
          black: "#050505",
          surface: "#0A0F1F",
          elevated: "#12182B",
          primary: "#FFFFFF",
          secondary: "rgba(255,255,255,0.65)",
          muted: "rgba(255,255,255,0.45)",
        },
        // Legacy v2 brand.* keys → remapped onto the Nova palette.
        brand: {
          ink: "#050505",
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
        display: ["3.25rem", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "nova-glow":
          "radial-gradient(120% 120% at 50% 0%, rgba(36,91,255,0.18) 0%, rgba(0,245,212,0.06) 40%, transparent 70%)",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        "glow-blue": "0 0 40px -8px rgba(36,91,255,0.55)",
        "glow-cyan": "0 0 40px -8px rgba(0,245,212,0.45)",
        glass: "0 8px 40px rgba(0,0,0,0.55)",
        "glass-lg": "0 24px 80px rgba(0,0,0,0.65)",
        apple: "0 8px 30px rgba(0,0,0,0.5)", // legacy alias
        "apple-lg": "0 20px 60px rgba(0,0,0,0.6)", // legacy alias
      },
      transitionTimingFunction: {
        nova: "cubic-bezier(0.22, 1, 0.36, 1)",
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)", // legacy alias
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "aurora-shift": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(4%,-3%,0) scale(1.08)" },
          "66%": { transform: "translate3d(-3%,4%,0) scale(0.96)" },
        },
        waveform: {
          "0%,100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.5s cubic-bezier(0.22,1,0.36,1)",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "aurora-shift": "aurora-shift 22s ease-in-out infinite",
        "spin-slow": "spin-slow 26s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
