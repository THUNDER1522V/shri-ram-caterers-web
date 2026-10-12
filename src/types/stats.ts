export interface TrustMetric {
  id: string;
  value: string;
  label: string;
  subtext: string;
  isCountUp?: boolean;
  valueNum?: number;
  suffix?: string;
  iconName?: "Calendar" | "Award" | "Users" | "Star" | string;
}

export interface StatsContent {
  eyebrow?: string;
  metrics: TrustMetric[];
}
