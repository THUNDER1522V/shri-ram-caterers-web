"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, ShieldCheck, Clock, Award, CheckCircle2, Crown } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { ClientPetals } from "@/components/common/client-petals";
import type { LegacyContent, LegacyPillarItem } from "@/types/services";
import { legacyContent as defaultLegacyContent } from "@/content/homepage";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Clock,
  ShieldCheck,
  Award,
  Crown,
};

interface LegacySectionProps {
  content?: LegacyContent;
}

export function LegacySection({ content = defaultLegacyContent }: LegacySectionProps) {
  return (
    <Section id="legacy" className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32">
      {/* Soft Maroon Radial Ambient Glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -z-10 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4A0A10]/25 blur-[120px]" />

      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <ClientPetals petalCount={5} dustCount={3} sectionId="legacy" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            <Crown className="h-3.5 w-3.5 text-[#C6A15B]" />
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

        {/* Heritage Story Grid */}
        <Reveal delay={0.15} className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {content.story.map((paragraph, pIdx) => (
            <div
              key={pIdx}
              className="relative rounded-2xl border border-[#C6A15B]/20 bg-[#120B0C]/60 p-6 sm:p-7 backdrop-blur-sm transition-all hover:border-[#C6A15B]/40 shadow-sm"
            >
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                Heritage Chapter 0{pIdx + 1}
              </span>
              <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-[#E8D6A8]/80">
                {paragraph}
              </p>
            </div>
          ))}
        </Reveal>

        {/* 4 Core Pillars Grid */}
        <Reveal delay={0.25} staggerChildren={0.1} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {content.pillars.map((pillar: LegacyPillarItem, idx: number) => {
            const Icon = (pillar.iconName && ICON_MAP[pillar.iconName]) || Sparkles;
            return (
              <RevealItem key={pillar.id || idx}>
                <Card className="group flex h-full flex-col justify-between border-[#C6A15B]/25 bg-[#0F0B0C]/80 transition-all duration-300 hover:-translate-y-1 hover:border-[#C6A15B]/60 hover:shadow-[0_12px_36px_rgba(198,161,91,0.15)]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#C6A15B]/30 bg-[#C6A15B]/10 text-[#C6A15B] transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      {pillar.stat && (
                        <div className="text-right">
                          <span className="font-heading text-2xl font-bold text-[#C6A15B]">
                            {pillar.stat}
                          </span>
                          <p className="text-[10px] uppercase tracking-wider text-[#E8D6A8]/60">
                            {pillar.statLabel}
                          </p>
                        </div>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-xl font-heading text-[#E8D6A8]">
                      {pillar.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-sm sm:text-base leading-relaxed text-[#E8D6A8]/70">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </RevealItem>
            );
          })}
        </Reveal>

        {/* Quality & Sanctity Badges Bar */}
        <Reveal delay={0.35} className="mt-12 rounded-2xl border border-[#C6A15B]/30 bg-gradient-to-r from-[#1A0A0E] via-[#0B0B0B] to-[#1A0A0E] p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {content.badges.map((badge, bIdx) => (
              <div key={bIdx} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#C6A15B] shrink-0" />
                <span className="font-body text-xs sm:text-sm font-semibold tracking-wide text-[#E8D6A8]">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export const WhyUsSection = LegacySection;
export default LegacySection;
