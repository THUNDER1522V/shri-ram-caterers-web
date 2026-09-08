import type { Metadata, Viewport } from "next";
import { fontHeading, fontBody } from "@/lib/fonts";
import { constructMetadata } from "@/lib/seo/metadata";
import { CateringBusinessJsonLd } from "@/lib/seo/json-ld";
import "@/app/globals.css";

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  colorScheme: "light",
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
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <CateringBusinessJsonLd />
      </head>
      <body className="min-h-screen bg-background text-foreground font-body selection:bg-[#EADCC8] selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
