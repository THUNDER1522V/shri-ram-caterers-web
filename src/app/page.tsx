import * as React from "react";
import {
  Navbar,
  HeroSection,
  TrustStripSection,
  LegacySection,
  CelebrationsSection,
  CuisineSection,
  LiveCountersSection,
  GallerySection,
  GoogleReviewsSection,
  TestimonialsSection,
  ProcessSection,
  FAQSection,
  ContactCTASection,
  Footer,
  FloatingWhatsApp,
} from "@/sections";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0B] text-[#E8D6A8]">
      {/* Sticky Navigation with Luxury Active Indicator */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 1. Hero with Scalable Video Stack */}
        <HeroSection />

        {/* 2. Trust Strip */}
        <TrustStripSection />

        {/* 3. Legacy */}
        <LegacySection />

        {/* 4. Celebrations */}
        <CelebrationsSection />

        {/* 5. Cuisine */}
        <CuisineSection />

        {/* 6. Live Counters */}
        <LiveCountersSection />

        {/* 7. Gallery */}
        <GallerySection />

        {/* 8. Google Reviews */}
        <GoogleReviewsSection />

        {/* 9. Testimonials (Video Coverflow) */}
        <TestimonialsSection />

        {/* 10. Process */}
        <ProcessSection />

        {/* 11. FAQ */}
        <FAQSection />

        {/* 12. Contact */}
        <ContactCTASection />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* Floating WhatsApp Instant Connect */}
      <FloatingWhatsApp />
    </div>
  );
}
