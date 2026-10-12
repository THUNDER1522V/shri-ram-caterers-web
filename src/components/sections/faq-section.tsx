"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
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
    <Section id="faq" className="relative overflow-hidden bg-ivory-300/40">
      {/* Ambient golden petals (background < petals z-[1] < content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={4} dustCount={2} sectionId="faq" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            {content.eyebrow}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        {/* Accordion Layout */}
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="overflow-hidden rounded-card border border-border bg-card transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-heading text-base font-semibold text-foreground md:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "ml-4 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-gold-600"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="border-t border-border px-6 pb-6 pt-4"
                  >
                    <p className="font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
