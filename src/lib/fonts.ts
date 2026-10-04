import { Bodoni_Moda, Inter } from "next/font/google";

/**
 * Heading Display Serif Font - Bodoni Moda
 * Highly optimized: only weights and subsets used, display swap, preloaded, with size-adjusted fallbacks.
 */
export const fontHeading = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  preload: true,
  adjustFontFallback: true,
});

/**
 * Body/UI Sans Font - Inter (Variable Font)
 * Uses native variable axes for maximum compression and zero font weight duplication.
 */
export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
