import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ServiceItem {
  tag: string;
  title: string;
  description: string;
  mediaPlaceholder: string;
  features: string[];
}

const services: ServiceItem[] = [
  {
    tag: "[Primary Specialization]",
    title: "[Grand Wedding Receptions]",
    description:
      "[Complete luxury wedding banquets designed to honor royal dining traditions with multi-course plated service or grand buffet architecture.]",
    mediaPlaceholder: "[Grand Wedding Banquet Setup Photography]",
    features: [
      "[Custom Royal Indian Menus]",
      "[Experienced On-Ground Floor Captains]",
      "[Dedicated VIP & Family Dining Service]",
    ],
  },
  {
    tag: "[Pre-Wedding Celebrations]",
    title: "[Sangeet, Mehendi & Cocktails]",
    description:
      "[Vibrant, interactive food experiences featuring artisan street food stations, live grills, and craft mocktails tailored for lively social evenings.]",
    mediaPlaceholder: "[Vibrant Sangeet Food Theatre Photography]",
    features: [
      "[Artisan Live Chaat & Street Food Bars]",
      "[Bespoke Finger Foods & Canapés]",
      "[Contemporary Fusion Presentations]",
    ],
  },
  {
    tag: "[Signature Culinary Displays]",
    title: "[Live Interactive Food Theatres]",
    description:
      "[Theatrical culinary stations where master chefs prepare hot breads, live tandoor specialties, and sizzling regional dishes in front of your guests.]",
    mediaPlaceholder: "[Master Chefs at Live Counter Photography]",
    features: [
      "[Wood-Fired Tandoor & Grill Counters]",
      "[Live Regional Dal & Bati Theatres]",
      "[Exotic Live Dessert & Jalebi Stations]",
    ],
  },
  {
    tag: "[Corporate & VIP]",
    title: "[Corporate Galas & Private Dinners]",
    description:
      "[High-profile banqueting for corporate celebrations, annual galas, and intimate family milestone gatherings with executive polish.]",
    mediaPlaceholder: "[Corporate Banquet & Plated Dining Photography]",
    features: [
      "[Punctual Buffet & Plated Service]",
      "[Formal Multi-Cuisine Selections]",
      "[Comprehensive Dietary Customizations]",
    ],
  },
];

export function ServicesSection() {
  return (
    <Section id="celebrations" className="bg-ivory-300/40">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            [Celebrations We Cater]
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            [Tailored Dining Experiences for Every Milestone]
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground">
            [Whether an intimate pre-wedding gathering of 100 or a magnificent reception of 3,000 guests, our standard remains uncompromising perfection.]
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service, idx) => (
            <Card key={idx} className="flex flex-col overflow-hidden">
              {/* Media Skeleton */}
              <div className="relative aspect-[16/9] w-full border-b border-border bg-muted">
                <div className="flex h-full w-full items-center justify-center p-6 text-center">
                  <span className="font-heading text-sm text-muted-foreground">
                    {service.mediaPlaceholder}
                  </span>
                </div>
              </div>

              <CardHeader className="pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {service.tag}
                </span>
                <CardTitle className="mt-1 text-2xl">
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between">
                <p className="font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-border pt-4">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center text-sm text-foreground">
                      <Check className="mr-2.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
