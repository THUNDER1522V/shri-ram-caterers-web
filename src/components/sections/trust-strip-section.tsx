"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Award, Calendar, Users, Star, Sparkles } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import dynamic from "next/dynamic";
import type { TrustMetric } from "@/types/stats";
import { trustStripContent as defaultTrustStripContent } from "@/content/homepage";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

const ICON_MAP: Record<string, React.ElementType> = {
  Calendar,
  Award,
  Users,
  Star,
  Sparkles,
};

interface TrustStripSectionProps {
  items?: TrustMetric[];
  eyebrow?: string;
}

export function TrustStripSection({
  items = defaultTrustStripContent.metrics,
  eyebrow = defaultTrustStripContent.eyebrow,
}: TrustStripSectionProps) {
  return (
    <section
      id="trust-strip"
      aria-label={eyebrow || "Key Trust Metrics"}
      className="relative overflow-hidden border-y border-border bg-ivory-300/60 py-12 md:py-16"
    >
      {/* Ambient golden petals (background < petals z-[1] < content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={3} dustCount={2} sectionId="stats" />
      </div>

      <Container className="relative z-10">
        <Reveal delay={0.1} staggerChildren={0.1} className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {items.map((metric, idx) => {
            const Icon = (metric.iconName && ICON_MAP[metric.iconName]) || Award;
            return (
              <RevealItem
                key={metric.id || idx}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-background shadow-elevation-soft">
                  <Icon className="h-5 w-5 text-gold-600" aria-hidden="true" />
                </div>
                <p className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl tabular-nums min-w-[100px]">
                  {metric.isCountUp && metric.valueNum !== undefined ? (
                    <CountUp value={metric.valueNum} suffix={metric.suffix} />
                  ) : (
                    metric.value
                  )}
                </p>
                <p className="mt-1 font-body text-sm font-semibold text-foreground">
                  {metric.label}
                </p>
                <p className="mt-0.5 font-body text-xs text-muted-foreground">
                  {metric.subtext}
                </p>
              </RevealItem>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
