import type { Config } from "tailwindcss";

// Nova — Apple-inspired dark design tokens.
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          black: "#000000",     // page background (pure black)
          surface: "#1C1C1E",   // cards / surfaces
          elevated: "#2C2C2E",  // elevated surfaces / hover
          primary: "#F5F5F7",   // primary text
          secondary: "#86868B", // secondary text
          cyan: "#64D2FF",      // Luminous Nova Cyan — accent, used sparingly
        },
        // NOVA v2 palette — deep-space glass UI.
        brand: {
          ink: "#050507",       // deepest black background
          navy: "#0A0A1A",      // midnight navy
          lavender: "#C4B5FD",  // primary accent
          cyan: "#22D3EE",      // electric cyan glow
          rose: "#FB7185",      // rose-pink highlight
          gold: "#FBBF24",      // muted gold detail
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Enables `bg-gradient-radial` (used by the FileDropzone drag glow).
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontSize: {
        // Apple-style display heading size.
        display: ["2.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      backdropBlur: {
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        // Soft, diffuse depth (no glow).
        apple: "0 8px 30px rgba(0, 0, 0, 0.5)",
        "apple-lg": "0 20px 60px rgba(0, 0, 0, 0.6)",
      },
      transitionTimingFunction: {
        // Apple's default easing curve.
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
