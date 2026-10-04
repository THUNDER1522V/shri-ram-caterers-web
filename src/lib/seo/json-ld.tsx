import { siteConfig } from "@/config/siteConfig";

export function CateringBusinessJsonLd() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FoodEstablishment", "CateringService"],
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phoneRaw,
    email: siteConfig.contact.email,
    priceRange: siteConfig.priceRange,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    logo: `${siteConfig.url}/icon`,
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, UPI",
    openingHours: siteConfig.openingHours,
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
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: siteConfig.areasServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    servesCuisine: [
      "Traditional Indian",
      "North Indian",
      "Mughlai",
      "Rajasthani",
      "Pure Vegetarian",
      "Continental Live Stations",
    ],
    sameAs: [
      siteConfig.links.instagram,
      siteConfig.links.facebook,
      siteConfig.links.googleBusiness,
    ].filter(Boolean),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you offer food tasting sessions before final booking?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We host private menu tasting sessions for families upon shortlisting your event requirements, ensuring you experience the exact taste, spice levels, and presentation planned for your celebration.",
        },
      },
      {
        "@type": "Question",
        name: "What is your minimum and maximum guest capacity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We cater intimate gatherings starting from 100 guests up to grand mega-receptions of over 4,000 guests, with dedicated staff and dedicated kitchen managers assigned according to guest volume.",
        },
      },
      {
        "@type": "Question",
        name: "Can we customize our menu with regional and international cuisines?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Our culinary repertoire includes Traditional North Indian, Mughlai, Rajasthani, Gujarati, South Indian, as well as curated Continental and Asian live interactive stations.",
        },
      },
      {
        "@type": "Question",
        name: "How do you maintain food temperature and hygiene on-site?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We operate professional mobile warming units, insulated food transportation vessels, and commercial-grade mobile prep kitchens adhering to strict safety and sanitization standards.",
        },
      },
      {
        "@type": "Question",
        name: "How far in advance should we reserve our wedding date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Due to peak wedding season demands (Asoj, Kartik, and Magh dates), we recommend booking 3 to 6 months in advance to ensure date exclusivity and dedicated staff allocation.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
