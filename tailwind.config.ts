import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        xboxGreen: "#107c10",
        neonCyan: "#00ffff",
        neonBlue: "#0000ff",
        neonOrange: "#ff7f50",
        neonPink: "#ff69b4",
        textGradStart: "#82fff3",
        textGradEnd: "#fcc474",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 10px rgba(0, 255, 255, 0.4), 0 0 20px rgba(0, 0, 255, 0.2)",
        "neon-cyan-strong": "0 0 15px rgba(0, 255, 255, 0.7), 0 0 30px rgba(0, 0, 255, 0.4)",
        "neon-pink": "0 0 10px rgba(255, 127, 80, 0.4), 0 0 20px rgba(255, 105, 180, 0.2)",
        "neon-pink-strong": "0 0 15px rgba(255, 127, 80, 0.7), 0 0 30px rgba(255, 105, 180, 0.4)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "flash-neon": "flashNeon 1s infinite alternate",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.4), 0 0 20px rgba(0, 0, 255, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.4)",
          },
        },
        flashNeon: {
          "0%": {
            borderColor: "#ff7f50",
            boxShadow: "0 0 10px rgba(255, 127, 80, 0.4)",
          },
          "100%": {
            borderColor: "#ff69b4",
            boxShadow: "0 0 25px rgba(255, 105, 180, 0.9), 0 0 50px rgba(255, 105, 180, 0.5)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

