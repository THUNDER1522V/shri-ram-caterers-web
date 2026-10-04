import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, ShieldCheck, Clock, UtensilsCrossed, Star } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { ClientPetals } from "@/components/common/client-petals";

interface Pillar {
  icon: React.ElementType;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    icon: Sparkles,
    title: "Authentic Royal Heritage Taste",
    description:
      "Time-honored recipes, master chefs specializing in regional Indian delicacies, and uncompromised ingredient freshness that guests praise long after the celebration.",
  },
  {
    icon: Clock,
    title: "Stress-Free Event Management",
    description:
      "From initial tasting to the final reception course, our on-ground catering captains manage timing, hot buffet refills, and service logistics so families can celebrate peacefully.",
  },
  {
    icon: ShieldCheck,
    title: "5-Star Kitchen & Hygiene Protocols",
    description:
      "State-of-the-art mobile kitchens, sanitized preparation standards, certified ingredients, and uniformed service staff trained in luxury dining hospitality.",
  },
  {
    icon: UtensilsCrossed,
    title: "Bespoke Menu Customization",
    description:
      "Tailored multi-course tasting sessions with menu pairings designed specifically to reflect your family traditions, dietary preferences, and guest profiles.",
  },
];

export function WhyUsSection() {
  return (
    <Section id="why-us" className="relative overflow-hidden">
      {/* Ambient petals — sparse, no interaction (z-[1], below content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <ClientPetals petalCount={6} dustCount={4} sectionId="why-us" />
      </div>
      <Container className="relative z-10">
        {/* Stamp Badge (Decorative, CLS-stable fixed dimensions) */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute -top-8 -right-4 lg:-right-8 z-20 pointer-events-none text-gold select-none"
        >
          <div className="relative w-40 h-40 flex items-center justify-center animate-[spin_18s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-current">
              <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="7" className="font-heading font-bold uppercase">
                <textPath href="#circlePath" startOffset="0%" textLength="219.91">
                  PURE VEG · ROYAL CATERING · SHRI RAM CATERERS · 
                </textPath>
              </text>
            </svg>
            <div className="text-gold">
              <Star className="w-8 h-8 fill-current" />
            </div>
          </div>
        </div>

        {/* Section Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <RevealItem className="inline-block font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            The Shri Ram Promise
          </RevealItem>
          <RevealItem>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Why Families Trust Us With Their Greatest Milestones
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base text-muted-foreground">
              We understand that food is the heart of every Indian wedding. Our commitment is perfection in taste, grace in hospitality, and absolute reliability.
            </p>
          </RevealItem>
        </Reveal>

        {/* Pillars Grid */}
        <Reveal delay={0.2} staggerChildren={0.1} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 relative z-10">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <RevealItem key={idx}>
                <Card className="flex h-full flex-col justify-between">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-gold/10">
                      <Icon className="h-6 w-6 text-gold" aria-hidden="true" />
                    </div>
                    <CardTitle className="mt-4 text-xl">
                      {pillar.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </RevealItem>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
