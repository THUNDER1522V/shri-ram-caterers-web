import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2 } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  event: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "[From our first food trial to the wedding day, Shri Ram Caterers handled everything with perfection. The live counters were the talk of the entire reception, and my guests are still praising the Shahi Paneer and hot jalebis.]",
    author: "[Rajesh Sharma]",
    role: "[Father of the Bride]",
    event: "[Wedding Reception — 1,200 Guests, New Delhi]",
    date: "[December 2024]",
  },
  {
    quote:
      "[Managing catering for an 800-person destination wedding seemed daunting until we met their team. The buffet was always hot, the service staff was polite, and not a single guest had to wait. Absolute peace of mind.]",
    author: "[Vikramaditya Singhania]",
    role: "[Groom's Family Host]",
    event: "[3-Day Grand Wedding Celebration, Jaipur]",
    date: "[November 2024]",
  },
  {
    quote:
      "[Exceptional discipline, hygienic kitchen setups, and royal hospitality. Their team coordinated flawlessly with our event planners. I highly recommend them for any family that values quality food and respect.]",
    author: "[Sunil Agrawal]",
    role: "[Host & Business Leader]",
    event: "[Silver Jubilee Celebration, Gurugram]",
    date: "[January 2025]",
  },
];

export function TestimonialsSection() {
  return (
    <Section id="reviews">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            [Host Stories]
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            [Words From Families We Have Served]
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground">
            [Real experiences shared by parents and celebration hosts who trusted us with their most cherished milestones.]
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <Card key={idx} className="flex flex-col justify-between">
              <CardHeader className="pb-4">
                {/* 5-Star Rating */}
                <div className="flex items-center space-x-1" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className="h-4 w-4 fill-gold-400 text-gold-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 font-body text-sm leading-relaxed text-foreground md:text-base italic">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </CardHeader>

              <CardContent className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-base font-semibold text-foreground">
                      {item.author}
                    </p>
                    <p className="text-xs font-medium text-gold-600">
                      {item.role}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.event} &bull; {item.date}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-gold-600" aria-label="Verified Host" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
