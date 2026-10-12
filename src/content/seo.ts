import { contactConfig } from "./contact";

export const seoConfig = {
  defaultTitle: "Shri Ram Caterers | Luxury Wedding Caterers in New Delhi",
  titleTemplate: "%s | Shri Ram Caterers",
  description:
    "Luxury wedding caterers in New Delhi offering royal pure-vegetarian dining, bespoke banquet management, artisan live counters & authentic heritage recipes.",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://shriramcaterers.com",
  ogImage: "/opengraph-image",
  keywords: [
    "Luxury wedding caterers",
    "Royal pure vegetarian catering",
    "Catering in New Delhi NCR",
    "Bespoke wedding banquets",
    "Live food theatres",
    "Heritage Indian catering",
  ],
  author: contactConfig.legalName,
};
