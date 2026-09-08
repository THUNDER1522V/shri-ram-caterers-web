import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { MessageCircle, ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <Section id="hero" className="pt-8 pb-16 md:pt-12 md:pb-20 lg:pt-16 lg:pb-[120px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Brand Statement & Actions */}
          <div className="flex flex-col items-start lg:col-span-7">
            <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
              [Royal Indian Wedding Catering & Hospitality]
            </span>

            <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              [Grand Wedding Feasts Crafted With Heritage & Elegance]
            </h1>

            <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
              [Bespoke multi-cuisine curation, authentic traditional recipes, and flawless on-site event management trusted by families for generational celebrations.]
            </p>

            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button asChild variant="whatsapp" size="lg">
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </Button>

              <Button asChild variant="outline" size="lg">
                <a href="#celebrations" className="inline-flex items-center space-x-2">
                  <span>Explore Celebrations</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border pt-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold-400" />
                [100% Pure Vegetarian Menus Available]
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold-400" />
                [Live Interactive Culinary Theatres]
              </span>
            </div>
          </div>

          {/* Right Column: Visual Showcase Skeleton */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-media border border-border bg-muted">
              <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/80 shadow-elevation-soft">
                  <Play className="ml-1 h-6 w-6 text-gold-600" aria-hidden="true" />
                </div>
                <p className="mt-4 font-heading text-sm tracking-wide text-foreground">
                  [Hero Cinematic Real Event Video / Footage]
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  [High-Resolution Wedding Catering Showcase]
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
