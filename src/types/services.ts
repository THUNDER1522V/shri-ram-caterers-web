export interface ServiceItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  mediaPlaceholder?: string;
  image?: string;
  video?: string;
  poster?: string;
  features: string[];
  buttonText?: string;
  buttonHref?: string;
  capacity?: string;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  services: ServiceItem[];
}

export interface LiveCounterItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  specialties: string[];
  video?: string;
  image?: string;
  chefNote?: string;
  badge?: string;
}

export interface LiveCountersContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  counters: LiveCounterItem[];
}

export interface CuisineItem {
  id: string;
  region: string;
  title: string;
  tagline: string;
  description: string;
  highlightDishes: string[];
  dietaryBadges: string[];
  image: string;
  video?: string;
}

export interface CuisineContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  cuisines: CuisineItem[];
}

export interface ProcessStepItem {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  iconName?: string;
}

export interface ProcessContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: ProcessStepItem[];
}

export interface LegacyPillarItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  stat?: string;
  statLabel?: string;
}

export interface LegacyContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  story: string[];
  pillars: LegacyPillarItem[];
  badges: string[];
}

