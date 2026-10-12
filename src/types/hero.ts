export interface HeroVideoItem {
  id: string;
  title: string;
  subtitle?: string;
  guests?: string;
  location?: string;
  poster: string;
  mp4: string;
  webm?: string;
  ariaLabel?: string;
  badge?: string;
}

export interface HeroTrustPill {
  stat: string;
  label: string;
}

export interface HeroAction {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "text";
  icon?: "calendar" | "whatsapp" | "arrow" | "quote";
  isExternal?: boolean;
}

export interface HeroContent {
  eyebrow: string;
  headline: {
    primary: string;
    secondary: string;
    accent: string;
  };
  subline: string;
  actions: HeroAction[];
  trustTitle: string;
  trustPills: HeroTrustPill[];
  videos: HeroVideoItem[];
}
