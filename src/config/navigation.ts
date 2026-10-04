import type { NavigationConfig } from "@/types/navigation";
import { siteConfig } from "@/config/siteConfig";

export const navigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: "Celebrations",
      href: "/#celebrations",
    },
    {
      title: "Experiences",
      href: "/#experiences",
    },
    {
      title: "Why Us",
      href: "/#why-us",
    },
    {
      title: "Gallery",
      href: "/#gallery",
    },
    {
      title: "Reviews",
      href: "/#reviews",
    },
    {
      title: "FAQ",
      href: "/#faq",
    },
  ],
  footerNav: [
    {
      title: "Services",
      items: [
        { title: "Weddings", href: "/#celebrations" },
        { title: "Live Counters", href: "/#experiences" },
        { title: "Custom Menus", href: "/#experiences" },
        { title: "Corporate Events", href: "/#celebrations" },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", href: "/#why-us" },
        { title: "Gallery", href: "/#gallery" },
        { title: "Testimonials", href: "/#reviews" },
        { title: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Connect",
      items: [
        { title: "WhatsApp", href: siteConfig.links.whatsapp, external: true },
        { title: "Contact", href: "/#contact" },
      ],
    },
  ],
};
