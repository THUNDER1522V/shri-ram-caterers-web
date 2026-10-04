import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustStripSection } from "@/components/sections/trust-strip-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SignatureFoodSection } from "@/components/sections/signature-food-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FAQSection } from "@/components/sections/faq-section";
import { ContactCTASection } from "@/components/sections/contact-cta-section";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. Navbar */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 2. Hero */}
        <HeroSection />

        {/* 3. Trust Strip */}
        <TrustStripSection />

        {/* 4. Why Choose Shri Ram Caterers */}
        <WhyUsSection />

        {/* 5. Catering Services */}
        <ServicesSection />

        {/* 6. Signature Food & Royal Menus */}
        <SignatureFoodSection />

        {/* 7. Event Gallery */}
        <GallerySection />

        {/* 8. Testimonials */}
        <TestimonialsSection />

        {/* 9. FAQ */}
        <FAQSection />

        {/* 10. Contact CTA */}
        <ContactCTASection />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
