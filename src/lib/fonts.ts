import { Bodoni_Moda, Inter } from "next/font/google";

/**
 * Display/Heading Serif Font - Bodoni Moda
 * Selected for editorial luxury, high contrast, and timeless refinement.
 */
export const fontHeading = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

/**
 * Body/UI Sans Font - Inter
 * Selected for supreme legibility, neutral precision, and mobile clarity.
 */
export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
