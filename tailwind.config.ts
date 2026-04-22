import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        degg: {
          bg: "#F7FAFC",
          ink: "#0B1220",
          green: "#0FA958",
          green2: "#0C8A48",
          orange: "#FF7A1A",
          orange2: "#E86910",
          yellow: "#FFD34D",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(11, 18, 32, 0.08)",
      },
      borderRadius: {
        xl: "18px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pill-slide": {
          "0%": { transform: "translateX(var(--pill-from, 0px))" },
          "100%": { transform: "translateX(var(--pill-to, 0px))" },
        },
      },
      animation: {
        "fade-up": "fade-up 220ms ease-out both",
        shimmer: "shimmer 1.1s ease-in-out infinite",
      },
    },
  },
} satisfies Config;