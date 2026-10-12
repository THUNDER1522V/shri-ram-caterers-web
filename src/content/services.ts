import type { ServicesContent } from "@/types/services";

export const servicesContent: ServicesContent = {
  eyebrow: "Celebrations We Cater",
  title: "Tailored Dining Experiences for Every Milestone",
  subtitle:
    "Whether an intimate pre-wedding gathering of 100 or a magnificent reception of 3,000 guests, our standard remains uncompromising perfection.",
  services: [
    {
      id: "wedding-catering",
      tag: "Primary Specialization",
      title: "Grand Wedding Receptions",
      description:
        "Complete luxury wedding banquets designed to honor royal dining traditions with multi-course plated service or grand buffet architecture.",
      mediaPlaceholder: "Grand Wedding Banquet Setup Photography",
      video: "/videos/grand-wedding.mp4",
      features: [
        "Custom Royal Indian Menus",
        "Experienced On-Ground Floor Captains",
        "Dedicated VIP & Family Dining Service",
      ],
      buttonText: "Inquire for Wedding",
      buttonHref: "#contact",
    },
    {
      id: "pre-wedding-sangeet",
      tag: "Pre-Wedding Celebrations",
      title: "Sangeet, Mehendi & Cocktails",
      description:
        "Vibrant, interactive food experiences featuring artisan street food stations, live grills, and craft mocktails tailored for lively social evenings.",
      mediaPlaceholder: "Vibrant Sangeet Food Theatre Photography",
      video: "/videos/v1.mp4",
      features: [
        "Artisan Live Chaat & Street Food Bars",
        "Bespoke Finger Foods & Canapés",
        "Contemporary Fusion Presentations",
      ],
      buttonText: "Plan Sangeet Menu",
      buttonHref: "#contact",
    },
    {
      id: "live-food-theatres",
      tag: "Signature Culinary Displays",
      title: "Live Interactive Food Theatres",
      description:
        "Theatrical culinary stations where master chefs prepare hot breads, live tandoor specialties, and sizzling regional dishes in front of your guests.",
      mediaPlaceholder: "Master Chefs at Live Counter Photography",
      video: "/videos/livecounter.mp4",
      features: [
        "Wood-Fired Tandoor & Grill Counters",
        "Live Regional Dal & Bati Theatres",
        "Exotic Live Dessert & Jalebi Stations",
      ],
      buttonText: "Explore Live Counters",
      buttonHref: "#contact",
    },
    {
      id: "seasonal-dishes",
      tag: "Fresh & Seasonal",
      title: "Seasonal Dishes & Delights",
      description:
        "Embrace the flavors of the season with our handcrafted, premium seasonal dishes carefully curated to highlight the freshest ingredients.",
      mediaPlaceholder: "Farm Fresh Ingredients & Seasonal Delicacies",
      video: "/videos/mango.mp4",
      features: [
        "Farm-to-table fresh ingredients",
        "Signature seasonal fruit desserts",
        "Vibrant and refreshing presentations",
      ],
      buttonText: "View Seasonal Curations",
      buttonHref: "#contact",
    },
    {
      id: "corporate-catering",
      tag: "Corporate Hospitality",
      title: "Corporate Galas & Summits",
      description:
        "Refined executive banqueting, formal plated conferences, and gala dinners managed with impeccable punctuality and corporate decorum.",
      mediaPlaceholder: "Corporate Executive Banqueting",
      video: "/videos/divyansh-naina.mp4",
      features: [
        "Executive High-Tea & Lunch Buffets",
        "Punctual Protocol & Silent Service",
        "Custom Corporate Branding Displays",
      ],
      buttonText: "Book Corporate Catering",
      buttonHref: "#contact",
    },
    {
      id: "destination-wedding",
      tag: "Heritage & Destination",
      title: "Destination Weddings & Palaces",
      description:
        "Comprehensive mobile kitchens and logistics deployed across Rajasthan, Agra, and North India palace venues with full convoy support.",
      mediaPlaceholder: "Palace Destination Wedding Banqueting",
      video: "/videos/themes-and-counters.mp4",
      features: [
        "Complete Mobile Commercial Kitchens",
        "Multi-Day Event Catering Packages",
        "Regional Specialty Master Chefs On-Site",
      ],
      buttonText: "Plan Destination Event",
      buttonHref: "#contact",
    },
  ],
};
