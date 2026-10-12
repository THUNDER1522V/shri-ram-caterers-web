import type { HeroContent } from "@/types/hero";

export const heroContent: HeroContent = {
  eyebrow: "Royal Indian Wedding Catering",
  headline: {
    primary: "Grand Feasts.",
    secondary: "Royal Hospitality.",
    accent: "Royal Hospitality.",
  },
  subline:
    "Bespoke pure-vegetarian culinary curations, heritage recipes, and flawless banquet management — crafted for North India's most cherished celebrations.",
  actions: [
    {
      label: "Get a Quote",
      href: "#contact",
      variant: "primary",
      icon: "calendar",
    },
    {
      label: "WhatsApp Us",
      href: "https://wa.me/919999999999?text=" +
        encodeURIComponent(
          "Hello Shri Ram Caterers, I would like to inquire about wedding catering services for my upcoming celebration."
        ),
      variant: "secondary",
      icon: "whatsapp",
      isExternal: true,
    },
    {
      label: "Explore Celebrations",
      href: "#celebrations",
      variant: "text",
      icon: "arrow",
    },
  ],
  trustTitle: "Trusted by India's finest families",
  trustPills: [
    { stat: "500+", label: "Events Catered" },
    { stat: "15+ Years", label: "of Royal Hospitality" },
    { stat: "100%", label: "Pure Vegetarian" },
  ],
  videos: [
    {
      id: "bride-entry",
      title: "Bride Entry",
      subtitle: "Royal Entrance Ceremony",
      guests: "1,200 Guests",
      location: "Leela Palace, New Delhi",
      poster: "/images/hero-reel-poster.webp",
      mp4: "/videos/hero_video.mp4",
      ariaLabel: "Bride Entry ceremony reel",
      badge: "Featured Event",
    },
    {
      id: "live-cooking",
      title: "Live Cooking Theatres",
      subtitle: "Master Chef Culinary Artistry",
      guests: "800 Guests",
      location: "Taj Hotel, Agra",
      poster: "/posters/live-cooking.svg",
      mp4: "/videos/livecounter.mp4",
      ariaLabel: "Live cooking theatre reel",
      badge: "Artisan Station",
    },
    {
      id: "grand-buffet",
      title: "Grand Royal Buffet",
      subtitle: "Multi-Tier Luxury Display",
      guests: "2,000 Guests",
      location: "Jaypee Greens, Noida",
      poster: "/posters/grand-buffet.svg",
      mp4: "/videos/grand-wedding.mp4",
      ariaLabel: "Grand Royal Buffet reel",
      badge: "Mega Banquet",
    },
    {
      id: "dessert-counter",
      title: "Dessert Counter",
      subtitle: "Artisan Heritage Sweets",
      guests: "600 Guests",
      location: "Farm House, Chattarpur",
      poster: "/posters/dessert-counter.svg",
      mp4: "/videos/v1.mp4",
      ariaLabel: "Dessert counter reel",
      badge: "Royal Mithai",
    },
    {
      id: "guests-enjoying",
      title: "Guests & Celebrations",
      subtitle: "Unforgettable Moments",
      guests: "1,500 Guests",
      location: "ITC Maurya, New Delhi",
      poster: "/posters/guests-enjoying.svg",
      mp4: "/videos/bhelpuri.mp4",
      ariaLabel: "Guests celebrating reel",
      badge: "Reception Gala",
    },
  ],
};
