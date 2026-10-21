import type {
  ServicesContent,
  LiveCountersContent,
  CuisineContent,
} from "@/types/services";

/**
 * Celebrations Services Content
 * Ready for Supabase / Headless CMS replacement without UI changes.
 */
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
        "Complete luxury wedding banquets designed to honor royal dining traditions with multi-tier grand buffet architecture or silver-service plated dining.",
      mediaPlaceholder: "Grand Wedding Banquet Setup Photography",
      video: "/videos/grand-wedding.mp4",
      poster: "/images/hero-reel-poster.webp",
      features: [
        "Bespoke Royal Indian Heritage Menus",
        "Disciplined On-Ground Uniformed Floor Captains",
        "Dedicated VIP & Elder Family Dining Protocol",
      ],
      buttonText: "Inquire for Wedding",
      buttonHref: "#contact",
      capacity: "500 to 5,000+ Guests",
    },
    {
      id: "pre-wedding-sangeet",
      tag: "Pre-Wedding Celebrations",
      title: "Sangeet, Mehendi & Cocktails",
      description:
        "High-energy, interactive dining featuring artisan street food stations, live sizzlers, and botanical craft mocktail bars tailored for joyous social evenings.",
      mediaPlaceholder: "Vibrant Sangeet Food Theatre Photography",
      video: "/videos/v1.mp4",
      poster: "/posters/live-cooking.svg",
      features: [
        "Artisan Live Chaat & Street Food Theatres",
        "Bespoke Gourmet Finger Foods & Canapés",
        "Smoking Nitrogen Mocktails & Botanical Bars",
      ],
      buttonText: "Plan Sangeet Menu",
      buttonHref: "#contact",
      capacity: "150 to 1,500 Guests",
    },
    {
      id: "live-food-theatres",
      tag: "Signature Culinary Displays",
      title: "Live Interactive Food Theatres",
      description:
        "Theatrical culinary stations where master chefs prepare clay-oven breads, sizzling regional delicacies, and artisan desserts live before your guests.",
      mediaPlaceholder: "Master Chefs at Live Counter Photography",
      video: "/videos/livecounter.mp4",
      poster: "/posters/live-cooking.svg",
      features: [
        "Wood-Fired Tandoor & Artisan Grill Counters",
        "Live Regional Dal, Bati & Handi Theatres",
        "Exotic Live Saffron Jalebi & Rabri Kadais",
      ],
      buttonText: "Explore Live Counters",
      buttonHref: "#live-counters",
      capacity: "Any Gathering Size",
    },
    {
      id: "destination-wedding",
      tag: "Heritage & Destination",
      title: "Destination Weddings & Palaces",
      description:
        "Comprehensive mobile commercial kitchens and master chef convoys deployed across Rajasthan, Agra, and North India palace estates with full logistics support.",
      mediaPlaceholder: "Palace Destination Wedding Banqueting",
      video: "/videos/themes-and-counters.mp4",
      poster: "/posters/final-venue.svg",
      features: [
        "Self-Sufficient Commercial Mobile Kitchen Fleet",
        "Multi-Day Curated Thematic Celebration Menus",
        "Regional Specialty Master Chefs On-Ground",
      ],
      buttonText: "Plan Destination Event",
      buttonHref: "#contact",
      capacity: "Multi-Day Banquets",
    },
    {
      id: "corporate-catering",
      tag: "Corporate Hospitality",
      title: "Corporate Galas & Summits",
      description:
        "Refined executive banqueting, formal plated conferences, and anniversary galas managed with impeccable protocol, punctuality, and corporate decorum.",
      mediaPlaceholder: "Corporate Executive Banqueting",
      video: "/videos/divyansh-naina.mp4",
      poster: "/posters/grand-buffet.svg",
      features: [
        "Executive High-Tea & Multi-Cuisine Luncheon Buffets",
        "Punctual Protocol & Discreet White-Glove Service",
        "Custom Corporate Thematic Branding Displays",
      ],
      buttonText: "Book Corporate Catering",
      buttonHref: "#contact",
      capacity: "100 to 2,000 Guests",
    },
    {
      id: "seasonal-curations",
      tag: "Farm-to-Table Fresh",
      title: "Seasonal Fruit & Artisan Delights",
      description:
        "Embrace peak seasonal harvest with bespoke curations highlighting handpicked Ratnagiri mangoes, winter makki-sarson festivals, and fresh botanical cordials.",
      mediaPlaceholder: "Farm Fresh Ingredients & Seasonal Delicacies",
      video: "/videos/mango.mp4",
      poster: "/posters/dessert-counter.svg",
      features: [
        "Handpicked 100% Farm-Fresh Seasonal Produce",
        "Signature Live Seasonal Fruit Dessert Theatres",
        "Artisanal Cold-Pressed & Refreshing Infusions",
      ],
      buttonText: "View Seasonal Menus",
      buttonHref: "#contact",
      capacity: "Available All Seasons",
    },
  ],
};

