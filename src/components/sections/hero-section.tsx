"use client";

import * as React from "react";
import { m } from "framer-motion";
import { MessageCircle, ArrowRight, CalendarCheck } from "lucide-react";
import dynamic from "next/dynamic";
import { VideoStack } from "./hero/video-stack";
import type { HeroContent, HeroVideoItem } from "@/types/hero";
import { heroContent as defaultHeroContent } from "@/content/hero";
import { FADE_UP } from "@/animations/motion";

const MouseGradient = dynamic(() => import("@/components/MouseGradient"), {
  ssr: false,
});

interface HeroSectionProps {
  content?: HeroContent;
  videos?: HeroVideoItem[];
}

export function HeroSection({
  content = defaultHeroContent,
  videos,
}: HeroSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [canLoadShader, setCanLoadShader] = React.useState(false);

  // Defer WebGL MouseGradient until after first paint / idle
  React.useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (
        window as unknown as {
          requestIdleCallback: (
            cb: () => void,
            opts?: { timeout: number }
          ) => number;
        }
      ).requestIdleCallback(() => setCanLoadShader(true), { timeout: 1500 });

      return () => {
        if ("cancelIdleCallback" in window) {
          (
            window as unknown as { cancelIdleCallback: (id: number) => void }
          ).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(() => setCanLoadShader(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const videoList = videos || content.videos;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden"
      aria-labelledby="hero-headline"
    >
      {/* ── Layer order: canvas z-0 (deferred to idle; static CSS gradient renders immediately) ────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {canLoadShader ? (
          <MouseGradient intensity={1.18} variant="hero" />
        ) : (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 70% 50%, #4A0A10 0%, #0B0B0B 75%)",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Layer order: dark overlay z-[1] (horizontal gradient: 55% left to 10% right) ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0.35) 40%, rgba(11,11,11,0.10) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Layer order: content z-10 ────────────────────────────────────── */}
      <div className="relative z-10 w-full mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 items-center gap-6 py-4 sm:py-6 lg:grid-cols-[1fr_auto] lg:gap-8 xl:gap-12 xl:py-6">

          {/* ══════════════════ LEFT COLUMN ══════════════════ */}
          <div className="flex flex-col items-start pt-4 lg:pt-0 pb-6 lg:pb-0">

            {/* Eyebrow */}
            <m.div
              variants={FADE_UP(0)}
              initial="hidden"
              animate="show"
              className="flex items-center gap-2.5"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C6A15B]"
              />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C6A15B]">
                {content.eyebrow}
              </span>
            </m.div>

            {/* Headline — LCP Element: Rendered immediately on SSR (initial={false}) for instant paint */}
            <m.h1
              id="hero-headline"
              variants={FADE_UP(0.05)}
              initial={false}
              animate="show"
              className="mt-3 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-[#E8D6A8] sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]"
            >
              {content.headline.primary}{" "}
              <br className="hidden sm:block" />
              <em className="font-normal not-italic text-[#C6A15B]">
                {content.headline.secondary}
              </em>
            </m.h1>

            {/* Subline */}
            <m.p
              variants={FADE_UP(0.12)}
              initial="hidden"
              animate="show"
              className="mt-3.5 max-w-lg font-body text-sm sm:text-base leading-relaxed text-[#E8D6A8]/75"
            >
              {content.subline}
            </m.p>

            {/* CTAs */}
            <m.div
              variants={FADE_UP(0.2)}
              initial="hidden"
              animate="show"
              className="mt-5 flex flex-wrap items-center gap-3"
            >
              {content.actions.map((action, idx) => {
                if (action.variant === "primary") {
                  return (
                    <a
                      key={idx}
                      href={action.href}
                      target={action.isExternal ? "_blank" : undefined}
                      rel={action.isExternal ? "noopener noreferrer" : undefined}
                      className="group inline-flex h-[50px] items-center gap-2.5 rounded-[14px] bg-[#C6A15B] px-6 sm:px-7 font-body text-sm sm:text-base font-semibold text-[#0B0B0B] shadow-[0_4px_24px_rgba(198,161,91,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D4B06A] hover:shadow-[0_6px_32px_rgba(198,161,91,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]"
                      aria-label={action.label}
                    >
                      <CalendarCheck
                        className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110"
                        aria-hidden="true"
                      />
                      {action.label}
                    </a>
                  );
                }

                if (action.variant === "secondary") {
                  return (
                    <a
                      key={idx}
                      href={action.href}
                      target={action.isExternal ? "_blank" : undefined}
                      rel={action.isExternal ? "noopener noreferrer" : undefined}
                      className="group inline-flex h-[50px] items-center gap-2.5 rounded-[14px] border border-[#C6A15B]/50 px-6 sm:px-7 font-body text-sm sm:text-base font-semibold text-[#C6A15B] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C6A15B] hover:bg-[#C6A15B]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]"
                      aria-label={action.label}
                    >
                      <MessageCircle
                        className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110"
                        aria-hidden="true"
                      />
                      {action.label}
                    </a>
                  );
                }

                return (
                  <a
                    key={idx}
                    href={action.href}
                    target={action.isExternal ? "_blank" : undefined}
                    rel={action.isExternal ? "noopener noreferrer" : undefined}
                    className="group inline-flex h-[50px] items-center gap-1.5 px-2 font-body text-sm text-[#E8D6A8]/65 transition-colors duration-200 hover:text-[#E8D6A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                    aria-label={action.label}
                  >
                    {action.label}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </m.div>

            {/* Trust strip */}
            <m.div
              variants={FADE_UP(0.28)}
              initial="hidden"
              animate="show"
              className="mt-6 lg:mt-8 border-t border-[#C6A15B]/15 pt-3.5"
            >
              <p className="mb-2 font-body text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E8D6A8]/45">
                {content.trustTitle}
              </p>
              <div className="flex flex-wrap items-start gap-x-6 sm:gap-x-8 gap-y-3">
                {content.trustPills.map(({ stat, label }) => (
                  <div key={stat} className="flex flex-col min-w-[70px]">
                    <span className="font-heading text-xl sm:text-2xl font-semibold leading-none text-[#C6A15B] tabular-nums">
                      {stat}
                    </span>
                    <span className="mt-1 font-body text-xs text-[#E8D6A8]/55">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </m.div>
          </div>

          {/* ══════════════════ RIGHT COLUMN — Video Stack ══════════════════ */}
          <m.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center lg:justify-end"
          >
            <VideoStack videos={videoList} />
          </m.div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden 2xl:flex flex-col items-center gap-1.5 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-body text-[9px] uppercase tracking-[0.28em] text-[#C6A15B]/40">
          Scroll
        </span>
        <m.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 w-px bg-gradient-to-b from-[#C6A15B]/40 to-transparent"
        />
      </m.div>
    </section>
  );
}
