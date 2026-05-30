import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "#050B18",
        panel: "#0F172A",
        line: "rgba(148, 163, 184, 0.2)",
        glow: "#22D3EE",
        brand: "#2563EB",
        emerald: "#22C55E",
        amber: "#F59E0B",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(34, 211, 238, 0.22)",
        panel: "0 20px 60px rgba(2, 8, 23, 0.42)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(51, 209, 255, 0.18), transparent 36%), radial-gradient(circle at 85% 25%, rgba(246, 190, 98, 0.12), transparent 25%), linear-gradient(180deg, #081322 0%, #040b14 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        gridPan: {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-32px, -32px, 0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.8s ease-in-out infinite",
        "grid-pan": "gridPan 16s linear infinite",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-space-grotesk)"],
      },
    },
  },
  plugins: [],
};

export default config;