/**
 * Live Counters Content
 * Interactive live culinary theatres for celebrations
 */
export const liveCountersContent: LiveCountersContent = {
  eyebrow: "Interactive Theatres",
  title: "Live Culinary Artistry",
  subtitle:
    "Engage your guests with the sights, aromas, and sizzling sounds of master chefs preparing royal delicacies fresh on demand.",
  counters: [
    {
      id: "amritsari-kulcha",
      tag: "Clay Tandoor Master",
      title: "Amritsari Kulcha & Pindi Chole Theatre",
      description:
        "Authentic clay-oven blistered kulchas stuffed with spiced potatoes and paneer, served piping hot with 12-hour slow-simmered Amritsari chole, imli chutney, and white butter.",
      specialties: [
        "Crisp 16-Layer Stuffed Tandoori Kulchas",
        "Traditional Amritsari Pindi Chole",
        "Farm-Fresh Cultured Makhan & Pickled Onions",
      ],
      video: "/videos/livecounter.mp4",
      chefNote: "Prepared live in traditional clay tandoors at 350°C",
      badge: "Guest Favorite",
    },
    {
      id: "chaat-bazaar",
      tag: "Heritage Street Food",
      title: "Grand Banarasi Chaat Bazaar",
      description:
        "An opulent celebration of Banaras and Old Delhi chaat heritage. From hand-mashed Tamatar Chaat in clay pots to delicate crispy Palak Patta Chaat and 5-flavor herbal golgappa fountains.",
      specialties: [
        "Sizzling Banarasi Tamatar Chaat in Kullhad",
        "Crispy Baby Spinach Palak Patta Chaat",
        "5-Spiced Herbal Water Golgappa Bar",
      ],
      video: "/videos/bhelpuri.mp4",
      chefNote: "Crafted with pure desi ghee and house-ground heritage masalas",
      badge: "Signature Station",
    },
    {
      id: "awadhi-biryani",
      tag: "Royal Dum Pukht",
      title: "Royal Awadhi Dum Biryani & Tawa Counter",
      description:
        "Fragrant aged Basmati rice layered with seasonal organic vegetables and hand-pounded Awadhi spices, sealed in clay handis with dough and slow-steamed over glowing charcoal.",
      specialties: [
        "Clay Handi Sealed Subz Dum Biryani",
        "Live Roomali Roti Tossed on Inverted Kadai",
        "Burani Garlic Raita & Mirchi Ka Salan",
      ],
      video: "/videos/buffet-architecture.mp4",
      chefNote: "Handis unsealed fresh at your banquet floor for royal aroma",
      badge: "Royal Speciality",
    },
    {
      id: "wood-fired-grills",
      tag: "Contemporary Artisan",
      title: "Wood-Fired Neapolitan Pizza & Gourmet Grills",
      description:
        "Live miniature stone ovens firing artisanal 72-hour fermented sourdough pizzas alongside charred cottage cheese skewers, smoked mushrooms, and flame-kissed Mediterranean vegetables.",
      specialties: [
        "Live 90-Second Blistered Neapolitan Pizzas",
        "Charred Saffron & Truffle Paneer Skewers",
        "Herb-Infused Smoked Forest Mushrooms",
      ],
      video: "/videos/v1.mp4",
      chefNote: "Fired with aromatic applewood and seasoned oak charcoal",
      badge: "Global Fusion",
    },
    {
      id: "jalebi-rabri",
      tag: "Heritage Mithai Live",
      title: "Golden Saffron Jalebi & Lachedar Rabri",
      description:
        "Thick iron kadai filled with bubbling pure cow ghee, piped into crisp golden spirals, steeped in organic saffron syrup, and topped with 6-hour slow-reduced lachedar rabri.",
      specialties: [
        "Crisp Saffron-Infused Golden Jalebis",
        "Rich Hand-Stirred Malai Lachedar Rabri",
        "Silver Vark & Crushed Iranian Pistachio Garnish",
      ],
      video: "/videos/mango.mp4",
      chefNote: "100% A2 Pure Desi Ghee preparation guaranteed",
      badge: "Sweet Finale",
    },
    {
      id: "botanical-mocktails",
      tag: "Artisan Mixology",
      title: "Exotic Botanical Welcome Bar",
      description:
        "An enchanting arrival experience featuring handcrafted botanical infusions, crushed fruit coolers, smoking nitrogen garnishes, and cold-pressed floral syrups.",
      specialties: [
        "Smoked Jamun & Pink Himalayan Salt Cordials",
        "Kesar-Kasturi Scented Royal Sharbats",
        "Sub-Zero Nitrogen Fruit Cloud Mocktails",
      ],
      video: "/videos/exotic-mocktails.mp4",
      chefNote: "Zero artificial colors, 100% natural fruit purees",
      badge: "Arrival Experience",
    },
  ],
};

