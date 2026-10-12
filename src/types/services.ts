export interface ServiceItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  mediaPlaceholder?: string;
  image?: string;
  video?: string;
  features: string[];
  buttonText?: string;
  buttonHref?: string;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  services: ServiceItem[];
}
