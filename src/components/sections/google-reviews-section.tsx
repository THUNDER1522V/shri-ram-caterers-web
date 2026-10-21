"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2, ExternalLink, Play, Pause, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { UnifiedReviewItem, GoogleReviewSummary } from "@/types/reviews";
import { reviewsContent } from "@/content/reviews";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

/**
 * Polymorphic Review Card
 * Designed so later video testimonials can replace review cards without changing layout.
 * Supports type: "google" | "video" | "image" within the exact same dimensional card envelope.
 */
export function PolymorphicReviewCard({ item }: { item: UnifiedReviewItem }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isVideoReview = item.type === "video" || Boolean(item.mp4 || item.videoUrl);

  const toggleVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Card className="group relative flex h-full flex-col justify-between overflow-hidden border border-[#C6A15B]/30 bg-[#120B0C]/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C6A15B] hover:shadow-[0_12px_36px_rgba(198,161,91,0.2)]">
      {/* If this review has video / is video testimonial */}
      {isVideoReview && (item.mp4 || item.videoUrl) ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B0B0B]">
          <video
            ref={videoRef}
            src={item.mp4 || item.videoUrl}
            poster={item.poster || "/images/hero-reel-poster.webp"}
            playsInline
            muted
            loop
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onEnded={() => setIsPlaying(false)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#120B0C] via-transparent to-transparent pointer-events-none" />

          {/* Play/Pause Overlay */}
          <button
            type="button"
            onClick={toggleVideo}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 transition-all hover:bg-black/10 focus-visible:outline-none"
            aria-label={isPlaying ? "Pause review video" : "Play review video"}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C6A15B] text-[#0B0B0B] shadow-lg transition-transform group-hover:scale-110">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </div>
          </button>

          {item.viewCount && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-[#E8D6A8] backdrop-blur-md">
              <Eye className="h-3 w-3 text-[#C6A15B]" />
              <span>{item.viewCount} views</span>
            </div>
          )}
        </div>
      ) : null}

      <CardHeader className="p-6 pb-4 flex-grow">
        {/* Rating Stars & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1" aria-label={`${item.rating || 5} out of 5 stars`}>
            {[...Array(item.rating || 5)].map((_, sIdx) => (
              <Star key={sIdx} className="h-3.5 w-3.5 fill-[#C6A15B] text-[#C6A15B]" aria-hidden="true" />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white font-heading text-[10px] font-bold text-blue-600 shadow-sm">
              G
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C6A15B]">
              Verified
            </span>
          </div>
        </div>

        {item.quote && (
          <blockquote className="mt-4 font-body text-sm leading-relaxed text-[#E8D6A8]/90 italic">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        )}
      </CardHeader>

      <CardContent className="border-t border-[#C6A15B]/15 p-6 pt-4 mt-auto bg-[#0E090A]/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-sm font-semibold text-[#E8D6A8]">
              {item.author}
            </p>
            {item.role && (
              <p className="text-[11px] font-medium text-[#C6A15B] mt-0.5">
                {item.role}
              </p>
            )}
            <p className="mt-0.5 text-[11px] text-[#E8D6A8]/60">
              {item.event} {item.date && <>&bull; {item.date}</>}
            </p>
          </div>
          {item.verified && (
            <CheckCircle2 className="h-4.5 w-4.5 text-[#C6A15B] shrink-0" aria-label="Verified Host" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface GoogleReviewsSectionProps {
  reviews?: UnifiedReviewItem[];
  summary?: GoogleReviewSummary;
}

export function GoogleReviewsSection({
  reviews = reviewsContent.googleReviews,
  summary = reviewsContent.googleSummary,
}: GoogleReviewsSectionProps) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const currentReviews = React.useMemo(() => {
    const start = currentPage * itemsPerPage;
    return reviews.slice(start, start + itemsPerPage);
  }, [currentPage, reviews, itemsPerPage]);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <Section id="reviews" className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32">
      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={5} dustCount={3} sectionId="reviews" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            <Star className="h-3.5 w-3.5 text-[#C6A15B] fill-[#C6A15B]" />
            {reviewsContent.eyebrow}
          </RevealItem>
          <RevealItem>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-[#E8D6A8] sm:text-4xl md:text-5xl">
              Verified Host Family Reviews
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 font-body text-base md:text-lg leading-relaxed text-[#E8D6A8]/75">
              {reviewsContent.subtitle}
            </p>
          </RevealItem>
        </Reveal>

        {/* Google Reviews Summary Banner */}
        <Reveal delay={0.15} className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#C6A15B]/30 bg-[#120B0C]/80 p-5 sm:flex-row sm:p-6 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md shrink-0">
              <span className="font-heading font-extrabold text-xl text-blue-600">G</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold text-[#E8D6A8]">
                  Google Rating {summary.rating} / {summary.maxRating}
                </span>
                <div className="flex items-center space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C6A15B] text-[#C6A15B]" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#E8D6A8]/65">
                Based on {summary.reviewCountText} from prestigious North Indian wedding hosts
              </p>
            </div>
          </div>

          <a
            href={summary.googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#C6A15B]/40 bg-[#C6A15B]/10 px-4 py-2 font-body text-xs sm:text-sm font-semibold text-[#E8D6A8] transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
          >
            <span>Read all reviews on Google</span>
            <ExternalLink className="h-4 w-4 text-[#C6A15B] transition-colors group-hover:text-[#0B0B0B]" />
          </a>
        </Reveal>

        {/* Review Cards Grid / Carousel */}
        <Reveal delay={0.25} staggerChildren={0.1} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {currentReviews.map((item, idx) => (
            <RevealItem key={item.id || idx} className="h-full">
              <PolymorphicReviewCard item={item} />
            </RevealItem>
          ))}
        </Reveal>

        {/* Carousel Pagination Controls if more than 3 reviews */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B] text-[#E8D6A8] transition-colors hover:border-[#C6A15B] hover:bg-[#C6A15B]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
              aria-label="Previous reviews page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setCurrentPage(pIdx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    pIdx === currentPage ? "w-6 bg-[#C6A15B]" : "w-2 bg-[#C6A15B]/30 hover:bg-[#C6A15B]/60"
                  )}
                  aria-label={`Go to reviews page ${pIdx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B] text-[#E8D6A8] transition-colors hover:border-[#C6A15B] hover:bg-[#C6A15B]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
              aria-label="Next reviews page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </Container>
    </Section>
  );
}

export default GoogleReviewsSection;
