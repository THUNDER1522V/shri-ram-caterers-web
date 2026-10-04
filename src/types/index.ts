export interface AddressConfig {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface GeoConfig {
  latitude: number;
  longitude: number;
}

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
  geo: GeoConfig;
  links: {
    whatsapp: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    googleBusiness?: string;
  };
  contact: {
    phoneFormatted: string;
    phoneRaw: string;
    whatsappFormatted: string;
    whatsappRaw: string;
    whatsappPrefilledMessage: string;
    email: string;
    address: AddressConfig;
  };
}
