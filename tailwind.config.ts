import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A0A0A",
          light: "#1A1A1A",
          soft: "#121212",
        },
        secondary: {
          DEFAULT: "#0D7377",
          dark: "#0A6B6F",
          deeper: "#0D4F51",
          light: "#14919B",
          glow: "#14B8A6",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          light: "#E8E8E8",
          dark: "#707070",
          mute: "#9A9A9A",
        },
        surface: {
          DEFAULT: "#121212",
          elevated: "#1A1A1A",
          card: "#161616",
        },
        cream: "#FAF8F5",
        ink: "#2D2D2D",
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.45)",
        lift: "0 20px 48px rgba(0, 0, 0, 0.55)",
        "teal-glow": "0 0 24px rgba(13, 115, 119, 0.4)",
        "silver-glow": "0 0 20px rgba(192, 192, 192, 0.2)",
        "wa-glow": "0 0 16px rgba(37, 211, 102, 0.45)",
      },
      backgroundImage: {
        "marble-subtle":
          "radial-gradient(ellipse at 20% 50%, rgba(13,115,119,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(192,192,192,0.06) 0%, transparent 40%)",
        "hero-vignette":
          "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 35%, rgba(10,10,10,0.92) 100%)",
        "teal-fade":
          "linear-gradient(135deg, rgba(13,115,119,0.25) 0%, rgba(10,10,10,0.9) 60%)",
        "chrome-line":
          "linear-gradient(90deg, transparent, rgba(192,192,192,0.45), transparent)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
