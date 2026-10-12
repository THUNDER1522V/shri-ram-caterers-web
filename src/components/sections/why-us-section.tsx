"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, ShieldCheck, Clock, UtensilsCrossed, Award } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { ClientPetals } from "@/components/common/client-petals";
import type { WhyUsContent, WhyUsPillar } from "@/types/why-us";
import { whyUsContent as defaultWhyUsContent } from "@/content/why-us";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Clock,
  ShieldCheck,
  UtensilsCrossed,
  Award,
};

interface WhyUsSectionProps {
  content?: WhyUsContent;
  pillars?: WhyUsPillar[];
}

export function WhyUsSection({
  content = defaultWhyUsContent,
  pillars,
}: WhyUsSectionProps) {
  const pillarList = pillars || content.pillars;

  return (
    <Section id="why-us" className="relative overflow-hidden">
      {/* Ambient petals — sparse, no interaction (z-[1], below content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <ClientPetals petalCount={6} dustCount={4} sectionId="why-us" />
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

        {/* Pillars Grid */}
        <Reveal delay={0.2} staggerChildren={0.1} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 relative z-10">
          {pillarList.map((pillar, idx) => {
            const Icon = (pillar.iconName && ICON_MAP[pillar.iconName]) || Sparkles;
            return (
              <RevealItem key={pillar.id || idx}>
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
