"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do you offer food tasting sessions before final booking?",
    answer:
      "Yes. We host private menu tasting sessions for families upon shortlisting your event requirements, ensuring you experience the exact taste, spice levels, and presentation planned for your celebration.",
  },
  {
    question: "What is your minimum and maximum guest capacity?",
    answer:
      "We cater intimate gatherings starting from 100 guests up to grand mega-receptions of over 4,000 guests, with dedicated staff and dedicated kitchen managers assigned according to guest volume.",
  },
  {
    question: "Can we customize our menu with regional and international cuisines?",
    answer:
      "Absolutely. Our culinary repertoire includes Traditional North Indian, Mughlai, Rajasthani, Gujarati, South Indian, as well as curated Continental and Asian live interactive stations.",
  },
  {
    question: "How do you maintain food temperature and hygiene on-site?",
    answer:
      "We operate professional mobile warming units, insulated food transportation vessels, and commercial-grade mobile prep kitchens adhering to strict safety and sanitization standards.",
  },
  {
    question: "How far in advance should we reserve our wedding date?",
    answer:
      "Due to peak wedding season demands (Asoj, Kartik, and Magh dates), we recommend booking 3 to 6 months in advance to ensure date exclusivity and dedicated staff allocation.",
  },
];

export function FAQSection() {
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
            Clear Answers
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground">
            Everything you need to know about our menus, tasting sessions, logistics, and wedding booking process.
          </p>
        </div>

        {/* Accordion Layout */}
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
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
