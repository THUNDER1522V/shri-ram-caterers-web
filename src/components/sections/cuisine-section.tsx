"use client";

import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Utensils, Check, ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import dynamic from "next/dynamic";
import type { CuisineContent, CuisineItem } from "@/types/services";
import { cuisineContent as defaultCuisineContent } from "@/content/services";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface CuisineSectionProps {
  content?: CuisineContent;
  cuisines?: CuisineItem[];
}

export function CuisineSection({
  content = defaultCuisineContent,
  cuisines,
}: CuisineSectionProps) {
  const cuisineList = cuisines || content.cuisines;
  const [activeTab, setActiveTab] = React.useState(cuisineList[0]?.id || "awadhi-dastarkhwan");

  const activeCuisine = React.useMemo(() => {
    return cuisineList.find((c) => c.id === activeTab) || cuisineList[0];
  }, [activeTab, cuisineList]);

  return (
    <Section id="cuisine" className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32">
      {/* Soft Maroon Radial Glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-[700px] w-[700px] rounded-full bg-[#4A0A10]/20 blur-[140px]" />

      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={6} dustCount={3} sectionId="cuisine" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            <Utensils className="h-3.5 w-3.5 text-[#C6A15B]" />
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

        {/* Cuisine Navigation Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {cuisineList.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`rounded-full px-5 py-2.5 font-heading text-xs sm:text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] ${
                  isActive
                    ? "bg-[#C6A15B] text-[#0B0B0B] shadow-[0_4px_16px_rgba(198,161,91,0.35)] scale-105"
                    : "border border-[#C6A15B]/25 bg-white/5 text-[#E8D6A8]/80 hover:border-[#C6A15B]/60 hover:bg-white/10 hover:text-[#E8D6A8]"
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {/* Featured Cuisine Showcase Card */}
        {activeCuisine && (
          <Reveal key={activeCuisine.id} delay={0.15} className="mt-12">
            <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-[#C6A15B]/40 bg-[#120B0C]/90 shadow-[0_20px_60px_rgba(0,0,0,0.85)] lg:grid-cols-12">
              {/* Media Column (5 cols) */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:col-span-5 overflow-hidden min-h-[320px] bg-[#0B0B0B]">
                {activeCuisine.video ? (
                  <video
                    src={activeCuisine.video}
                    poster={activeCuisine.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={activeCuisine.image}
                    alt={activeCuisine.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120B0C] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#120B0C]" />
                
                {/* Region Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="rounded-full bg-[#0B0B0B]/80 border border-[#C6A15B]/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#C6A15B] backdrop-blur-md">
                    {activeCuisine.region}
                  </span>
                </div>
              </div>

              {/* Details Column (7 cols) */}
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-7">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {activeCuisine.dietaryBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#E8D6A8]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-4 font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E8D6A8]">
                    {activeCuisine.title}
                  </h3>
                  
                  <p className="mt-2 font-heading text-sm text-[#C6A15B] font-medium italic">
                    &ldquo;{activeCuisine.tagline}&rdquo;
                  </p>

                  <p className="mt-4 font-body text-sm sm:text-base leading-relaxed text-[#E8D6A8]/75">
                    {activeCuisine.description}
                  </p>

                  {/* Signature Dishes List */}
                  <div className="mt-6 border-t border-[#C6A15B]/15 pt-5">
                    <p className="font-heading text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold">
                      Signature Repertoire Highlights
                    </p>
                    <ul className="mt-3.5 space-y-2.5">
                      {activeCuisine.highlightDishes.map((dish, dIdx) => (
                        <li key={dIdx} className="flex items-start text-sm text-[#E8D6A8]/90">
                          <Check className="mr-2.5 h-4 w-4 shrink-0 text-[#C6A15B] mt-0.5" />
                          <span>{dish}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#C6A15B]/15 pt-6">
                  <p className="text-xs text-[#E8D6A8]/60">
                    Complimentary private tasting available for confirmed wedding hosts.
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C6A15B] px-5 py-2.5 font-body text-xs sm:text-sm font-semibold text-[#0B0B0B] transition-all hover:bg-[#D4B06A] hover:shadow-[0_4px_16px_rgba(198,161,91,0.3)]"
                  >
                    Curate This Menu
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export const SignatureFoodSection = CuisineSection;
export default CuisineSection;
