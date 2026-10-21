export * from "./hero";
export * from "./stats";
export * from "./services";
export * from "./menu";
export * from "./why-us";
export * from "./gallery";
export * from "./reviews";
export * from "./faq";
export * from "./contact";
export * from "./navigation";
export * from "./seo";
export * from "./settings";


export interface SiteConfig {
  name: string;
  businessName: string;
  legalName: string;
  city: string;
  areasServed: string[];
  description: string;
  domain: string;
  url: string;
  ogImage: string;
  openingHours: string;
  priceRange: string;
  geo: import("./contact").GeoConfig;
  links: import("./contact").SocialLinks;
  contact: {
    phoneFormatted: string;
    phoneRaw: string;
    whatsappFormatted: string;
    whatsappRaw: string;
    whatsappPrefilledMessage: string;
    email: string;
    address: import("./contact").AddressConfig;
  };
}
