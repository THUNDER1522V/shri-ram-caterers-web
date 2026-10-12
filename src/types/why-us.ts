export interface WhyUsPillar {
  id: string;
  iconName: "Sparkles" | "Clock" | "ShieldCheck" | "UtensilsCrossed" | string;
  title: string;
  description: string;
}

export interface WhyUsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  pillars: WhyUsPillar[];
}
