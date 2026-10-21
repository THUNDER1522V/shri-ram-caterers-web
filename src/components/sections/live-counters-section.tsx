"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Flame, Sparkles, Check, ChefHat, ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import dynamic from "next/dynamic";
import type { LiveCountersContent, LiveCounterItem } from "@/types/services";
import { liveCountersContent as defaultLiveCountersContent } from "@/content/services";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

function CounterVideo({ counter }: { counter: LiveCounterItem }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !counter.video) return;

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
  }, [counter.video]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full border-b border-[#C6A15B]/20 bg-[#120B0C] overflow-hidden"
    >
      {counter.video && inView ? (
        <video
          ref={videoRef}
          src={counter.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={counter.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[#120B0C] flex items-center justify-center">
          <span className="font-heading text-xs text-[#E8D6A8]/60 uppercase tracking-widest">
            {counter.title}
          </span>
        </div>
      )}

      {/* Top Badge */}
      {counter.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B0B0B]/85 border border-[#C6A15B]/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#E8D6A8] backdrop-blur-md">
            <Flame className="h-3 w-3 text-[#C6A15B]" />
            {counter.badge}
          </span>
        </div>
      )}
    </div>
  );
}

interface LiveCountersSectionProps {
  content?: LiveCountersContent;
  counters?: LiveCounterItem[];
}

export function LiveCountersSection({
  content = defaultLiveCountersContent,
  counters,
}: LiveCountersSectionProps) {
  const counterList = counters || content.counters;

  return (
    <Section id="live-counters" className="relative overflow-hidden bg-[#0D090A] py-24 sm:py-32">
      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={6} dustCount={3} sectionId="live-counters" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            <ChefHat className="h-3.5 w-3.5 text-[#C6A15B]" />
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

        {/* Live Counters Grid */}
        <Reveal delay={0.2} staggerChildren={0.1} className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {counterList.map((counter, idx) => (
            <RevealItem key={counter.id || idx}>
              <Card className="group flex h-full flex-col overflow-hidden border-[#C6A15B]/25 bg-[#120B0C]/85 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C6A15B] hover:shadow-[0_16px_40px_rgba(198,161,91,0.2)]">
                <CounterVideo counter={counter} />

                <CardHeader className="p-6 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                    {counter.tag}
                  </span>
                  <CardTitle className="mt-1 text-xl font-heading text-[#E8D6A8]">
                    {counter.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between p-6 pt-0">
                  <div>
                    <p className="font-body text-sm leading-relaxed text-[#E8D6A8]/70">
                      {counter.description}
                    </p>

                    {/* Specialties */}
                    <ul className="mt-5 space-y-2 border-t border-[#C6A15B]/15 pt-4">
                      {counter.specialties.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-start text-xs sm:text-sm text-[#E8D6A8]/85">
                          <Check className="mr-2 h-4 w-4 shrink-0 text-[#C6A15B] mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Chef Note Badge */}
                    {counter.chefNote && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#C6A15B]/10 border border-[#C6A15B]/20 p-2.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#C6A15B] shrink-0" />
                        <p className="font-body text-[11px] font-medium text-[#E8D6A8]/90">
                          {counter.chefNote}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t border-[#C6A15B]/15 pt-4">
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C6A15B] transition-colors hover:text-[#E8D6A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                    >
                      Inquire for this Counter
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

export default LiveCountersSection;
