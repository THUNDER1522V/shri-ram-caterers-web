import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Shri Ram Caterers",
  legalName: "Shri Ram Caterers",
  description:
    "Luxury wedding catering and bespoke celebration dining experiences crafted with royal hospitality, authentic taste, and meticulous management.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://shriramcaterers.com",
  ogImage: "/opengraph-image",
  links: {
    whatsapp: "https://wa.me/919999999999",
    phone: "tel:+919999999999",
    email: "contact@shriramcaterers.com",
    instagram: "https://instagram.com/shriramcaterers",
  },
  contact: {
    phoneFormatted: "+91 (0) 99999 99999",
    phoneRaw: "+919999999999",
    whatsappFormatted: "+91 (0) 99999 99999",
    whatsappRaw: "919999999999",
    email: "contact@shriramcaterers.com",
    address: {
      street: "Main Road",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
    },
  },
};
