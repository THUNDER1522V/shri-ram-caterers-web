export interface SiteConfig {
  name: string;
  legalName: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    whatsapp: string;
    phone: string;
    email: string;
    instagram?: string;
    facebook?: string;
    googleBusiness?: string;
  };
  contact: {
    phoneFormatted: string;
    phoneRaw: string;
    whatsappFormatted: string;
    whatsappRaw: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}
