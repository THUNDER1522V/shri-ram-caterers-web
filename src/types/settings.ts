export interface BrandSettings {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  establishedYear: number;
  logo: string;
}

export interface AddressSettings {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  full: string;
}

export interface GeoSettings {
  latitude: number;
  longitude: number;
}

export interface ContactSettings {
  phoneFormatted: string;
  phoneRaw: string;
  whatsappFormatted: string;
  whatsappRaw: string;
  whatsappPrefilledMessage: string;
  email: string;
  cateringInquiriesEmail: string;
  address: AddressSettings;
  geo: GeoSettings;
  openingHours: string;
  priceRange: string;
  serviceRadius: string;
}

export interface SocialLinksSettings {
  whatsapp: string;
  instagram: string;
  googleReviews: string;
  youtube?: string;
  facebook?: string;
}

export interface NavigationLinkItem {
  title: string;
  href: string;
  external?: boolean;
  badge?: string;
}

export interface FooterColumnSettings {
  title: string;
  items: NavigationLinkItem[];
}

export interface FooterSettings {
  quickLinks: NavigationLinkItem[];
  servicesLinks: NavigationLinkItem[];
  legalLinks: NavigationLinkItem[];
  socialLinks: SocialLinksSettings;
  copyright: string;
  tagline: string;
  foodSafetyNotice: string;
}

export interface SiteSettings {
  brand: BrandSettings;
  contact: ContactSettings;
  socials: SocialLinksSettings;
  navigation: NavigationLinkItem[];
  footer: FooterSettings;
  domain: string;
}
