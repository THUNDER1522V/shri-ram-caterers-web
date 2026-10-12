import type { StatsContent } from "@/types/stats";

export const statsContent: StatsContent = {
  eyebrow: "Key Trust Metrics",
  metrics: [
    {
      id: "years-in-business",
      iconName: "Calendar",
      value: "15+",
      label: "Years in Business",
      subtext: "Generations of Culinary Heritage",
      isCountUp: true,
      valueNum: 15,
      suffix: "+",
    },
    {
      id: "weddings-catered",
      iconName: "Award",
      value: "500+",
      label: "Weddings Catered",
      subtext: "Flawless Execution Record",
      isCountUp: true,
      valueNum: 500,
      suffix: "+",
    },
    {
      id: "guests-served",
      iconName: "Users",
      value: "300,000+",
      label: "Guests Served",
      subtext: "Across North India",
      isCountUp: true,
      valueNum: 300000,
      suffix: "+",
    },
    {
      id: "google-rating",
      iconName: "Star",
      value: "4.8★",
      label: "Google Verified Rating",
      subtext: "Based on 200+ Host Reviews",
      isCountUp: true,
      valueNum: 4.8,
      suffix: "★",
    },
  ],
};
