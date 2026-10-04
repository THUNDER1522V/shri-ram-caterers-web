import type { SiteConfig } from "@/types";

/**
 * Centralized Site Configuration & Business Profile
 * Edit these values once to update all SEO meta tags, OpenGraph data,
 * LocalBusiness JSON-LD schemas, contact buttons, and footer details.
 */
export const siteConfig: SiteConfig = {
  // Business Name
  name: "Shri Ram Caterers",
  businessName: "Shri Ram Caterers",
  legalName: "Shri Ram Caterers Private Limited",

  // City & Geographic Coverage
  city: "New Delhi",
  areasServed: [
    "New Delhi",
    "Delhi NCR",
    "Gurugram",
    "Noida",
    "Greater Noida",
    "Faridabad",
    "Ghaziabad",
    "Jaipur",
    "Agra",
    "Chandigarh",
    "North India",
  ],

  // Brand SEO Descriptions & Domain
  description:
    "Luxury wedding caterers in New Delhi offering royal pure-vegetarian dining, bespoke banquet management, artisan live counters & authentic heritage recipes.",
  domain: "https://shriramcaterers.com",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://shriramcaterers.com",
  ogImage: "/opengraph-image",

  // Operating Hours & Pricing
  openingHours: "Mo-Su 09:00-21:00",
  priceRange: "₹₹₹₹",

  // Geo Coordinates (New Delhi NCR)
  geo: {
    latitude: 28.6139,
    longitude: 77.209,
  },

  // Contact Info & Direct Links
  contact: {
    phoneFormatted: "+91 99999 99999",
    phoneRaw: "+919999999999",
    whatsappFormatted: "+91 99999 99999",
    whatsappRaw: "919999999999",
    whatsappPrefilledMessage:
      "Hello Shri Ram Caterers, I would like to inquire about wedding catering services for my upcoming celebration.",
    email: "contact@shriramcaterers.com",
    address: {
      street: "Main Ring Road, South Extension",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110049",
      country: "IN",
    },
  },

  // Social & Direct Action Links
  links: {
    whatsapp:
      "https://wa.me/919999999999?text=" +
      encodeURIComponent(
        "Hello Shri Ram Caterers, I would like to inquire about wedding catering services for my upcoming celebration."
      ),
    phone: "tel:+919999999999",
    email: "mailto:contact@shriramcaterers.com",
    instagram: "https://instagram.com/shriramcaterers",
    facebook: "https://facebook.com/shriramcaterers",
    googleBusiness: "https://maps.google.com/?cid=shriramcaterers",
  },
};

export default siteConfig;