/**
 * Cuisine Content
 * Royal Menus & Culinary Traditions
 */
export const cuisineContent: CuisineContent = {
  eyebrow: "Royal Dining Traditions",
  title: "A Symphony of Heritage Cuisines",
  subtitle:
    "Every recipe in our repertoire is an authentic ode to royal culinary heritage, prepared with age-old techniques, whole-spice roasts, and uncompromised pure-vegetarian dedication.",
  cuisines: [
    {
      id: "awadhi-dastarkhwan",
      region: "Awadh (Lucknow)",
      title: "Royal Awadhi Dastarkhwan",
      tagline: "The Poetry of Dum Pukht & Subtle Aromatics",
      description:
        "Celebrated for its gentle perfume of kewra, saffron, and slow coal-steaming. Features melt-in-mouth vegetable galoutis, decadent shahi paneer korma, and long-grain biryanis.",
      highlightDishes: [
        "Melt-in-Mouth Subz Galouti Kebabs with Ulte Tawe Ka Paratha",
        "Shahi Badami Paneer in Rich White Saffron Gravy",
        "24-Hour Simmered Dal Sultani Infused with Smoked Cloves",
      ],
      dietaryBadges: ["100% Pure Veg", "Jain Option Available", "Royal Heritage"],
      image: "/images/grand-wedding-reception.png",
      video: "/videos/grand-wedding.mp4",
    },
    {
      id: "rajasthani-rajwada",
      region: "Rajasthan",
      title: "Rajasthani Rajwada Thali",
      tagline: "Fortress Feasts & Rich Heritage Spices",
      description:
        "An opulent royal spread honoring Marwari and Rajputana traditions. Signature baked baatis drenched in pure ghee, five-lentil panchmel dal, and exotic dried-desert-berry curries.",
      highlightDishes: [
        "Panchmel Dal with Ghee-Dipped Baati & 4 Churma Varieties",
        "Authentic Ker Sangri cooked in Mustard Oil & Dry Mango",
        "Jodhpur Shahi Gatta Curry with Fenugreek Missi Roti",
      ],
      dietaryBadges: ["100% Pure Veg", "Pure Desi Ghee", "Traditional Recipe"],
      image: "/images/hero-reel-poster.webp",
      video: "/videos/themes-and-counters.mp4",
    },
    {
      id: "punjabi-shahi-dawat",
      region: "Punjab",
      title: "Grand Punjabi Shahi Dawat",
      tagline: "Hearty Robust Tastes of Northern Soil",
      description:
        "Celebratory feasts rich in wood-charred cottage cheese, velvety black lentils simmered overnight with fresh churned cream, and tandoori stuffed kulchas brushed with golden ghee.",
      highlightDishes: [
        "Signature Dal Makhani (Simmered for 24 hours on slow coals)",
        "Char-Grilled Paneer Tikka Angara with Mint-Coriander Relish",
        "Pindi Chana with Crisp Bhature & Pickled Stuffed Chillies",
      ],
      dietaryBadges: ["100% Pure Veg", "Clay Tandoor", "North Indian Classic"],
      image: "/images/grand-wedding-reception.png",
      video: "/videos/livecounter.mp4",
    },
    {
      id: "kashmiri-wazwan",
      region: "Kashmir",
      title: "Kashmiri Pure-Vegetarian Wazwan",
      tagline: "Fragrant Spices of the Valley & Himalayan Herbs",
      description:
        "A rare pure-vegetarian adaptation of Kashmir's iconic feast, flavored with wild shallots, dried cockscomb flower for crimson hue, Kashmiri saffron, and sun-dried ginger.",
      highlightDishes: [
        "Dum Aloo Kashmiri in Slow-Cooked Fennel & Dry Ginger Gravy",
        "Lotus Stem Nadru Yakhni Simmered in Aromatic Minted Yogurt",
        "Traditional Saffron Kashmiri Kahwa with Toasted Almond Slivers",
      ],
      dietaryBadges: ["100% Pure Veg", "Himalayan Herbs", "Sattvic Friendly"],
      image: "/images/hero-reel-poster.webp",
      video: "/videos/bhelpuri.mp4",
    },
    {
      id: "contemporary-global",
      region: "Pan-Asian & Mediterranean",
      title: "Artisanal Contemporary & Global Fusion",
      description:
        "Modern culinary architecture designed for cosmopolitan wedding guests. Hand-crafted crystal dim sums, truffle mushroom risottos, and wood-fired flatbreads.",
      tagline: "World Flavors Crafted for the Royal Indian Palate",
      highlightDishes: [
        "Crystal Truffle & Edamame Dumplings with House Chili Crisp",
        "Slow-Stirred Wild Forest Mushroom & Saffron Risotto",
        "Mediterranean Mezze Towers with Fresh Pita & Artisanal Hummus",
      ],
      dietaryBadges: ["100% Pure Veg", "Live Pasta & Dim Sum", "Modern Fusion"],
      image: "/images/grand-wedding-reception.png",
      video: "/videos/v1.mp4",
    },
    {
      id: "royal-mithai",
      region: "Mithai Confections",
      title: "Artisan Royal Mithai & Halwai Kadai",
      tagline: "The Golden Crescendo of Indian Celebrations",
      description:
        "The zenith of the evening featuring traditional halwais preparing live saffron jalebis, slow-churned seasonal fruit kulfis, and decadent gold-dusted regional confections.",
      highlightDishes: [
        "Live Saffron Jalebi with Slow-Thickened Malai Rabri",
        "Warm Moong Dal Halwa Roasted in Pure A2 Cow Ghee",
        "Dry Fruit Malai Ghewar Dusted with Edible Gold Leaf",
      ],
      dietaryBadges: ["100% Pure Veg", "A2 Cow Ghee", "No Preservatives"],
      image: "/images/hero-reel-poster.webp",
      video: "/videos/mango.mp4",
    },
  ],
};

export default servicesContent;
