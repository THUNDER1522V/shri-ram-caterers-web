import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import type { PageMetadataProps } from "@/types/seo";

/**
 * Constructs production-grade metadata with OpenGraph and Twitter card fallbacks.
 * Matches: "Wedding Caterers in [City] | Shri Ram Caterers" (55-60 chars)
 */
export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonical = "/",
  noIndex = false,
}: PageMetadataProps = {}): Metadata {
  const defaultPageTitle = `Wedding Caterers in ${siteConfig.city} | ${siteConfig.name}`;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : defaultPageTitle;
  const canonicalUrl = canonical.startsWith("http")
    ? canonical
    : `${siteConfig.url}${canonical === "/" ? "" : canonical}`;

  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  return {
    title: {
      default: defaultPageTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Royal Indian Wedding Catering in ${siteConfig.city}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
      creator: "@shriramcaterers",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
