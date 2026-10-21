"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, Pause, ChevronRight, ChevronLeft, Sparkles, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroVideoItem, HeroMediaType } from "@/types/hero";
import { heroContent } from "@/content/homepage";

interface HeroMediaSystemProps {
  videos?: HeroVideoItem[];
  className?: string;
  autoRotateInterval?: number; // ms, default 7000
}

/**
 * Polymorphic Media Renderer
 * Renders video, static image, youtube embed, or instagram reel within the exact same frame.
 * Future CMS / Supabase compatibility without redesign.
 */
function MediaRenderer({
  item,
  isFront,
  isPlaying,
  isMuted,
  videoRef,
}: {
  item: HeroVideoItem;
  isFront: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}) {
  const mediaType: HeroMediaType = item.type || "video";

  if (mediaType === "image") {
    return (
      <Image
        src={item.poster || item.src || "/images/hero-reel-poster.webp"}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
        priority={isFront}
      />
    );
  }

  if (mediaType === "youtube" && item.youtubeId) {
    if (!isFront) {
      return (
        <Image
          src={item.poster || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
          alt={item.title}
          fill
          className="object-cover"
        />
      );
    }
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${item.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="absolute inset-0 h-full w-full pointer-events-none border-0"
      />
    );
  }

  if (mediaType === "instagram" && item.instagramUrl) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={item.poster || "/images/hero-reel-poster.webp"}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="rounded-full bg-black/70 px-3 py-1 text-xs text-[#E8D6A8]">
            Instagram Reel
          </span>
        </div>
      </div>
    );
  }

  // Default: HTML5 video
  const videoSrc = item.mp4 || item.src || "/videos/hero_video.mp4";

  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={item.poster}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload={isFront ? "auto" : "metadata"}
        aria-label={item.ariaLabel || item.title}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          isFront ? "opacity-100" : "opacity-90"
        )}
      />
      {/* Poster fallback overlay until loaded */}
      {!isPlaying && isFront && item.poster && (
        <Image
          src={item.poster}
          alt={item.title}
          fill
          className="object-cover -z-10"
          sizes="(max-width: 640px) 280px, 380px"
        />
      )}
    </>
  );
}

