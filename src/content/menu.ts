import type { MenuContent } from "@/types/menu";

export const menuContent: MenuContent = {
  eyebrow: "Culinary Mastery",
  title: "Signature Food & Royal Menus",
  subtitle:
    "Every dish is prepared under master chef supervision, honoring time-tested Indian culinary traditions using premium pure ingredients.",
  dishes: [
    {
      id: "dal-bukhara-shahi-paneer",
      category: "Royal Mains",
      name: "Dal Makhani Bukhara & Shahi Paneer",
      description:
        "Slow-cooked overnight in traditional brass vessels with churned white butter, aromatic whole spices, and rich heritage gravies.",
      imagePlaceholder: "Slow-Cooked Royal Dal & Shahi Paneer Photography",
      dietaryTag: "Pure Vegetarian",
      isSignature: true,
    },
    {
      id: "tandoori-kebabs-kulchas",
      category: "Live Tandoor & Starters",
      name: "Artisan Tandoori Kebabs & Stuffed Kulchas",
      description:
        "Freshly baked Amritsari chur-chur kulchas and smoked vegetarian galouti kebabs paired with house-made berry and mint chutneys.",
      imagePlaceholder: "Fresh Tandoor Kulchas & Sizzling Starters Photography",
      dietaryTag: "Pure Vegetarian",
      isSignature: true,
    },
    {
      id: "old-delhi-chaat-nitrogen",
      category: "Street Food Theatre",
      name: "Old Delhi Chaat & Nitrogen Live Counter",
      description:
        "Crisp palak patta chaat, stuffed golgappas with spiced mineral water infusions, and handcrafted dahi bhallas prepared live.",
      imagePlaceholder: "Interactive Live Chaat Station Photography",
      dietaryTag: "Pure Vegetarian",
      isSignature: true,
    },
    {
      id: "ghevar-jalebi-rabri",
      category: "Royal Desserts",
      name: "Saffron Malai Ghevar & Hot Jalebi Rabri",
      description:
        "Traditional Rajasthani ghevar garnished with silver vark and pistachio shavings alongside crisp live jalebis made with pure desi ghee.",
      imagePlaceholder: "Artisan Wedding Desserts & Live Sweet Counter Photography",
      dietaryTag: "Pure Vegetarian",
      isSignature: true,
    },
  ],
};
