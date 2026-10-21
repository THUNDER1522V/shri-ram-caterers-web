import { servicesContent, liveCountersContent, cuisineContent } from "./services";
import { galleryContent } from "./gallery";
import { reviewsContent } from "./reviews";
import { faqContent } from "./faq";
import { siteSettings } from "./settings";
import type { HeroContent } from "@/types/hero";
import type { TrustMetric } from "@/types/stats";
import type { LegacyContent, ProcessContent } from "@/types/services";

/**
 * Master Homepage Content System
 * Structured, CMS-ready data consuming directly from content modules.
 * This file can be seamlessly replaced by a Supabase API call in Phase 3.
 */

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
      href: siteSettings.socials.whatsapp,
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
      id: "bride-entry-gala",
      type: "video",
      title: "Royal Bride Entry Gala",
      subtitle: "Grand Entrance Ceremony & Welcome Banquet",
      guests: "1,200 Guests",
      location: "The Leela Palace, New Delhi",
      poster: "/images/hero-reel-poster.webp",
      mp4: "/videos/hero_video.mp4",
      src: "/videos/hero_video.mp4",
      ariaLabel: "Royal Bride Entry ceremony reel",
      badge: "Featured Event",
    },
    {
      id: "live-cooking-theatre",
      type: "video",
      title: "Live Cooking Theatres",
      subtitle: "Master Chef Culinary Artistry & Sizzling Delicacies",
      guests: "800 Guests",
      location: "Taj Hotel & Convention Centre, Agra",
      poster: "/posters/live-cooking.svg",
      mp4: "/videos/livecounter.mp4",
      src: "/videos/livecounter.mp4",
      ariaLabel: "Live cooking theatre reel",
      badge: "Artisan Station",
    },
    {
      id: "grand-royal-buffet",
      type: "video",
      title: "Grand Royal Buffet Architecture",
      subtitle: "Multi-Tier Luxury Banquet Lines & Ambient Warmers",
      guests: "2,000 Guests",
      location: "Jaypee Greens Golf & Spa Resort, Greater Noida",
      poster: "/images/grand-wedding-reception.png",
      mp4: "/videos/grand-wedding.mp4",
      src: "/videos/grand-wedding.mp4",
      ariaLabel: "Grand Royal Buffet reel",
      badge: "Mega Banquet",
    },
    {
      id: "artisan-dessert-counter",
      type: "video",
      title: "Artisan Heritage Mithai Station",
      subtitle: "Live Saffron Jalebis, Malai Rabri & Royal Mithai",
      guests: "600 Guests",
      location: "Chattarpur Farms Estate, New Delhi",
      poster: "/posters/dessert-counter.svg",
      mp4: "/videos/v1.mp4",
      src: "/videos/v1.mp4",
      ariaLabel: "Dessert counter reel",
      badge: "Royal Mithai",
    },
    {
      id: "chaat-bazaar-moments",
      type: "video",
      title: "Grand Banarasi Chaat Bazaar",
      subtitle: "Authentic Street Food Theatre & Kullhad Chaat",
      guests: "1,500 Guests",
      location: "ITC Maurya, Diplomatic Enclave, New Delhi",
      poster: "/images/hero-reel-poster.webp",
      mp4: "/videos/bhelpuri.mp4",
      src: "/videos/bhelpuri.mp4",
      ariaLabel: "Guests celebrating chaat bazaar reel",
      badge: "Chaat Bazaar",
    },
  ],
};

export const trustStripContent = {
  eyebrow: "Key Trust Metrics",
  metrics: [
    {
      id: "events-catered",
      value: "500+",
      valueNum: 500,
      suffix: "+",
      isCountUp: true,
      label: "Grand Banquets Catered",
      subtext: "Across Delhi NCR & Destination Palaces",
      iconName: "Calendar",
    },
    {
      id: "years-legacy",
      value: "15+",
      valueNum: 15,
      suffix: "+",
      isCountUp: true,
      label: "Years of Royal Legacy",
      subtext: "Serving Distinguished Families Since 2009",
      iconName: "Award",
    },
    {
      id: "pure-vegetarian",
      value: "100%",
      valueNum: 100,
      suffix: "%",
      isCountUp: true,
      label: "Pure Vegetarian Sanctity",
      subtext: "Dedicated Kitchens & Jain Specializations",
      iconName: "Sparkles",
    },
    {
      id: "google-rating",
      value: "4.8★",
      valueNum: 4.8,
      suffix: "★",
      isCountUp: true,
      label: "Verified Google Rating",
      subtext: "200+ Host Family Testimonials",
      iconName: "Star",
    },
  ] as TrustMetric[],
};

