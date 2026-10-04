import type { Config } from "tailwindcss";

const config: Config = {
  // Dark mode is default
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand-specific color tokens
        gold: {
          DEFAULT: "#D4A84B",
          champagne: "#E8D6A8",
        },
        ivory: {
          DEFAULT: "#F5EFE0",
        },
        red: {
          DEFAULT: "#7A1118", // brand-red
          wine: "#4A0A10",
        },
        charcoal: {
          DEFAULT: "#0B0B0B", // bg-black
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Bodoni Moda", "serif"],
        serif: ["var(--font-heading)", "Bodoni Moda", "serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "sans-serif"],
      },
      borderRadius: {
        btn: "14px",
        card: "20px",
        "card-lg": "24px",
        input: "14px",
        media: "24px",
      },
      boxShadow: {
        "elevation-soft":
          "0 2px 12px -2px rgba(24, 24, 27, 0.03), 0 4px 6px -2px rgba(24, 24, 27, 0.02)",
        "elevation-hover":
          "0 8px 24px -4px rgba(24, 24, 27, 0.06), 0 4px 8px -2px rgba(24, 24, 27, 0.02)",
      },
      spacing: {
        "section-desktop": "120px",
        "section-tablet": "80px",
        "section-mobile": "64px",
      },
      maxWidth: {
        content: "1280px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "150": "150ms",
        "250": "250ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
      keyframes: {
        sheen: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        sheen: "sheen 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
