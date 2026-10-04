"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import dynamic from "next/dynamic";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface ServiceItem {
  tag: string;
  title: string;
  description: string;
  mediaPlaceholder: string;
  features: string[];
  video?: string;
}

const services: ServiceItem[] = [
  {
    tag: "Primary Specialization",
    title: "Grand Wedding Receptions",
    description:
      "Complete luxury wedding banquets designed to honor royal dining traditions with multi-course plated service or grand buffet architecture.",
    mediaPlaceholder: "Grand Wedding Banquet Setup Photography",
    video: "/videos/grand-wedding.mp4",
    features: [
      "Custom Royal Indian Menus",
      "Experienced On-Ground Floor Captains",
      "Dedicated VIP & Family Dining Service",
    ],
  },
  {
    tag: "Pre-Wedding Celebrations",
    title: "Sangeet, Mehendi & Cocktails",
    description:
      "Vibrant, interactive food experiences featuring artisan street food stations, live grills, and craft mocktails tailored for lively social evenings.",
    mediaPlaceholder: "Vibrant Sangeet Food Theatre Photography",
    video: "/videos/v1.mp4",
    features: [
      "Artisan Live Chaat & Street Food Bars",
      "Bespoke Finger Foods & Canapés",
      "Contemporary Fusion Presentations",
    ],
  },
  {
    tag: "Signature Culinary Displays",
    title: "Live Interactive Food Theatres",
    description:
      "Theatrical culinary stations where master chefs prepare hot breads, live tandoor specialties, and sizzling regional dishes in front of your guests.",
    mediaPlaceholder: "Master Chefs at Live Counter Photography",
    video: "/videos/livecounter.mp4",
    features: [
      "Wood-Fired Tandoor & Grill Counters",
      "Live Regional Dal & Bati Theatres",
      "Exotic Live Dessert & Jalebi Stations",
    ],
  },
  {
    tag: "Fresh & Seasonal",
    title: "Seasonal Dishes",
    description:
      "Embrace the flavors of the season with our handcrafted, premium seasonal dishes carefully curated to highlight the freshest ingredients.",
    mediaPlaceholder: "",
    video: "/videos/mango.mp4",
    features: [
      "Farm-to-table fresh ingredients",
      "Signature seasonal fruit desserts",
      "Vibrant and refreshing presentations",
    ],
  },
];

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
            preload="none"
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
            {service.mediaPlaceholder}
          </span>
        </div>
      )}
    </div>
  );
}

export function ServicesSection() {
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
            Celebrations We Cater
          </RevealItem>
          <RevealItem>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Tailored Dining Experiences for Every Milestone
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base text-muted-foreground">
              Whether an intimate pre-wedding gathering of 100 or a magnificent reception of 3,000 guests, our standard remains uncompromising perfection.
            </p>
          </RevealItem>
        </Reveal>

        {/* Services Grid */}
        <Reveal delay={0.2} staggerChildren={0.1} className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service, idx) => (
            <RevealItem key={idx}>
              <Card className="flex h-full flex-col">
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
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
