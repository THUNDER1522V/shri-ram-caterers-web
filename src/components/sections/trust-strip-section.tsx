import * as React from "react";
import { Container } from "@/components/common/container";
import { Award, Calendar, Users, Star } from "lucide-react";

interface TrustMetric {
  icon: React.ElementType;
  value: string;
  label: string;
  subtext: string;
}

const metrics: TrustMetric[] = [
  {
    icon: Calendar,
    value: "[15+ Years]",
    label: "[Years in Business]",
    subtext: "[Generations of Culinary Heritage]",
  },
  {
    icon: Award,
    value: "[750+]",
    label: "[Weddings Catered]",
    subtext: "[Flawless Execution Record]",
  },
  {
    icon: Users,
    value: "[300,000+]",
    label: "[Guests Served]",
    subtext: "[Across North India]",
  },
  {
    icon: Star,
    value: "[4.9★]",
    label: "[Google Verified Rating]",
    subtext: "[Based on 200+ Host Reviews]",
  },
];

export function TrustStripSection() {
  return (
    <section
      id="trust-strip"
      aria-label="Key Trust Metrics"
      className="border-y border-border bg-ivory-300/60 py-12 md:py-16"
    >
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-background shadow-elevation-soft">
                  <Icon className="h-5 w-5 text-gold-600" aria-hidden="true" />
                </div>
                <p className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {metric.value}
                </p>
                <p className="mt-1 font-body text-sm font-semibold text-foreground">
                  {metric.label}
                </p>
                <p className="mt-0.5 font-body text-xs text-muted-foreground">
                  {metric.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
