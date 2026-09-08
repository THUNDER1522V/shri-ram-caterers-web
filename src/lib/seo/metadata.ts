import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { PageMetadataProps } from "@/types/seo";

/**
 * Constructs production-grade metadata with OpenGraph and Twitter card fallbacks.
 */
export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonical,
  noIndex = false,
}: PageMetadataProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const canonicalUrl = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url;

  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
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
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
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
