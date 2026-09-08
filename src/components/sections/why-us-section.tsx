import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, ShieldCheck, Clock, UtensilsCrossed } from "lucide-react";

interface Pillar {
  icon: React.ElementType;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    icon: Sparkles,
    title: "[Authentic Royal Heritage Taste]",
    description:
      "[Time-honored recipes, master chefs specializing in regional Indian delicacies, and uncompromised ingredient freshness that guests praise long after the celebration.]",
  },
  {
    icon: Clock,
    title: "[Stress-Free Event Management]",
    description:
      "[From initial tasting to the final reception course, our on-ground catering captains manage timing, hot buffet refills, and service logistics so families can celebrate peacefully.]",
  },
  {
    icon: ShieldCheck,
    title: "[5-Star Kitchen & Hygiene Protocols]",
    description:
      "[State-of-the-art mobile kitchens, sanitized preparation standards, certified ingredients, and uniformed service staff trained in luxury dining hospitality.]",
  },
  {
    icon: UtensilsCrossed,
    title: "[Bespoke Menu Customization]",
    description:
      "[Tailored multi-course tasting sessions with menu pairings designed specifically to reflect your family traditions, dietary preferences, and guest profiles.]",
  },
];

export function WhyUsSection() {
  return (
    <Section id="why-us">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            [The Shri Ram Promise]
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            [Why Families Trust Us With Their Greatest Milestones]
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground">
            [We understand that food is the heart of every Indian wedding. Our commitment is perfection in taste, grace in hospitality, and absolute reliability.]
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-gold-50">
                    <Icon className="h-6 w-6 text-gold-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-4 text-xl">
                    {pillar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
