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

export interface SocialLinks {
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  googleBusiness: string;
}

export interface ContactConfig {
  businessName: string;
  legalName: string;
  phoneFormatted: string;
  phoneRaw: string;
  whatsappFormatted: string;
  whatsappRaw: string;
  whatsappPrefilledMessage: string;
  email: string;
  address: AddressConfig;
  geo: GeoConfig;
  areasServed: string[];
  openingHours: string;
  links: SocialLinks;
}

export interface BookingCTAContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  callButtonText: string;
  whatsappButtonText: string;
}