export function VideoStack({
  videos = heroContent.videos,
  className,
  autoRotateInterval = 7000,
}: HeroMediaSystemProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [inView, setInView] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  const totalVideos = videos.length;
  const safeIndex = totalVideos > 0 ? ((activeIndex % totalVideos) + totalVideos) % totalVideos : 0;
  const activeVideo = videos[safeIndex] || heroContent.videos[0];

  // Exactly TWO partially visible stacked cards behind the main active card
  const behindIndices = React.useMemo(() => {
    if (totalVideos <= 1) return [];
    if (totalVideos === 2) return [(safeIndex + 1) % totalVideos];
    return [
      (safeIndex + 1) % totalVideos, // Card 1 behind (depth 1)
      (safeIndex + 2) % totalVideos, // Card 2 behind (depth 2)
    ];
  }, [safeIndex, totalVideos]);

  // Video Autoplay & Intersection Handling
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

    if (inView) {
      playVideo();
    }

    if (!container) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          playVideo();
        } else {
          v.pause();
          setIsPlaying(false);
        }
      },
      { rootMargin: "150px 0px", threshold: 0.1 }
    );
    io.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden) {
        v.pause();
        setIsPlaying(false);
      } else if (inView) {
        playVideo();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [safeIndex, inView]);

  // Auto-Rotation Timer with Progress Bar
  React.useEffect(() => {
    if (!inView || isHovered || !isPlaying || totalVideos <= 1) {
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / autoRotateInterval) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % totalVideos);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [inView, isHovered, isPlaying, safeIndex, totalVideos, autoRotateInterval]);

  // Reset progress when index changes
  React.useEffect(() => {
    setProgress(0);
  }, [safeIndex]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;
    setIsMuted(nextMuted);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col items-center justify-center w-full pr-8 sm:pr-16 lg:pr-24",
        className
      )}
    >
      {/* ── CARD STACK CONTAINER ── */}
      <div className="relative flex items-center justify-center w-[280px] h-[480px] sm:w-[320px] sm:h-[540px] lg:w-[360px] lg:h-[610px] xl:w-[380px] xl:h-[640px]">
        
        {/* ── TWO PARTIALLY VISIBLE STACKED CARDS BEHIND ── */}
        {behindIndices
          .slice()
          .reverse()
          .map((cardIndex) => {
            const card = videos[cardIndex];
            if (!card) return null;

            // depth 1 = immediate card behind; depth 2 = deepest card
            const depth = behindIndices.indexOf(cardIndex) + 1;
            const translateX = depth === 1 ? 32 : 64;
            const rotate = depth === 1 ? 3.5 : 7;
            const scale = depth === 1 ? 0.94 : 0.88;
            const opacity = depth === 1 ? 0.85 : 0.55;
            const zIndex = 30 - depth * 10;

            return (
              <motion.div
                key={card.id || cardIndex}
                layout
                onClick={() => handleSelectCard(cardIndex)}
                className={cn(
                  "absolute inset-0 rounded-[24px] overflow-hidden isolate cursor-pointer",
                  "border border-[#C6A15B]/40 shadow-[0_8px_32px_rgba(0,0,0,0.8)]",
                  "origin-center select-none transition-all duration-300",
                  "hover:border-[#C6A15B] hover:shadow-[0_12px_40px_rgba(198,161,91,0.25)]"
                )}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
                  opacity,
                  zIndex,
                }}
                whileHover={{ scale: scale * 1.02 }}
                title={`Click to view ${card.title}`}
                aria-label={`Preview card: ${card.title}. Click to bring forward.`}
              >
                {/* Poster / Background */}
                <Image
                  src={card.poster}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />

                {/* Subtitle / Title Pill at Bottom */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col">
                  {card.badge && (
                    <span className="inline-flex items-center gap-1 self-start rounded-full bg-[#0B0B0B]/80 border border-[#C6A15B]/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#E8D6A8] backdrop-blur-md">
                      {card.badge}
                    </span>
                  )}
                  <p className="mt-1.5 font-heading text-sm font-semibold text-[#E8D6A8] drop-shadow-md line-clamp-1">
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

        {/* ── MAIN ACTIVE VIDEO IN FRONT (Z-40) ── */}
        <motion.div
          key={activeVideo.id}
          layout
          className={cn(
            "relative w-full h-full rounded-[24px] overflow-hidden isolate z-40",
            "border border-[#C6A15B]/70 shadow-[0_16px_56px_rgba(0,0,0,0.9)]",
            "bg-[#0B0B0B]"
          )}
        >
          {/* Active Media Player (video / image / youtube / instagram) */}
          <MediaRenderer
            item={activeVideo}
            isFront={true}
            isPlaying={isPlaying}
            isMuted={isMuted}
            videoRef={videoRef}
          />

          {/* Luxury Top Vignette */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/20 to-transparent pointer-events-none" />

          {/* Luxury Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/75 to-transparent pointer-events-none" />

          {/* Top Bar: Badge & Media Controls */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0B]/80 border border-[#C6A15B]/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#E8D6A8] backdrop-blur-md shadow-sm">
              <Sparkles className="h-3 w-3 text-[#C6A15B]" />
              {activeVideo.badge || "Featured Celebration"}
            </span>

            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              {(!activeVideo.type || activeVideo.type === "video") && (
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B0B0B]/70 border border-[#C6A15B]/40 text-[#E8D6A8] backdrop-blur-md transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                  aria-label={isMuted ? "Unmute reel" : "Mute reel"}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              )}

              {/* Play/Pause Button */}
              {(!activeVideo.type || activeVideo.type === "video") && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B0B0B]/70 border border-[#C6A15B]/40 text-[#E8D6A8] backdrop-blur-md transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                  aria-label={isPlaying ? "Pause reel" : "Play reel"}
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#E8D6A8] drop-shadow-md">
              {activeVideo.title}
            </h3>
            {activeVideo.subtitle && (
              <p className="mt-1 font-body text-xs sm:text-sm text-[#C6A15B] font-medium drop-shadow-sm">
                {activeVideo.subtitle}
              </p>
            )}

            <div className="mt-2.5 flex items-center gap-2.5 text-xs text-[#E8D6A8]/85">
              {activeVideo.guests && (
                <span className="font-medium">{activeVideo.guests}</span>
              )}
              {activeVideo.guests && activeVideo.location && (
                <span className="text-[#C6A15B]">&bull;</span>
              )}
              {activeVideo.location && (
                <span className="text-[#E8D6A8]/75 line-clamp-1">{activeVideo.location}</span>
              )}
            </div>
          </div>

          {/* Auto-Rotate Progress Bar at Bottom of Front Card */}
          {totalVideos > 1 && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#C6A15B]/20 z-30">
              <div
                className="h-full bg-gradient-to-r from-[#C6A15B] to-[#E8D6A8] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* ── MANUAL SELECTION & CAROUSEL CONTROLS ── */}
      {totalVideos > 1 && (
        <div className="mt-6 flex items-center gap-4 z-40">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/80 text-[#E8D6A8] transition-colors hover:border-[#C6A15B] hover:bg-[#C6A15B]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            aria-label="Previous celebration video"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Indicator Pills */}
          <div className="flex items-center gap-1.5">
            {videos.map((vid, idx) => (
              <button
                key={vid.id || idx}
                type="button"
                onClick={() => handleSelectCard(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === safeIndex
                    ? "w-7 bg-[#C6A15B] shadow-[0_0_8px_rgba(198,161,91,0.6)]"
                    : "w-2 bg-[#C6A15B]/30 hover:bg-[#C6A15B]/60"
                )}
                aria-label={`Go to video ${idx + 1}: ${vid.title}`}
                aria-current={idx === safeIndex ? "true" : "false"}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/80 text-[#E8D6A8] transition-colors hover:border-[#C6A15B] hover:bg-[#C6A15B]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            aria-label="Next celebration video"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoStack;
