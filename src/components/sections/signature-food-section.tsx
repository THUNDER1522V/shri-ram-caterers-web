"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import dynamic from "next/dynamic";
import type { MenuContent, MenuItem } from "@/types/menu";
import { menuContent as defaultMenuContent } from "@/content/menu";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface SignatureFoodSectionProps {
  content?: MenuContent;
  dishes?: MenuItem[];
}

export function SignatureFoodSection({
  content = defaultMenuContent,
  dishes,
}: SignatureFoodSectionProps) {
  const dishList = dishes || content.dishes;

  return (
    <Section id="experiences" className="relative overflow-hidden">
      {/* Ambient golden petals (background < petals z-[1] < content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={6} dustCount={3} sectionId="menu" />
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

        {/* Dishes Showcase Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {dishList.map((dish, idx) => (
            <Card key={dish.id || idx} className="flex flex-col overflow-hidden">
              <div className="relative aspect-square w-full border-b border-border bg-muted">
                <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                  <Utensils className="h-6 w-6 text-gold-600/70" aria-hidden="true" />
                  <span className="mt-2 text-xs font-medium text-muted-foreground">
                    {dish.imagePlaceholder || dish.name}
                  </span>
                </div>
              </div>

              <CardHeader className="p-5 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {dish.category}
                </span>
                <CardTitle className="mt-1 text-lg">
                  {dish.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <p className="font-body text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {dish.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
