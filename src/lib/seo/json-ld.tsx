import { siteConfig } from "@/config/site";

export function CateringBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CateringService",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phoneRaw,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.6139,
      longitude: 77.209,
    },
    priceRange: "$$$$",
    servesCuisine: ["Indian", "North Indian", "Mughlai", "Traditional Indian Vegetarian"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
