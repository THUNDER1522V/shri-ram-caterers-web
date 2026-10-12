import type { FAQContent } from "@/types/faq";

export const faqContent: FAQContent = {
  eyebrow: "Clear Answers",
  title: "Frequently Asked Questions",
  subtitle:
    "Everything you need to know about our menus, tasting sessions, logistics, and wedding booking process.",
  faqs: [
    {
      id: "faq-tasting",
      question: "Do you offer food tasting sessions before final booking?",
      answer:
        "Yes. We host private menu tasting sessions for families upon shortlisting your event requirements, ensuring you experience the exact taste, spice levels, and presentation planned for your celebration.",
      category: "Tasting & Booking",
    },
    {
      id: "faq-capacity",
      question: "What is your minimum and maximum guest capacity?",
      answer:
        "We cater intimate gatherings starting from 100 guests up to grand mega-receptions of over 4,000 guests, with dedicated staff and dedicated kitchen managers assigned according to guest volume.",
      category: "Capacity & Scale",
    },
    {
      id: "faq-cuisines",
      question: "Can we customize our menu with regional and international cuisines?",
      answer:
        "Absolutely. Our culinary repertoire includes Traditional North Indian, Mughlai, Rajasthani, Gujarati, South Indian, as well as curated Continental and Asian live interactive stations.",
      category: "Menu Customization",
    },
    {
      id: "faq-hygiene",
      question: "How do you maintain food temperature and hygiene on-site?",
      answer:
        "We operate professional mobile warming units, insulated food transportation vessels, and commercial-grade mobile prep kitchens adhering to strict safety and sanitization standards.",
      category: "Hygiene & Kitchen Operations",
    },
    {
      id: "faq-advance-booking",
      question: "How far in advance should we reserve our wedding date?",
      answer:
        "Due to peak wedding season demands (Asoj, Kartik, and Magh dates), we recommend booking 3 to 6 months in advance to ensure date exclusivity and dedicated staff allocation.",
      category: "Booking Schedule",
    },
  ],
};
