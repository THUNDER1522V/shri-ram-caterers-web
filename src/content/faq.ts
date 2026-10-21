import type { FAQContent } from "@/types/faq";

/**
 * FAQ Content Schema
 * Structured, production-ready inquiries for royal wedding & luxury catering clients.
 */
export const faqContent: FAQContent = {
  eyebrow: "Clarifications & Details",
  title: "Frequently Asked Questions",
  subtitle:
    "Everything you need to know about our royal culinary curations, capacity, purity standards, and seamless celebration management.",
  faqs: [
    {
      id: "faq-purity-vegetarian",
      question: "Are your kitchens strictly 100% Pure Vegetarian?",
      answer:
        "Yes, absolutely without exception. Shri Ram Caterers operates strictly pure-vegetarian kitchens. All cooking vessels, commercial mobile kitchens, ladles, and transport containers are 100% vegetarian and sanitized under strict protocol. We also offer dedicated separate preparation areas and counters for Jain (onion-and-garlic-free) and Sattvic culinary requests.",
    },
    {
      id: "faq-guest-capacity",
      question: "What guest capacities do you accommodate?",
      answer:
        "We cater celebrations ranging from intimate pre-wedding gatherings of 100 guests to monumental wedding banquets and corporate galas exceeding 5,000+ guests. Our logistics fleet and floor management are architected with synchronized multi-tier service lines to ensure zero crowding and instant service.",
    },
    {
      id: "faq-tasting-sessions",
      question: "Do you offer food tasting sessions before final booking?",
      answer:
        "Yes. Once your event date and primary requirements are discussed, we arrange an exclusive private tasting session for the host family. You will sample signature gravies, live counter starters, and artisanal desserts prepared by our master chefs to curate and approve your final bespoke menu.",
    },
    {
      id: "faq-destination-weddings",
      question: "Do you provide catering for destination weddings outside Delhi NCR?",
      answer:
        "Yes, we regularly cater luxury destination weddings across Rajasthan (Jaipur, Udaipur, Jodhpur), Agra, Uttarakhand, Gwalior, and across North India. Our convoy includes self-contained mobile commercial kitchens, cold storage vans, and complete chef teams that travel on-site 48 hours prior to the celebration.",
    },
    {
      id: "faq-live-counter-customization",
      question: "Can we customize live food counters and thematic decor?",
      answer:
        "Every single live counter can be tailored to your wedding theme — from heritage royal brass kadais and Marwari rustic woodwork to sleek modern acrylic and neon stations. Our executive culinary directors collaborate directly with your wedding planners and decorators.",
    },
    {
      id: "faq-staff-service-standards",
      question: "What are your service standards and staff uniforms?",
      answer:
        "Our hospitality captains and service personnel are trained in royal banquet decorum, white-glove table etiquette, and prompt hygiene. Floor captains wear tailored royal bandhgalas or formal waistcoats with name tags, and service staff adhere to strict FSSAI grooming standards (hairnets, gloves, and sanitized aprons).",
    },
    {
      id: "faq-booking-timeline",
      question: "How far in advance should we confirm our catering booking?",
      answer:
        "For peak North Indian wedding auspicious dates (Saha lags in November–February and April–July), we recommend reserving your date 4 to 8 months in advance to secure our senior master chefs and dedicated banquet managers. Contact us to check date availability.",
    },
    {
      id: "faq-hygiene-certifications",
      question: "What food safety and hygiene protocols do you maintain?",
      answer:
        "We are fully FSSAI registered and adhere to HACCP food safety standards. We employ RO-purified water across all food preparation, source cold-pressed oils and certified spices, and conduct on-site temperature checks for cold chains and hot holding stations.",
    },
  ],
};

export default faqContent;
