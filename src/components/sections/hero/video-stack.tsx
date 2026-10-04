"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VIDEO_CARDS } from "./video-card-data";

export function VideoStack() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const isIntersectingRef = React.useRef(true);

  React.useEffect(() => {
    const v = videoRef.current;
    const container = containerRef.current;
    if (!v) return;

    const playVideo = () => {
      if (!v) return;
      v.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    };

    // Attempt instant play
    playVideo();

    // Observe container intersection with rootMargin
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

    // Handle tab visibility change
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
  }, []);

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

  const frontCard = VIDEO_CARDS[0];
  const card1 = VIDEO_CARDS[1];
  const card2 = VIDEO_CARDS[2];
  const card3 = VIDEO_CARDS[3];

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full pr-10 sm:pr-14 lg:pr-24"
    >
      {/* ── CARD 3 (Deepest Background Card: scale 0.82, x +84px, rot 6deg, opacity 0.45) ── */}
      <div
        className={cn(
          "absolute w-[280px] h-[470px] sm:w-[320px] sm:h-[540px] lg:w-[360px] lg:h-[608px] xl:w-[380px] xl:h-[640px]",
          "rounded-[24px] overflow-hidden isolate",
          "border border-[#D4A84B]/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
          "origin-center pointer-events-none select-none"
        )}
        style={{
          transform: "translateX(84px) scale(0.82) rotate(6deg)",
          opacity: 0.45,
          zIndex: 5,
          background: "#0B0B0B",
        }}
        aria-hidden="true"
      >
        <Image
          src={card3.poster}
          alt={card3.title}
          fill
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
          className="object-cover"
        />
        {/* Dark-to-maroon bottom overlay */}
        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-20 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(11,11,11,0.98) 0%, rgba(122,17,24,0.85) 50%, transparent 100%)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A84B]">
              {card3.guests}
            </span>
          </div>
          <p className="mt-1 font-heading text-base sm:text-lg font-semibold tracking-tight text-[#F5EFE0] line-clamp-1">
            {card3.title}
          </p>
          <p className="text-[11px] text-[#E8D6A8]/70 tracking-wide mt-0.5 font-body line-clamp-1">
            {card3.location}
          </p>
        </div>
      </div>

      {/* ── CARD 2 (Middle Background Card: scale 0.88, x +56px, rot 4.5deg, opacity 0.65) ── */}
      <div
        className={cn(
          "absolute w-[280px] h-[470px] sm:w-[320px] sm:h-[540px] lg:w-[360px] lg:h-[608px] xl:w-[380px] xl:h-[640px]",
          "rounded-[24px] overflow-hidden isolate",
          "border border-[#D4A84B]/30 shadow-[0_6px_28px_rgba(0,0,0,0.6)]",
          "origin-center pointer-events-none select-none"
        )}
        style={{
          transform: "translateX(56px) scale(0.88) rotate(4.5deg)",
          opacity: 0.65,
          zIndex: 10,
          background: "#0B0B0B",
        }}
        aria-hidden="true"
      >
        <Image
          src={card2.poster}
          alt={card2.title}
          fill
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
          className="object-cover"
        />
        {/* Dark-to-maroon bottom overlay */}
        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-20 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(11,11,11,0.98) 0%, rgba(122,17,24,0.85) 50%, transparent 100%)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A84B]">
              {card2.guests}
            </span>
          </div>
          <p className="mt-1 font-heading text-base sm:text-lg font-semibold tracking-tight text-[#F5EFE0] line-clamp-1">
            {card2.title}
          </p>
          <p className="text-[11px] text-[#E8D6A8]/70 tracking-wide mt-0.5 font-body line-clamp-1">
            {card2.location}
          </p>
        </div>
      </div>

      {/* ── CARD 1 (First Background Card: scale 0.94, x +28px, rot 2.5deg, opacity 0.85) ── */}
      <div
        className={cn(
          "absolute w-[280px] h-[470px] sm:w-[320px] sm:h-[540px] lg:w-[360px] lg:h-[608px] xl:w-[380px] xl:h-[640px]",
          "rounded-[24px] overflow-hidden isolate",
          "border border-[#D4A84B]/40 shadow-[0_8px_32px_rgba(0,0,0,0.7)]",
          "origin-center pointer-events-none select-none"
        )}
        style={{
          transform: "translateX(28px) scale(0.94) rotate(2.5deg)",
          opacity: 0.85,
          zIndex: 20,
          background: "#0B0B0B",
        }}
        aria-hidden="true"
      >
        <Image
          src={card1.poster}
          alt={card1.title}
          fill
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
          className="object-cover"
        />
        {/* Dark-to-maroon bottom overlay */}
        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-20 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(11,11,11,0.98) 0%, rgba(122,17,24,0.85) 50%, transparent 100%)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A84B]">
              {card1.guests}
            </span>
          </div>
          <p className="mt-1 font-heading text-base sm:text-lg font-semibold tracking-tight text-[#F5EFE0] line-clamp-1">
            {card1.title}
          </p>
          <p className="text-[11px] text-[#E8D6A8]/70 tracking-wide mt-0.5 font-body line-clamp-1">
            {card1.location}
          </p>
        </div>
      </div>

      {/* ── CARD 0 (Front Card: Active Video, z-30, scale 1.0) ── */}
      <m.div
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        tabIndex={0}
        role="button"
        aria-label={`Showcase reel for ${frontCard.title}. Press enter or space to pause or play.`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            togglePlay();
          }
        }}
        onClick={togglePlay}
        className={cn(
          "relative w-[280px] h-[470px] sm:w-[320px] sm:h-[540px] lg:w-[360px] lg:h-[608px] xl:w-[380px] xl:h-[640px]",
          "rounded-[24px] overflow-hidden isolate",
          "border border-[#D4A84B]/60 shadow-[0_0_40px_rgba(212,168,75,0.2),0_12px_40px_rgba(0,0,0,0.8)]",
          "cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A84B]"
        )}
        style={{
          zIndex: 30,
          background: "#0B0B0B",
        }}
      >
        {/* Instant priority poster image behind video for zero layout shift / instant paint */}
        <Image
          src={frontCard.poster}
          alt={frontCard.title}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
          className="object-cover rounded-[24px]"
        />

        {/* Active hero video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover rounded-[24px]"
          poster={frontCard.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={frontCard.ariaLabel}
        >
          <source src={frontCard.mp4} type="video/mp4" />
          {frontCard.webm && <source src={frontCard.webm} type="video/webm" />}
        </video>

        {/* Glass reflection sheen (top edge) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-[24px] z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
          }}
        />

        {/* Luxury corner framing markers */}
        <div className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l-2 border-t-2 border-[#D4A84B]/80 rounded-tl-sm z-10" />
        <div className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-[#D4A84B]/80 rounded-tr-sm z-10" />
        <div className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-[#D4A84B]/80 rounded-bl-sm z-10" />
        <div className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-[#D4A84B]/80 rounded-br-sm z-10" />

        {/* Play icon overlay (visible when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A84B]/50 bg-black/60 backdrop-blur-md group-hover:bg-black/40 group-hover:scale-105 transition-all">
              <Play className="ml-1.5 h-7 w-7 text-[#D4A84B]" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Bottom metadata overlay with dark-to-maroon gradient */}
        <div
          className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(11,11,11,0.98) 0%, rgba(122,17,24,0.85) 50%, transparent 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4A84B] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4A84B]">
              {frontCard.guests}
            </span>
          </div>
          <p className="mt-1 font-heading text-lg sm:text-xl font-semibold tracking-wide text-[#F5EFE0] drop-shadow-md">
            {frontCard.title}
          </p>
          <p className="text-xs text-[#E8D6A8]/75 tracking-wider mt-0.5 font-body">
            {frontCard.location}
          </p>
        </div>
      </m.div>
    </div>
  );
}
