import * as React from "react";
import {
  Navbar,
  HeroSection,
  TrustStripSection,
  WhyUsSection,
  ServicesSection,
  SignatureFoodSection,
  GallerySection,
  TestimonialsSection,
  FAQSection,
  ContactCTASection,
  Footer,
  FloatingWhatsApp,
} from "@/sections";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. Navbar */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 2. Hero with Scalable Video Stack */}
        <HeroSection />

        {/* 3. Trust Strip Metrics */}
        <TrustStripSection />

        {/* 4. Why Choose Shri Ram Caterers */}
        <WhyUsSection />

        {/* 5. Catering Services */}
        <ServicesSection />

        {/* 6. Signature Food & Royal Menus */}
        <SignatureFoodSection />

        {/* 7. Event Gallery */}
        <GallerySection />

        {/* 8. Verified Reviews & Testimonials */}
        <TestimonialsSection />

        {/* 9. Frequently Asked Questions */}
        <FAQSection />

        {/* 10. Contact & Booking CTA */}
        <ContactCTASection />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* 12. Floating WhatsApp Instant Connect */}
      <FloatingWhatsApp />
    </div>
  );
}
