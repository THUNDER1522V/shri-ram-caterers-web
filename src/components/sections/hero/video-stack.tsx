"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, Pause, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroVideoItem } from "@/types/hero";
import { heroContent } from "@/content/hero";

interface HeroMediaSystemProps {
  videos?: HeroVideoItem[];
  className?: string;
}

export function VideoStack({ videos = heroContent.videos, className }: HeroMediaSystemProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const isIntersectingRef = React.useRef(true);

  const totalVideos = videos.length;
  const safeIndex = totalVideos > 0 ? ((activeIndex % totalVideos) + totalVideos) % totalVideos : 0;
  const activeVideo = videos[safeIndex] || heroContent.videos[0];

  // Up to 3 preview cards behind the featured card
  const previewIndices = React.useMemo(() => {
    if (totalVideos <= 1) return [];
    const list: number[] = [];
    for (let offset = 1; offset <= Math.min(3, totalVideos - 1); offset++) {
      list.push((safeIndex + offset) % totalVideos);
    }
    return list;
  }, [safeIndex, totalVideos]);

  // Video autoplay & intersection handling
  React.useEffect(() => {
    const v = videoRef.current;
    const container = containerRef.current;
    if (!v) return;

    const playVideo = () => {
      if (!v) return;
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    playVideo();

    if (!container) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          playVideo();
        } else {
          v.pause();
          setIsPlaying(false);
        }
      },
      { rootMargin: "150px 0px", threshold: 0.05 }
    );
    io.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden) {
        v.pause();
        setIsPlaying(false);
      } else if (isIntersectingRef.current) {
        playVideo();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [safeIndex]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalVideos);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalVideos) % totalVideos);
  };

  const handleSelectCard = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center w-full pr-6 sm:pr-14 lg:pr-24",
        className
      )}
    >
      {/* ── CARD STACK CONTAINER ── */}
      <div className="relative flex items-center justify-center w-[280px] h-[470px] sm:w-[320px] sm:h-[540px] lg:w-[360px] lg:h-[608px] xl:w-[380px] xl:h-[640px]">
        {/* Stacked Preview Cards (Reverse order so deeper cards render behind) */}
        {previewIndices
          .slice()
          .reverse()
          .map((cardIndex, _stackPositionReversed) => {
            const card = videos[cardIndex];
            if (!card) return null;

            // depth from 1 to 3
            const depth = previewIndices.indexOf(cardIndex) + 1;
            const translateX = depth === 1 ? 28 : depth === 2 ? 56 : 84;
            const rotate = depth === 1 ? 2 : depth === 2 ? 4 : 6;
            const scale = depth === 1 ? 0.94 : depth === 2 ? 0.88 : 0.82;
            const opacity = depth === 1 ? 0.85 : depth === 2 ? 0.65 : 0.45;
            const zIndex = 30 - depth * 5;

            return (
              <motion.div
                key={card.id || cardIndex}
                layout
                onClick={() => handleSelectCard(cardIndex)}
                className={cn(
                  "absolute inset-0 rounded-[24px] overflow-hidden isolate cursor-pointer",
                  "border border-[#D4A84B]/30 shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
                  "origin-center select-none transition-shadow hover:border-[#D4A84B]/70"
                )}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
                  opacity,
                  zIndex,
                }}
                whileHover={{ scale: scale * 1.02 }}
                title={`Click to view ${card.title}`}
                aria-label={`Preview card: ${card.title}`}
              >
                {/* Poster / Background */}
                <Image
                  src={card.poster}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />

                {/* Subtitle / Title Pill at Bottom */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col">
                  {card.badge && (
                    <span className="inline-flex items-center gap-1 self-start rounded-full bg-[#C6A15B]/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#E8D6A8] backdrop-blur-md">
                      {card.badge}
                    </span>
                  )}
                  <p className="mt-1 font-heading text-sm font-semibold text-[#E8D6A8] drop-shadow-md">
                    {card.title}
                  </p>
                  {card.guests && (
                    <p className="text-[11px] font-body text-[#E8D6A8]/70">
                      {card.guests}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}

        {/* ── FEATURED ACTIVE FRONT CARD (Z-40) ── */}
        <motion.div
          key={activeVideo.id}
          layout
          className={cn(
            "relative w-full h-full rounded-[24px] overflow-hidden isolate z-40",
            "border border-[#C6A15B]/60 shadow-[0_12px_48px_rgba(0,0,0,0.85)]",
            "bg-[#0B0B0B]"
          )}
        >
          {/* Active Video Player */}
          <video
            ref={videoRef}
            src={activeVideo.mp4}
            poster={activeVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={activeVideo.ariaLabel || activeVideo.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          />

          {/* Dark luxury bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/20 to-transparent pointer-events-none" />

          {/* Top Badge: Royal Moment */}
          <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0B]/70 border border-[#C6A15B]/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#E8D6A8] backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-[#C6A15B]" />
              {activeVideo.badge || "Featured Celebration"}
            </span>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B]/70 border border-[#C6A15B]/40 text-[#E8D6A8] backdrop-blur-md transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
              aria-label={isPlaying ? "Pause featured reel" : "Play featured reel"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#E8D6A8] drop-shadow-md">
              {activeVideo.title}
            </h3>
            {activeVideo.subtitle && (
              <p className="mt-0.5 font-body text-xs sm:text-sm text-[#C6A15B] font-medium">
                {activeVideo.subtitle}
              </p>
            )}

            <div className="mt-2 flex items-center gap-3 text-xs text-[#E8D6A8]/80">
              {activeVideo.guests && <span>{activeVideo.guests}</span>}
              {activeVideo.guests && activeVideo.location && <span>&bull;</span>}
              {activeVideo.location && <span>{activeVideo.location}</span>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── CAROUSEL CONTROLS & THUMBNAIL INDICATORS ── */}
      {totalVideos > 1 && (
        <div className="mt-6 flex items-center gap-4 z-40">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C6A15B]/30 bg-[#0B0B0B]/80 text-[#E8D6A8] transition-colors hover:border-[#C6A15B] hover:bg-[#C6A15B]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            aria-label="Previous celebration video"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {videos.map((vid, idx) => (
              <button
                key={vid.id || idx}
                type="button"
                onClick={() => handleSelectCard(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === safeIndex
                    ? "w-6 bg-[#C6A15B]"
                    : "w-2 bg-[#C6A15B]/30 hover:bg-[#C6A15B]/60"
                )}
                aria-label={`Go to video ${idx + 1}: ${vid.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C6A15B]/30 bg-[#0B0B0B]/80 text-[#E8D6A8] transition-colors hover:border-[#C6A15B] hover:bg-[#C6A15B]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            aria-label="Next celebration video"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
