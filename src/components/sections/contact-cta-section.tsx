"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { MessageCircle, PhoneCall, Clock, Calendar, Send } from "lucide-react";
import dynamic from "next/dynamic";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { siteSettings } from "@/content/settings";
import { contactCTAContent } from "@/content/homepage";

const MouseGradient = dynamic(() => import("@/components/MouseGradient"), {
  ssr: false,
});

export function ContactCTASection() {
  const [canLoadShader, setCanLoadShader] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    eventDate: "",
    guestCount: "500",
    eventType: "Wedding Reception",
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Defer shader loading to idle
  React.useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (
        window as unknown as {
          requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback(() => setCanLoadShader(true), { timeout: 2000 });

      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(
            handle
          );
        }
      };
    } else {
      const timer = setTimeout(() => setCanLoadShader(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Shri Ram Caterers, I would like to inquire about catering.\nName: ${formData.name}\nPhone: ${formData.phone}\nEvent: ${formData.eventType}\nDate: ${formData.eventDate}\nEstimated Guests: ${formData.guestCount}`;
    const waUrl = `https://wa.me/${siteSettings.contact.whatsappRaw}?text=${encodeURIComponent(text)}`;
    setIsSubmitted(true);
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  return (
    <Section
      id="contact"
      className="relative flex items-center justify-center py-28 md:py-40 overflow-hidden bg-[#0B0B0B]"
    >
      {/* Background Shader - canvas z-0 with instant static fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {canLoadShader ? (
          <MouseGradient intensity={1.15} />
        ) : (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, #4A0A10 0%, #0B0B0B 75%)",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Dark radial overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-full max-w-5xl h-full max-h-[680px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(11,11,11,0.65) 0%, rgba(11,11,11,0.40) 50%, transparent 80%)",
          }}
        />
      </div>

      {/* Edge blend vignette */}
      <div
        className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,#0B0B0B_100%)] opacity-80 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content - z-10 */}
      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Headline, Direct Action, Guarantee (7 cols) */}
          <Reveal className="lg:col-span-7 flex flex-col items-start text-left">
            <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
              <Calendar className="h-3.5 w-3.5 text-[#C6A15B]" />
              {contactCTAContent.eyebrow}
            </RevealItem>

            <RevealItem>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight text-[#E8D6A8] sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-md">
                {contactCTAContent.title}
              </h2>
            </RevealItem>

            <RevealItem>
              <p className="mt-4 max-w-xl font-body text-base md:text-lg leading-relaxed text-[#F5EFE0]/80">
                {contactCTAContent.subtitle}
              </p>
            </RevealItem>

            {/* Direct Instant Action Buttons */}
            <RevealItem delay={0.15} className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="h-[52px] px-8 rounded-xl bg-[#C6A15B] text-black font-semibold hover:bg-[#D4B06A] transition-all group shadow-[0_4px_24px_rgba(198,161,91,0.28)] hover:shadow-[0_6px_32px_rgba(198,161,91,0.38)]"
              >
                <a
                  href={`tel:${siteSettings.contact.phoneRaw}`}
                  aria-label={`Call ${siteSettings.brand.name} at ${siteSettings.contact.phoneFormatted}`}
                  className="inline-flex items-center space-x-2"
                >
                  <PhoneCall className="h-4.5 w-4.5 transition-transform group-hover:scale-110" aria-hidden="true" />
                  <span>Call {siteSettings.contact.phoneFormatted}</span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-[52px] px-8 rounded-xl border-2 border-[#D4A84B] text-[#D4A84B] bg-[#0B0B0B]/60 hover:bg-[#D4A84B] hover:text-black transition-all group shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
              >
                <a
                  href={siteSettings.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Enquire on WhatsApp"
                  className="inline-flex items-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5 text-[#D4A84B] group-hover:text-black transition-colors" aria-hidden="true" />
                  <span>{contactCTAContent.whatsappButtonText}</span>
                </a>
              </Button>
            </RevealItem>

            {/* Guarantee Pill */}
            <RevealItem delay={0.2} className="mt-8 flex items-center gap-2.5 text-xs text-[#C6A15B] border-t border-[#C6A15B]/20 pt-4">
              <Clock className="h-4 w-4 shrink-0 text-[#C6A15B]" />
              <span>{contactCTAContent.guaranteeText}</span>
            </RevealItem>
          </Reveal>

          {/* Right Column: Quick Booking Inquiry Card (5 cols) */}
          <Reveal delay={0.25} className="lg:col-span-5">
            <div className="rounded-3xl border border-[#C6A15B]/40 bg-[#120B0C]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between border-b border-[#C6A15B]/20 pb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#E8D6A8]">
                    Quick Date Inquiry
                  </h3>
                  <p className="text-xs text-[#E8D6A8]/70">
                    Direct connect with our Banquet Director
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <form onSubmit={handleQuickInquiry} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="inquiry-name" className="block text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                    Host Name
                  </label>
                  <input
                    id="inquiry-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajesh Singhania"
                    className="mt-1.5 w-full rounded-xl border border-[#C6A15B]/30 bg-black/60 px-4 py-2.5 text-sm text-[#E8D6A8] placeholder:text-[#E8D6A8]/30 focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="inquiry-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                      Phone Number
                    </label>
                    <input
                      id="inquiry-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="mt-1.5 w-full rounded-xl border border-[#C6A15B]/30 bg-black/60 px-4 py-2.5 text-sm text-[#E8D6A8] placeholder:text-[#E8D6A8]/30 focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry-date" className="block text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                      Auspicious Date
                    </label>
                    <input
                      id="inquiry-date"
                      name="eventDate"
                      type="text"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      placeholder="e.g. Nov 2025"
                      className="mt-1.5 w-full rounded-xl border border-[#C6A15B]/30 bg-black/60 px-4 py-2.5 text-sm text-[#E8D6A8] placeholder:text-[#E8D6A8]/30 focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="inquiry-event" className="block text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                      Celebration Type
                    </label>
                    <select
                      id="inquiry-event"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-[#C6A15B]/30 bg-black/60 px-3 py-2.5 text-sm text-[#E8D6A8] focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]"
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Sangeet & Cocktails">Sangeet & Cocktails</option>
                      <option value="Destination Palace Wedding">Destination Palace Wedding</option>
                      <option value="Executive Gala">Executive Corporate Gala</option>
                      <option value="Anniversary Banquet">Anniversary Banquet</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="inquiry-guests" className="block text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                      Guest Count
                    </label>
                    <select
                      id="inquiry-guests"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-[#C6A15B]/30 bg-black/60 px-3 py-2.5 text-sm text-[#E8D6A8] focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]"
                    >
                      <option value="150 - 300 Guests">150 - 300 Guests</option>
                      <option value="300 - 600 Guests">300 - 600 Guests</option>
                      <option value="600 - 1,200 Guests">600 - 1,200 Guests</option>
                      <option value="1,200 - 2,500 Guests">1,200 - 2,500 Guests</option>
                      <option value="2,500+ Guests">2,500+ Mega Banquet</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#C6A15B] py-3 text-sm font-semibold text-black transition-all hover:bg-[#D4B06A] hover:shadow-[0_4px_20px_rgba(198,161,91,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Instant Inquiry via WhatsApp</span>
                </button>
              </form>

              {isSubmitted && (
                <p className="mt-3 text-center text-xs text-[#C6A15B]">
                  Opening WhatsApp to connect directly with your dedicated manager...
                </p>
              )}
            </div>
          </Reveal>

        </div>
      </Container>
    </Section>
  );
}

export const BookingCTA = ContactCTASection;
export default ContactCTASection;
