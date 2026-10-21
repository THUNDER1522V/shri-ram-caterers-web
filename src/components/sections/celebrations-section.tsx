"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Sparkles, Users } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import dynamic from "next/dynamic";
import type { ServicesContent, ServiceItem } from "@/types/services";
import { servicesContent as defaultServicesContent } from "@/content/services";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

function ServiceMedia({ service }: { service: ServiceItem }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !service.video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (video) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: "250px 0px", threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [service.video]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/9] w-full border-b border-[#C6A15B]/20 bg-[#120B0C] overflow-hidden"
    >
      {service.video ? (
        inView ? (
          <video
            ref={videoRef}
            src={service.video}
            poster={service.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={service.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 bg-[#120B0C] flex items-center justify-center">
            <span className="font-heading text-xs text-[#E8D6A8]/60 uppercase tracking-widest">
              {service.title}
            </span>
          </div>
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 text-center">
          <span className="font-heading text-sm text-[#E8D6A8]/60">
            {service.mediaPlaceholder || service.title}
          </span>
        </div>
      )}

      {/* Capacity Pill Overlay */}
      {service.capacity && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-[#0B0B0B]/85 border border-[#C6A15B]/40 px-2.5 py-1 text-[11px] font-medium text-[#E8D6A8] backdrop-blur-md">
          <Users className="h-3 w-3 text-[#C6A15B]" />
          <span>{service.capacity}</span>
        </div>
      )}
    </div>
  );
}

interface CelebrationsSectionProps {
  content?: ServicesContent;
  services?: ServiceItem[];
}

export function CelebrationsSection({
  content = defaultServicesContent,
  services,
}: CelebrationsSectionProps) {
  const serviceList = services || content.services;

  return (
    <Section id="celebrations" className="relative overflow-hidden bg-[#0D090A] py-24 sm:py-32">
      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={6} dustCount={3} sectionId="celebrations" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
            {content.eyebrow}
          </RevealItem>
          <RevealItem>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-[#E8D6A8] sm:text-4xl md:text-5xl">
              {content.title}
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base md:text-lg leading-relaxed text-[#E8D6A8]/75">
              {content.subtitle}
            </p>
          </RevealItem>
        </Reveal>

        {/* Celebrations Grid */}
        <Reveal delay={0.2} staggerChildren={0.1} className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service, idx) => (
            <RevealItem key={service.id || idx}>
              <Card className="group flex h-full flex-col overflow-hidden border-[#C6A15B]/25 bg-[#120B0C]/85 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C6A15B] hover:shadow-[0_16px_40px_rgba(198,161,91,0.2)]">
                <ServiceMedia service={service} />

                <CardHeader className="p-6 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                    {service.tag}
                  </span>
                  <CardTitle className="mt-1.5 text-xl font-heading text-[#E8D6A8]">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between p-6 pt-0">
                  <div>
                    <p className="font-body text-sm leading-relaxed text-[#E8D6A8]/70">
                      {service.description}
                    </p>

                    <ul className="mt-5 space-y-2.5 border-t border-[#C6A15B]/15 pt-4">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start text-xs sm:text-sm text-[#E8D6A8]/85">
                          <Check className="mr-2 h-4 w-4 shrink-0 text-[#C6A15B] mt-0.5" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {service.buttonText && (
                    <div className="mt-6 border-t border-[#C6A15B]/15 pt-4">
                      <a
                        href={service.buttonHref || "#contact"}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C6A15B] transition-colors hover:text-[#E8D6A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                      >
                        {service.buttonText}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

export const ServicesSection = CelebrationsSection;
export default CelebrationsSection;
