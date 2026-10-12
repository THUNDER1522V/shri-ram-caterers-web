"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
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
      className="relative aspect-[16/9] w-full border-b border-border bg-[#120B0C] overflow-hidden"
    >
      {service.video ? (
        inView ? (
          <video
            ref={videoRef}
            src={service.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={service.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
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
          <span className="font-heading text-sm text-muted-foreground">
            {service.mediaPlaceholder || service.title}
          </span>
        </div>
      )}
    </div>
  );
}

interface ServicesSectionProps {
  content?: ServicesContent;
  services?: ServiceItem[];
}

export function ServicesSection({
  content = defaultServicesContent,
  services,
}: ServicesSectionProps) {
  const serviceList = services || content.services;

  return (
    <Section id="celebrations" className="relative overflow-hidden bg-ivory-300/40">
      {/* Ambient golden petals (background < petals z-[1] < content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={7} dustCount={4} sectionId="services" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <RevealItem className="inline-block font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            {content.eyebrow}
          </RevealItem>
          <RevealItem>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {content.title}
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base text-muted-foreground">
              {content.subtitle}
            </p>
          </RevealItem>
        </Reveal>

        {/* Services Grid */}
        <Reveal delay={0.2} staggerChildren={0.1} className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {serviceList.map((service, idx) => (
            <RevealItem key={service.id || idx}>
              <Card className="group flex h-full flex-col overflow-hidden">
                <ServiceMedia service={service} />

                <CardHeader className="pb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {service.tag}
                  </span>
                  <CardTitle className="mt-1 text-2xl">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                      {service.description}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-border pt-4">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center text-sm text-foreground">
                          <Check className="mr-2.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {service.buttonText && (
                    <div className="mt-6 border-t border-border/60 pt-4">
                      <a
                        href={service.buttonHref || "#contact"}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
