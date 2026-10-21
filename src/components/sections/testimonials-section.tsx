"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Video } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { VideoCoverflow } from "./video-coverflow";
import dynamic from "next/dynamic";
import type { ReviewsContent, VideoReviewItem } from "@/types/reviews";
import { reviewsContent as defaultReviewsContent } from "@/content/reviews";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface TestimonialsSectionProps {
  content?: ReviewsContent;
  videoReviews?: VideoReviewItem[];
}

export function TestimonialsSection({
  content = defaultReviewsContent,
  videoReviews,
}: TestimonialsSectionProps) {
  const videos = videoReviews || content.videoReviews;

  return (
    <Section id="testimonials" className="relative overflow-hidden bg-[#0B0B0B] py-20 sm:py-28">
      {/* Soft Maroon Radial Glow behind the coverflow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4A0A10]/25 blur-[120px]" />

      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={5} dustCount={3} sectionId="testimonials" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            <Video className="h-3.5 w-3.5 text-[#C6A15B]" />
            Live Video Stories
          </RevealItem>
          <RevealItem>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-[#E8D6A8] sm:text-4xl md:text-5xl drop-shadow-sm">
              Voices of Royal Celebration
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base md:text-lg leading-relaxed text-[#E8D6A8]/75">
              Watch real host families and newlyweds describe their gastronomic journeys with Shri Ram Caterers.
            </p>
          </RevealItem>
        </Reveal>

        {/* Video Coverflow 3D Carousel */}
        <Reveal delay={0.2} className="mt-6 w-full">
          <VideoCoverflow testimonials={videos} />
        </Reveal>
      </Container>
    </Section>
  );
}

export const ReviewsSection = TestimonialsSection;
export default TestimonialsSection;
