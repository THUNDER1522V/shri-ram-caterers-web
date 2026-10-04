"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { m, PanInfo, useReducedMotion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoTestimonial } from "@/data/testimonials";

interface VideoCoverflowProps {
  testimonials: VideoTestimonial[];
}

export function VideoCoverflow({ testimonials }: VideoCoverflowProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(testimonials.length / 2));
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [hasError, setHasError] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mark as hydrated safely
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Intersection Observer for the section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Handle Play/Pause logic based on active index and view state
  useEffect(() => {
    if (!isHydrated) return;

    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIndex && inView) {
        // Try to play
        vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        vid.pause();
        if (idx !== activeIndex) {
          vid.currentTime = 0; // Reset inactive videos
        }
      }
    });

    if (!inView) setIsPlaying(false);
  }, [activeIndex, inView, isHydrated]);

  // Tab visibility pause
  useEffect(() => {
    const handleVisChange = () => {
      if (document.hidden && isPlaying) {
        const vid = videoRefs.current[activeIndex];
        if (vid) vid.pause();
        setIsPlaying(false);
      } else if (!document.hidden && inView && activeIndex >= 0) {
        const vid = videoRefs.current[activeIndex];
        if (vid) vid.play().catch(() => {});
        setIsPlaying(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);
    return () => document.removeEventListener("visibilitychange", handleVisChange);
  }, [activeIndex, isPlaying, inView]);

  // Video time update and auto-advance
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (vid.duration) {
      setProgress((vid.currentTime / vid.duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    setProgress(100);
    if (!prefersReducedMotion && inView && !userInteracted) {
      setTimeout(() => {
        if (activeIndex < testimonials.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else {
          setActiveIndex(0);
        }
      }, 1500);
    }
  };

  // Interaction tracking for auto-advance cancellation
  const markInteraction = useCallback(() => {
    setUserInteracted(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setUserInteracted(false);
    }, 10000);
  }, []);

  const goToIndex = (idx: number) => {
    if (idx === activeIndex) return;
    markInteraction();
    setActiveIndex(idx);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    markInteraction();
    const vid = videoRefs.current[activeIndex];
    if (!vid) return;

    // Unmute on first user interaction if muted
    if (isMuted) setIsMuted(false);

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    markInteraction();
    setIsMuted(!isMuted);
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset }: PanInfo) => {
    const swipe = offset.x;
    if (swipe < -50 && activeIndex < testimonials.length - 1) {
      goToIndex(activeIndex + 1);
    } else if (swipe > 50 && activeIndex > 0) {
      goToIndex(activeIndex - 1);
    }
  };

  // Preload logic: Only active and next video should preload metadata
  const getPreload = (idx: number) => {
    if (!inView) return "none";
    if (idx === activeIndex || idx === activeIndex + 1) return "metadata";
    return "none";
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 140, damping: 22 };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-10 touch-pan-y"
      role="region"
      aria-roledescription="carousel"
      aria-label="Video Testimonials"
    >
      {/* Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        {isHydrated && `Showing testimonial from ${testimonials[activeIndex]?.name}`}
      </div>

      <div className="relative mx-auto flex h-[560px] w-full max-w-7xl items-center justify-center">
        {testimonials.map((t, i) => {
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);
          
          // Size calculations
          // Mobile: center is ~72vw, overlapping
          // Desktop: center is 290x520. Scale step = 0.88, opacity step = -0.15
          const isCenter = offset === 0;
          const scale = Math.pow(0.88, absOffset);
          const zIndex = 20 - absOffset;
          // Space out cards horizontally: ~120px per step on desktop
          const translateX = offset * (isHydrated && window.innerWidth < 768 ? 60 : 130); 
          const opacity = isCenter ? 1 : Math.max(0, 1 - absOffset * 0.15);
          
          // Do not render cards that are too far away to save DOM nodes, unless SSR
          if (isHydrated && absOffset > 3) return null;

          return (
            <m.div
              key={t.id}
              className={cn(
                "absolute flex h-[520px] w-[72vw] md:w-[290px] flex-col overflow-hidden rounded-[20px] border shadow-2xl transition-shadow",
                isCenter
                  ? "cursor-default border-[#D4A84B]/70 shadow-[#D4A84B]/20"
                  : "cursor-pointer border-[#D4A84B]/40 hover:border-[#D4A84B]/60"
              )}
              initial={false}
              animate={isHydrated ? {
                x: translateX,
                scale,
                opacity,
                zIndex,
              } : {
                x: 0, scale: isCenter ? 1 : 0, opacity: isCenter ? 1 : 0, zIndex
              }}
              transition={springConfig}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => goToIndex(i)}
              tabIndex={isCenter ? 0 : -1}
              aria-hidden={!isCenter}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!isCenter) goToIndex(i);
                  else togglePlay(e as unknown as React.MouseEvent);
                } else if (e.key === "ArrowLeft" && i > 0) {
                  goToIndex(i - 1);
                } else if (e.key === "ArrowRight" && i < testimonials.length - 1) {
                  goToIndex(i + 1);
                }
              }}
            >
              {/* Fallback Background if no media */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A0A10] to-[#7A1118]" />

              {/* Poster or Video */}
              {!hasError[t.id] ? (
                <>
                  <Image
                    src={t.poster}
                    alt={`${t.name} testimonial poster`}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-500",
                      isPlaying && isCenter ? "opacity-0" : "opacity-100"
                    )}
                    sizes="(max-width: 768px) 72vw, 290px"
                    onError={() => setHasError((prev) => ({ ...prev, [t.id]: true }))}
                    priority={i === activeIndex} // priority for initial center card
                  />
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={t.mp4}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                      isPlaying && isCenter ? "opacity-100" : "opacity-0"
                    )}
                    playsInline
                    muted={isCenter ? isMuted : true}
                    loop={false}
                    preload={getPreload(i)}
                    onTimeUpdate={isCenter ? handleTimeUpdate : undefined}
                    onEnded={isCenter ? handleVideoEnded : undefined}
                    onError={() => setHasError((prev) => ({ ...prev, [t.id]: true }))}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-heading text-xl text-gold">
                    {getInitials(t.name)}
                  </div>
                  {t.quote && (
                    <p className="font-heading text-lg italic text-champagne-100">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* View Count Pill */}
              {t.viewCount && (
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-background/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md border border-white/10">
                  <Eye className="h-3 w-3 opacity-80" />
                  <span>{t.viewCount}</span>
                </div>
              )}

              {/* Mute Toggle (Only on Active) */}
              {isCenter && isPlaying && !hasError[t.id] && (
                <button
                  onClick={toggleMute}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-white backdrop-blur-md border border-white/10 hover:bg-background/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              )}

              {/* Center Play/Pause Button Overlay */}
              {isCenter && !hasError[t.id] && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group"
                  onClick={togglePlay}
                >
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full bg-gold/90 text-background shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110",
                      isPlaying ? "opacity-0 scale-95 group-hover:opacity-100" : "opacity-100"
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current" />
                    ) : (
                      <Play className="h-6 w-6 ml-1 fill-current" />
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#0B0B0B]/90 via-[#0B0B0B]/40 to-transparent pointer-events-none" />

              {/* Metadata Text */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-left pointer-events-none">
                <h3 className="font-heading text-xl font-medium text-white drop-shadow-md">
                  {t.name}
                </h3>
                <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-wider text-gold drop-shadow-md">
                  {t.eventType}
                </p>
                <p className="mt-0.5 font-body text-xs text-white/80 drop-shadow-md">
                  {t.location}
                </p>
              </div>

              {/* Progress Bar (Only Active) */}
              {isCenter && !hasError[t.id] && (
                <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
                  <div
                    className="h-full bg-gold transition-all duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </m.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={() => goToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-background disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Previous Testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                i === activeIndex ? "w-6 bg-gold" : "w-2 bg-gold/30 hover:bg-gold/50"
              )}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === activeIndex ? "true" : "false"}
            />
          ))}
        </div>

        <button
          onClick={() => goToIndex(Math.min(testimonials.length - 1, activeIndex + 1))}
          disabled={activeIndex === testimonials.length - 1}
          className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-background disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Next Testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
