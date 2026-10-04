"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2, ExternalLink } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { VideoCoverflow } from "./video-coverflow";
import { videoTestimonials } from "@/data/testimonials";
import { siteConfig } from "@/config/siteConfig";
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
    <Section id="reviews" className="relative overflow-hidden bg-[#0B0B0B]">
      {/* Soft Maroon Radial Glow behind the coverflow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4A0A10]/20 blur-[100px]" />

      {/* Ambient golden petals (background < petals z-[1] < content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={5} dustCount={3} sectionId="testimonials" />
      </div>

      <Container className="relative z-10 pt-8">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <RevealItem className="inline-block font-heading text-xs uppercase tracking-[0.25em] text-gold md:text-sm">
            Customer Stories
          </RevealItem>
          <RevealItem>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl drop-shadow-sm">
              Words From Families We Have Served
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base text-white/70">
              Real experiences shared by parents and celebration hosts who trusted us with their most cherished milestones.
            </p>
          </RevealItem>
        </Reveal>

        {/* Video Coverflow */}
        <Reveal delay={0.2} className="mt-4 w-full">
          <VideoCoverflow testimonials={videoTestimonials} />
        </Reveal>

        {/* Divider */}
        <div className="mx-auto mt-16 max-w-3xl border-t border-white/10" />

        {/* Google Reviews Row */}
        <div className="mt-16">
          <Reveal className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                {/* Minimal G Logo placeholder or color icon */}
                <span className="font-heading font-bold text-blue-600">G</span>
              </div>
              <h3 className="font-heading text-lg font-medium text-white">
                Verified Google Reviews
              </h3>
            </div>
            
            <a
              href={siteConfig.links?.googleBusiness || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Read all reviews on Google
              <ExternalLink className="h-4 w-4 text-white/50 transition-colors group-hover:text-gold" />
            </a>
          </Reveal>

          <Reveal delay={0.1} staggerChildren={0.1} className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((item, idx) => (
              <RevealItem key={idx} className="h-full">
                <Card className="flex h-full flex-col justify-between border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader className="pb-4 flex-grow">
                    {/* 5-Star Rating */}
                    <div className="flex items-center space-x-1" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className="h-3.5 w-3.5 fill-gold text-gold"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 font-body text-sm leading-relaxed text-white/90 italic">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </CardHeader>

                  <CardContent className="border-t border-white/10 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-heading text-sm font-semibold text-white">
                          {item.author}
                        </p>
                        <p className="text-[11px] font-medium text-gold/80 mt-0.5">
                          {item.role}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/50">
                          {item.event} &bull; {item.date}
                        </p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-gold/80" aria-label="Verified Host" />
                    </div>
                  </CardContent>
                </Card>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
