export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  imagePlaceholder?: string;
  image?: string;
  dietaryTag?: string;
  isSignature?: boolean;
}

export interface MenuContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  dishes: MenuItem[];
}