export const legacyContent: LegacyContent = {
  eyebrow: "Our Heritage & Lineage",
  title: "Crafted by Tradition, Refined by Royal Protocol",
  subtitle:
    "Founded in 2009 with a sacred devotion to pure-vegetarian culinary grandeur, Shri Ram Caterers has elevated Indian wedding banqueting into an unforgettable art form.",
  story: [
    "For over fifteen years, our master chefs and hospitality captains have honored the royal dastarkhwans of Awadh, the fortress feasts of Rajasthan, and the vibrant culinary bazaars of Old Delhi.",
    "Every recipe in our repertoire is cooked without shortcuts: slow-simmered in pure cow desi ghee, infused with whole spices ground by stone, and prepared in strictly dedicated vegetarian kitchens with separate Jain sanitized stations.",
    "Our turnkey event execution ensures that host families never worry about logistics. From private tastings to white-glove elder dining service, we deliver serenity and gastronomic splendor.",
  ],
  pillars: [
    {
      id: "generational-recipes",
      title: "Generational Heritage Recipes",
      description:
        "Time-honored royal Awadhi, Marwari, and Punjabi preparations passed down through master halwais and khansamas, slow-cooked in traditional brass and clay ware.",
      iconName: "Sparkles",
      stat: "150+",
      statLabel: "Secret Spice Blends",
    },
    {
      id: "pure-veg-sanctity",
      title: "100% Pure Vegetarian Sanctity",
      description:
        "Strictly pure-vegetarian logistics fleet, dedicated cooking utensils, and specialized onion-garlic-free Jain prep lines audited under rigorous FSSAI standards.",
      iconName: "ShieldCheck",
      stat: "100%",
      statLabel: "Purity Guaranteed",
    },
    {
      id: "white-glove-service",
      title: "White-Glove Floor Captaincy",
      description:
        "Formally attired banquet captains and trained service personnel who practice elder-first dining protocols and discreet, synchronized silver table service.",
      iconName: "Award",
      stat: "250+",
      statLabel: "Trained Floor Staff",
    },
    {
      id: "turnkey-orchestration",
      title: "Mega-Banquet Logistics",
      description:
        "Self-contained mobile commercial kitchens, temperature-controlled convoys, and redundant backup systems capable of flawlessly serving 100 to 5,000+ guests.",
      iconName: "Clock",
      stat: "5,000+",
      statLabel: "Max Guest Scale",
    },
  ],
  badges: [
    "FSSAI Certified & Inspected",
    "100% A2 Pure Cow Ghee",
    "Dedicated Separate Jain Kitchens",
    "Zero Artificial Colors or Additives",
  ],
};

export const processContent: ProcessContent = {
  eyebrow: "Our Hospitality Journey",
  title: "How We Craft Your Royal Celebration",
  subtitle:
    "From your first private family tasting to the final midnight sweet counter, our meticulous 4-step banquet orchestration ensures perfection at every turn.",
  steps: [
    {
      step: "01",
      title: "Private Tasting & Menu Curation",
      subtitle: "Personalized Consultation with Senior Master Chefs",
      description:
        "We welcome the host family to an exclusive private tasting session to sample gravies, live counter starters, and artisanal desserts, carefully tailoring spice levels and dietary requests.",
      highlights: [
        "Interactive multi-course sampling session",
        "Customization for Jain, Vegan & Sattvic guests",
        "Selection of seasonal specialty produce",
      ],
      iconName: "Utensils",
    },
    {
      step: "02",
      title: "Architectural Layout & Styling",
      subtitle: "Banquet Flow Mapping & Thematic Live Station 3D Design",
      description:
        "Our banquet directors collaborate with your wedding decorators to map out guest traffic flow, brass chafing lines, live counter aesthetics, and elder seating protocols.",
      highlights: [
        "Optimized layout to eliminate buffet queues",
        "Thematic brass, copper, or contemporary styling",
        "Dedicated VIP and family dining zones",
      ],
      iconName: "Layers",
    },
    {
      step: "03",
      title: "Farm-to-Table Artisanal Sourcing",
      subtitle: "Triple-Inspected Pure Ingredients & Stone-Ground Spices",
      description:
        "We source peak-fresh organic seasonal produce, cold-pressed oils, pure A2 cow ghee, and hand-selected whole spices, batch-tested 24 hours before the event.",
      highlights: [
        "Zero artificial colors or preservatives",
        "Daily farm-direct dairy and cottage cheese",
        "Temperature-monitored refrigerated transport",
      ],
      iconName: "CheckCircle",
    },
    {
      step: "04",
      title: "White-Glove Banquet Execution",
      subtitle: "Synchronized Service & Senior Floor Captaincy",
      description:
        "On event day, our master chefs and uniformed captains deploy 6 hours in advance, ensuring piping hot food from first arrival to the last departing guest.",
      highlights: [
        "Live cooking theatres fired in real time",
        "Continuous hot food replenishments without lag",
        "White-glove silver service for elder tables",
      ],
      iconName: "Sparkles",
    },
  ],
};

export const contactCTAContent = {
  eyebrow: "Reserve Your Auspicious Date",
  title: "Let Us Create A Royal Feast For Your Celebration",
  subtitle:
    "Connect with our Senior Banquet Directors for an exclusive menu consultation, date availability, and bespoke quote for your upcoming milestone.",
  callButtonText: "Call Us Directly",
  whatsappButtonText: "Inquire on WhatsApp",
  guaranteeText: "Guaranteed Response within 2 Hours • Complimentary Tasting on Confirmation",
};

/**
 * Aggregated Homepage Export
 */
export const homepageContent = {
  hero: heroContent,
  trustStrip: trustStripContent,
  legacy: legacyContent,
  celebrations: servicesContent,
  cuisine: cuisineContent,
  liveCounters: liveCountersContent,
  gallery: galleryContent,
  googleReviews: {
    eyebrow: reviewsContent.eyebrow,
    title: "Verified Host Family Reviews",
    subtitle: reviewsContent.subtitle,
    summary: reviewsContent.googleSummary,
    reviews: reviewsContent.googleReviews,
  },
  testimonials: {
    eyebrow: "Live Video Stories",
    title: "Memories From Families We Have Served",
    subtitle: "Watch real host families share their experience with Shri Ram Caterers.",
    videos: reviewsContent.videoReviews,
  },
  process: processContent,
  faq: faqContent,
  contact: contactCTAContent,
  settings: siteSettings,
};

export default homepageContent;
