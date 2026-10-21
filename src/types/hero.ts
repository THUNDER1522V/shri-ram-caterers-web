export type HeroMediaType = "video" | "image" | "youtube" | "instagram";

export interface HeroVideoItem {
  id: string;
  type?: HeroMediaType;
  title: string;
  subtitle?: string;
  guests?: string;
  location?: string;
  poster: string;
  src?: string;
  mp4?: string;
  webm?: string;
  youtubeId?: string;
  instagramUrl?: string;
  ariaLabel?: string;
  badge?: string;
}

export type HeroMediaItem = HeroVideoItem;


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
