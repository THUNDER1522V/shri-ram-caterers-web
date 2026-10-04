"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/siteConfig";
import { MessageCircle, PhoneCall } from "lucide-react";
import dynamic from "next/dynamic";
import { Reveal, RevealItem } from "@/components/ui/reveal";

const MouseGradient = dynamic(() => import("@/components/MouseGradient"), {
  ssr: false,
});

export function ContactCTASection() {
  const [canLoadShader, setCanLoadShader] = React.useState(false);

  // Defer shader loading to idle
  React.useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (
        window as unknown as {
          requestIdleCallback: (
            cb: () => void,
            opts?: { timeout: number }
          ) => number;
        }
      ).requestIdleCallback(() => setCanLoadShader(true), { timeout: 2000 });

      return () => {
        if ("cancelIdleCallback" in window) {
          (
            window as unknown as { cancelIdleCallback: (id: number) => void }
          ).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(() => setCanLoadShader(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Section 
      id="contact" 
      className="relative flex items-center justify-center py-32 md:py-48 overflow-hidden"
    >
      {/* Background Shader - canvas z-0 with instant static fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {canLoadShader ? (
          <MouseGradient intensity={1.15} />
        ) : (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #4A0A10 0%, #0B0B0B 75%)",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Dark radial overlay behind text block */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div 
          className="w-full max-w-4xl h-full max-h-[580px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(11,11,11,0.45) 0%, rgba(11,11,11,0.30) 45%, transparent 75%)"
          }}
        />
      </div>

      {/* Edge blend vignette */}
      <div 
        className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,#0B0B0B_100%)] opacity-75 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Content - z-10 */}
      <Container className="relative z-10">
        <Reveal className="mx-auto max-w-3xl text-center flex flex-col items-center">
          <RevealItem className="inline-block font-heading text-xs uppercase tracking-[0.25em] text-[#C6A15B] md:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Begin Your Journey
          </RevealItem>
          
          <RevealItem>
            <h2 className="mt-6 font-heading text-4xl font-semibold leading-tight tracking-tight text-[#E8D6A8] sm:text-5xl md:text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Plan Your Celebration
            </h2>
          </RevealItem>
          
          <RevealItem>
            <p className="mt-6 max-w-2xl font-body text-base md:text-lg leading-relaxed text-[#F5EFE0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] font-medium">
              Speak directly with our senior catering directors to discuss dates, custom menu preferences, and schedule a private family tasting session.
            </p>
          </RevealItem>
          
          <RevealItem delay={0.1}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button asChild size="lg" className="w-full sm:w-auto h-[52px] px-8 rounded-btn bg-[#C6A15B] text-black font-semibold hover:bg-[#D4B06A] transition-all group shadow-[0_4px_24px_rgba(198,161,91,0.28)] hover:shadow-[0_6px_32px_rgba(198,161,91,0.38)]">
                <a
                  href={siteConfig.links.phone}
                  aria-label="Call Shri Ram Caterers to get a wedding quote"
                  className="inline-flex items-center space-x-2"
                >
                  <PhoneCall className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                  <span>Call for Quote</span>
                </a>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-[52px] px-8 rounded-btn border-2 border-[#D4A84B] text-[#D4A84B] bg-[#0B0B0B]/40 hover:bg-[#D4A84B] hover:text-black transition-all group shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Enquire with Shri Ram Caterers on WhatsApp"
                  className="inline-flex items-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5 text-[#D4A84B] group-hover:text-black transition-colors" aria-hidden="true" />
                  <span>WhatsApp Us</span>
                </a>
              </Button>
            </div>
          </RevealItem>
        </Reveal>
      </Container>
    </Section>
  );
}
