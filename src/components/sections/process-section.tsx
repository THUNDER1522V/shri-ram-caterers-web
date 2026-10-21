"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Utensils, Layers, CheckCircle2, Sparkles, Check, ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import dynamic from "next/dynamic";
import type { ProcessContent, ProcessStepItem } from "@/types/services";
import { processContent as defaultProcessContent } from "@/content/homepage";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

const ICON_MAP: Record<string, React.ElementType> = {
  Utensils,
  Layers,
  CheckCircle: CheckCircle2,
  Sparkles,
};

interface ProcessSectionProps {
  content?: ProcessContent;
}

export function ProcessSection({ content = defaultProcessContent }: ProcessSectionProps) {
  return (
    <Section id="process" className="relative overflow-hidden bg-[#0D090A] py-24 sm:py-32">
      {/* Soft Maroon Radial Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4A0A10]/20 blur-[130px]" />

      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={5} dustCount={3} sectionId="process" />
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

        {/* 4 Process Steps Grid */}
        <Reveal delay={0.2} staggerChildren={0.12} className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((stepItem: ProcessStepItem, idx: number) => {
            const Icon = (stepItem.iconName && ICON_MAP[stepItem.iconName]) || Sparkles;
            return (
              <RevealItem key={stepItem.step || idx} className="h-full">
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-[#C6A15B]/30 bg-[#120B0C]/85 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C6A15B] hover:shadow-[0_16px_40px_rgba(198,161,91,0.2)]">
                  <div>
                    {/* Step Number & Icon Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-4xl font-extrabold text-[#C6A15B]/35 transition-colors group-hover:text-[#C6A15B]">
                        {stepItem.step}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C6A15B]/30 bg-[#C6A15B]/10 text-[#C6A15B] transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="mt-5 font-heading text-xl font-bold text-[#E8D6A8]">
                      {stepItem.title}
                    </h3>

                    <p className="mt-1 font-body text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                      {stepItem.subtitle}
                    </p>

                    <p className="mt-3 font-body text-xs sm:text-sm leading-relaxed text-[#E8D6A8]/70">
                      {stepItem.description}
                    </p>

                    {/* Highlights */}
                    <ul className="mt-5 space-y-2 border-t border-[#C6A15B]/15 pt-4">
                      {stepItem.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start text-xs text-[#E8D6A8]/85">
                          <Check className="mr-2 h-3.5 w-3.5 shrink-0 text-[#C6A15B] mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 border-t border-[#C6A15B]/15 pt-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#C6A15B]/80 group-hover:text-[#C6A15B]">
                      Stage {stepItem.step} of 04
                    </span>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>

        {/* Process Guarantee Banner */}
        <Reveal delay={0.3} className="mt-14 rounded-2xl border border-[#C6A15B]/35 bg-gradient-to-r from-[#170A0E] via-[#0E0A0B] to-[#170A0E] p-6 sm:p-8 text-center shadow-lg">
          <h4 className="font-heading text-lg sm:text-xl font-bold text-[#E8D6A8]">
            Experience Our Hospitality Firsthand
          </h4>
          <p className="mt-2 font-body text-xs sm:text-sm text-[#E8D6A8]/75 max-w-xl mx-auto">
            Book an introductory consultation with our Senior Banquet Directors and reserve your private family tasting session.
          </p>
          <div className="mt-5 flex justify-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C6A15B] px-6 py-3 font-body text-sm font-semibold text-[#0B0B0B] transition-all hover:bg-[#D4B06A] hover:shadow-[0_4px_20px_rgba(198,161,91,0.35)]"
            >
              <span>Schedule Private Tasting</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default ProcessSection;
