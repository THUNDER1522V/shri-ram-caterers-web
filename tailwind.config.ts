import type { Config } from "tailwindcss";

const config: Config = {
  // Dark mode is explicitly disabled per brand requirements (strictly luxury light theme)
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
          50: "#FAF6EF",
          100: "#F3EBDC",
          200: "#E6D6BA",
          300: "#D6BD95",
          400: "#C5A880", // Primary Gold
          500: "#B89358",
          600: "#9C7A44", // Secondary Gold
          700: "#7C5F33",
          800: "#5D4626",
          900: "#3F2F1B",
          DEFAULT: "#C5A880",
        },
        ivory: {
          50: "#FFFFFF",
          100: "#FDFBF7",
          200: "#FAF8F5", // Background Ivory
          300: "#F4EFE6", // Secondary Ivory
          400: "#EFE8DC",
          DEFAULT: "#FAF8F5",
        },
        charcoal: {
          50: "#F5F5F6",
          100: "#E5E5E8",
          200: "#CBCBD0",
          300: "#A2A2AC",
          400: "#71717A", // Text Secondary
          500: "#52525B",
          600: "#3F3F46",
          700: "#27272A",
          800: "#1E1E21",
          900: "#18181B", // Text Primary
          DEFAULT: "#18181B",
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
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
