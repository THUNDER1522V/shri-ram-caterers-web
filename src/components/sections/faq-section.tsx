"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import type { FAQContent, FAQItem } from "@/types/faq";
import { faqContent as defaultFAQContent } from "@/content/faq";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface FAQSectionProps {
  content?: FAQContent;
  items?: FAQItem[];
}

export function FAQSection({
  content = defaultFAQContent,
  items,
}: FAQSectionProps) {
  const faqList = items || content.faqs;
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <Section id="faq" className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32">
      {/* Soft Maroon Radial Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4A0A10]/20 blur-[130px]" />

      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={4} dustCount={2} sectionId="faq" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            <HelpCircle className="h-3.5 w-3.5 text-[#C6A15B]" />
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

        {/* Accordion Layout */}
        <Reveal delay={0.2} className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-all duration-300",
                  isOpen
                    ? "border-[#C6A15B] bg-[#140C0E]/90 shadow-[0_4px_24px_rgba(198,161,91,0.15)]"
                    : "border-[#C6A15B]/25 bg-[#100B0C]/70 hover:border-[#C6A15B]/50"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-heading text-base font-semibold text-[#E8D6A8] md:text-lg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-[#C6A15B] transition-transform duration-300",
                      isOpen && "rotate-180 text-[#E8D6A8]"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="border-t border-[#C6A15B]/15 px-5 sm:px-6 pb-6 pt-4"
                  >
                    <p className="font-body text-sm sm:text-base leading-relaxed text-[#E8D6A8]/80">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}

export default FAQSection;
