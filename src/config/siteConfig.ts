import type { SiteConfig } from "@/types";
import { contactConfig } from "@/content/contact";

/**
 * Centralized Site Configuration & Business Profile
 * Driven directly by src/content/contact.ts
 */
export const siteConfig: SiteConfig = {
  // Business Name
  name: contactConfig.businessName,
  businessName: contactConfig.businessName,
  legalName: contactConfig.legalName,

  // City & Geographic Coverage
  city: contactConfig.address.city,
  areasServed: contactConfig.areasServed,

  // Brand SEO Descriptions & Domain
  description:
    "Luxury wedding caterers in New Delhi offering royal pure-vegetarian dining, bespoke banquet management, artisan live counters & authentic heritage recipes.",
  domain: "https://shriramcaterers.com",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://shriramcaterers.com",
  ogImage: "/opengraph-image",

  // Operating Hours & Pricing
  openingHours: contactConfig.openingHours,
  priceRange: "₹₹₹₹",

  // Geo Coordinates (New Delhi NCR)
  geo: contactConfig.geo,

  // Contact Info & Direct Links
  contact: {
    phoneFormatted: contactConfig.phoneFormatted,
    phoneRaw: contactConfig.phoneRaw,
    whatsappFormatted: contactConfig.whatsappFormatted,
    whatsappRaw: contactConfig.whatsappRaw,
    whatsappPrefilledMessage: contactConfig.whatsappPrefilledMessage,
    email: contactConfig.email,
    address: contactConfig.address,
  },

  // Social & Direct Action Links
  links: contactConfig.links,
};

export default siteConfig;
