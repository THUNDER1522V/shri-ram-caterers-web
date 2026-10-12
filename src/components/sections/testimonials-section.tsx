"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { VideoCoverflow } from "./video-coverflow";
import Image from "next/image";
import dynamic from "next/dynamic";
import type {
  ReviewsContent,
  VideoReviewItem,
  GoogleReviewItem,
  ImageReviewItem,
} from "@/types/reviews";
import { reviewsContent as defaultReviewsContent } from "@/content/reviews";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface TestimonialsSectionProps {
  content?: ReviewsContent;
  videoReviews?: VideoReviewItem[];
  googleReviews?: GoogleReviewItem[];
  imageReviews?: ImageReviewItem[];
}

export function TestimonialsSection({
  content = defaultReviewsContent,
  videoReviews,
  googleReviews,
  imageReviews,
}: TestimonialsSectionProps) {
  const videos = videoReviews || content.videoReviews;
  const googles = googleReviews || content.googleReviews;
  const images = imageReviews || content.imageReviews;

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
            {content.eyebrow}
          </RevealItem>
          <RevealItem>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl drop-shadow-sm">
              {content.title}
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base text-white/70">
              {content.subtitle}
            </p>
          </RevealItem>
        </Reveal>

        {/* Video Coverflow */}
        <Reveal delay={0.2} className="mt-4 w-full">
          <VideoCoverflow testimonials={videos} />
        </Reveal>

        {/* Divider */}
        <div className="mx-auto mt-16 max-w-3xl border-t border-white/10" />

        {/* Google Reviews Row */}
        <div className="mt-16">
          <Reveal className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <span className="font-heading font-bold text-blue-600">G</span>
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium text-white">
                  Verified Google Reviews
                </h3>
                <p className="text-xs text-white/60">
                  {content.googleSummary.rating}★ &bull; {content.googleSummary.reviewCountText}
                </p>
              </div>
            </div>

            <a
              href={content.googleSummary.googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Read all reviews on Google
              <ExternalLink className="h-4 w-4 text-white/50 transition-colors group-hover:text-gold" />
            </a>
          </Reveal>

          <Reveal delay={0.1} staggerChildren={0.1} className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {googles.map((item, idx) => (
              <RevealItem key={item.id || idx} className="h-full">
                <Card className="flex h-full flex-col justify-between border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader className="pb-4 flex-grow">
                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1" aria-label={`${item.rating} out of 5 stars`}>
                      {[...Array(item.rating || 5)].map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className="h-3.5 w-3.5 fill-gold text-gold"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {item.quote && (
                      <blockquote className="mt-4 font-body text-sm leading-relaxed text-white/90 italic">
                        &ldquo;{item.quote}&rdquo;
                      </blockquote>
                    )}
                  </CardHeader>

                  <CardContent className="border-t border-white/10 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-heading text-sm font-semibold text-white">
                          {item.author}
                        </p>
                        {item.role && (
                          <p className="text-[11px] font-medium text-gold/80 mt-0.5">
                            {item.role}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11px] text-white/50">
                          {item.event} {item.date && <>&bull; {item.date}</>}
                        </p>
                      </div>
                      {item.verified && (
                        <CheckCircle2 className="h-4 w-4 text-gold/80" aria-label="Verified Host" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </RevealItem>
            ))}
          </Reveal>
        </div>

        {/* Optional Image Reviews Row if configured */}
        {images && images.length > 0 && (
          <div className="mt-16">
            <Reveal className="mb-6 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-gold" />
              <h3 className="font-heading text-lg font-medium text-white">
                Client Moments & Handwritten Reviews
              </h3>
            </Reveal>

            <Reveal delay={0.1} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {images.map((imgReview) => (
                <div
                  key={imgReview.id}
                  className="flex flex-col sm:flex-row gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="relative h-44 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={imgReview.imageSrc}
                      alt={imgReview.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center space-x-1">
                      {[...Array(imgReview.rating || 5)].map((_, sIdx) => (
                        <Star key={sIdx} className="h-3 w-3 fill-gold text-gold" />
                      ))}
                    </div>
                    {imgReview.quote && (
                      <p className="mt-2 text-xs italic text-white/90">
                        &ldquo;{imgReview.quote}&rdquo;
                      </p>
                    )}
                    <p className="mt-2 text-xs font-semibold text-white">
                      {imgReview.author}
                    </p>
                    <p className="text-[10px] text-gold/80">
                      {imgReview.role} &bull; {imgReview.location}
                    </p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        )}
      </Container>
    </Section>
  );
}

export const ReviewsSection = TestimonialsSection;
