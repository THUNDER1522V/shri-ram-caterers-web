"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2 } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import dynamic from "next/dynamic";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

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
      "We had an absolutely wonderful experience with Shree Ram Caterers. The service provided was truly amazing and exceeded all our expectations. Every dish served was incredibly tasty and prepared with evident care and quality ingredients. The professionalism with which they managed the entire event was commendable. Our guests were thoroughly impressed with the delicious food and the seamless execution.",
    author: "Aditya Sharma",
    role: "Local Guide",
    event: "13 reviews",
    date: "10 months ago",
  },
  {
    quote:
      "Shri Ram caters provided outstanding catering for our event! The food was delicious, beautifully presented, and served on time. The team was professional, attentive, and made sure everything went smoothly. Guests especially loved the south Indian food and many complimented the overall quality. I highly recommend their services for any occasion!",
    author: "Tanvi Agarwal",
    role: "Local Guide",
    event: "7 reviews",
    date: "a year ago",
  },
  {
    quote:
      "Absolutely stellar experience with this catering service! From start to finish, their attention to detail and commitment to quality shone through. The food was not just delicious, but exquisitely presented, pleasing both the palate and the eye. Every dish was a testament to their culinary expertise and dedication to excellence.",
    author: "Kailash Lal Sah",
    role: "Client",
    event: "5 reviews",
    date: "2 years ago",
  },
];

export function TestimonialsSection() {
  return (
    <Section id="reviews" className="relative overflow-hidden">
      {/* Ambient golden petals (background < petals z-[1] < content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={5} dustCount={3} sectionId="testimonials" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <RevealItem className="inline-block font-heading text-xs uppercase tracking-[0.25em] text-gold md:text-sm">
            Client Stories
          </RevealItem>
          <RevealItem>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Words From Families We Have Served
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base text-muted-foreground">
              Real experiences shared by parents and celebration hosts who trusted us with their most cherished milestones.
            </p>
          </RevealItem>
        </Reveal>

        {/* Testimonials Grid */}
        <Reveal delay={0.2} staggerChildren={0.1} className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <RevealItem key={idx}>
              <Card className="flex h-full flex-col justify-between">
                <CardHeader className="pb-4">
                  {/* 5-Star Rating */}
                  <div className="flex items-center space-x-1" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        className="h-4 w-4 fill-gold text-gold"
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
                      <p className="text-xs font-medium text-gold">
                        {item.role}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.event} &bull; {item.date}
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-gold" aria-label="Verified Host" />
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
