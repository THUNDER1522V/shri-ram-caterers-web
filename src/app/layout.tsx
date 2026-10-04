import type { Metadata, Viewport } from "next";
import { fontHeading, fontBody } from "@/lib/fonts";
import { constructMetadata } from "@/lib/seo/metadata";
import { CateringBusinessJsonLd } from "@/lib/seo/json-ld";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { MotionProvider } from "@/providers/motion-provider";
import "@/app/globals.css";

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${fontHeading.variable} ${fontBody.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <CateringBusinessJsonLd />
      </head>
      <body className="min-h-screen bg-background text-foreground font-body selection:bg-[#C6A15B] selection:text-[#0B0B0B]">
        <MotionProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
