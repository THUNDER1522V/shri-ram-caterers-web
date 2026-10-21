import type { SiteSettings } from "@/types/settings";

/**
 * Global Site Settings & Business Identity
 * Ready for Supabase / Headless CMS replacement without UI changes.
 */
export const siteSettings: SiteSettings = {
  brand: {
    name: "Shri Ram Caterers",
    legalName: "Shri Ram Caterers & Royal Banqueting Pvt. Ltd.",
    tagline: "Royal Indian Wedding & Luxury Pure-Vegetarian Catering",
    description:
      "Premier luxury wedding caterers in Delhi NCR, Agra, Jaipur & North India. Curating bespoke royal banquets, artisanal live food theatres, and generational heritage recipes with flawless white-glove hospitality.",
    establishedYear: 2009,
    logo: "/images/logo.png",
  },

  contact: {
    phoneFormatted: "+91 99999 99999",
    phoneRaw: "+919999999999",
    whatsappFormatted: "+91 99999 99999",
    whatsappRaw: "+919999999999",
    whatsappPrefilledMessage:
      "Hello Shri Ram Caterers, I am planning a celebration and would like to inquire about your luxury pure-vegetarian catering services.",
    email: "contact@shriramcaterers.com",
    cateringInquiriesEmail: "events@shriramcaterers.com",
    address: {
      street: "Near Royal Banquet Enclave, Ring Road",
      city: "New Delhi",
      state: "Delhi NCR",
      postalCode: "110001",
      country: "India",
      full: "Ring Road, New Delhi NCR & Serving Destination Palaces Across North India",
    },
    geo: {
      latitude: 28.6139,
      longitude: 77.209,
    },
    openingHours: "Monday to Sunday: 9:00 AM – 10:00 PM IST",
    priceRange: "₹₹₹₹",
    serviceRadius: "Delhi NCR, Agra, Jaipur, Udaipur, Gwalior & Destination Venues Across India",
  },

  socials: {
    whatsapp:
      "https://wa.me/919999999999?text=" +
      encodeURIComponent(
        "Hello Shri Ram Caterers, I would like to inquire about wedding catering services for my upcoming celebration."
      ),
    instagram: "https://instagram.com/shriramcaterers",
    googleReviews: "https://maps.google.com/?cid=shriramcaterers",
    youtube: "https://youtube.com/@shriramcaterers",
    facebook: "https://facebook.com/shriramcaterers",
  },

  navigation: [
    { title: "Celebrations", href: "#celebrations" },
    { title: "Legacy", href: "#legacy" },
    { title: "Cuisine", href: "#cuisine" },
    { title: "Live Counters", href: "#live-counters" },
    { title: "Gallery", href: "#gallery" },
    { title: "Reviews", href: "#reviews" },
    { title: "Process", href: "#process" },
    { title: "FAQ", href: "#faq" },
    { title: "Contact", href: "#contact" },
  ],

  footer: {
    quickLinks: [
      { title: "Royal Celebrations", href: "#celebrations" },
      { title: "Heritage Legacy", href: "#legacy" },
      { title: "Signature Cuisines", href: "#cuisine" },
      { title: "Live Food Theatres", href: "#live-counters" },
      { title: "Visual Gallery", href: "#gallery" },
      { title: "Host Reviews", href: "#reviews" },
      { title: "Hospitality Process", href: "#process" },
      { title: "FAQ", href: "#faq" },
    ],
    servicesLinks: [
      { title: "Grand Wedding Receptions", href: "#celebrations" },
      { title: "Sangeet & Cocktail Nights", href: "#celebrations" },
      { title: "Destination Palace Weddings", href: "#celebrations" },
      { title: "Artisan Live Chaat Bazaars", href: "#live-counters" },
      { title: "Executive Banqueting & Galas", href: "#celebrations" },
      { title: "Bespoke Royal Thali Dining", href: "#cuisine" },
    ],
    legalLinks: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Food Safety & FSSAI Standards", href: "#contact" },
    ],
    socialLinks: {
      whatsapp:
        "https://wa.me/919999999999?text=" +
        encodeURIComponent(
          "Hello Shri Ram Caterers, I would like to inquire about wedding catering."
        ),
      instagram: "https://instagram.com/shriramcaterers",
      googleReviews: "https://maps.google.com/?cid=shriramcaterers",
      youtube: "https://youtube.com/@shriramcaterers",
      facebook: "https://facebook.com/shriramcaterers",
    },
    copyright: "© 2026 Shri Ram Caterers & Royal Banqueting Pvt. Ltd. All Rights Reserved.",
    tagline: "Crafting Unforgettable Royal Gastronomic Celebrations Since 2009.",
    foodSafetyNotice:
      "100% Pure Vegetarian Kitchens • FSSAI Certified • Triple-Inspected Ingredients • Dedicated Jain Prep Counters",
  },

  domain: "https://shriramcaterers.com",
};

export default siteSettings;
