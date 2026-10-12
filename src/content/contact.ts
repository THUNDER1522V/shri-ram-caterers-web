import type { ContactConfig, BookingCTAContent } from "@/types/contact";

export const contactConfig: ContactConfig = {
  businessName: "Shri Ram Caterers",
  legalName: "Shri Ram Caterers Private Limited",
  phoneFormatted: "+91 99999 99999",
  phoneRaw: "+919999999999",
  whatsappFormatted: "+91 99999 99999",
  whatsappRaw: "919999999999",
  whatsappPrefilledMessage:
    "Hello Shri Ram Caterers, I would like to inquire about wedding catering services for my upcoming celebration.",
  email: "contact@shriramcaterers.com",
  address: {
    street: "Main Ring Road, South Extension",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110049",
    country: "India",
  },
  geo: {
    latitude: 28.6139,
    longitude: 77.209,
  },
  areasServed: [
    "New Delhi",
    "Delhi NCR",
    "Gurugram",
    "Noida",
    "Greater Noida",
    "Faridabad",
    "Ghaziabad",
    "Jaipur",
    "Agra",
    "Chandigarh",
    "North India",
  ],
  openingHours: "Mo-Su 09:00-21:00",
  links: {
    whatsapp:
      "https://wa.me/919999999999?text=" +
      encodeURIComponent(
        "Hello Shri Ram Caterers, I would like to inquire about wedding catering services for my upcoming celebration."
      ),
    phone: "tel:+919999999999",
    email: "mailto:contact@shriramcaterers.com",
    instagram: "https://instagram.com/shriramcaterers",
    facebook: "https://facebook.com/shriramcaterers",
    googleBusiness: "https://maps.google.com/?cid=shriramcaterers",
  },
};

export const bookingCTAContent: BookingCTAContent = {
  eyebrow: "Begin Your Journey",
  title: "Plan Your Celebration",
  subtitle:
    "Speak directly with our senior catering directors to discuss dates, custom menu preferences, and schedule a private family tasting session.",
  callButtonText: "Call for Quote",
  whatsappButtonText: "WhatsApp Us",
};
