"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Play, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  video: string;
  tag: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "weddings",
    title: "Celebrating Divyansh & Naina",
    category: "Weddings",
    subtitle: "Grand Royal Wedding Banquet",
    tag: "Wedding Gala",
    video: "/videos/divyansh-naina.mp4",
  },
  {
    id: "buffet",
    title: "Royal Buffet Architecture",
    category: "Buffet Architecture",
    subtitle: "Multi-Tier Luxury Banquet Lines",
    tag: "Buffet Display",
    video: "/videos/buffet-architecture.mp4",
  },
  {
    id: "live-counters",
    title: "Live Chef Culinary Theatre",
    category: "Live Counters",
    subtitle: "Artisan Chaat & Sizzling Delights",
    tag: "Live Food Theatre",
    video: "/videos/bhelpuri.mp4",
  },
  {
    id: "beverages",
    title: "Exotic Welcome Mocktails",
    category: "Beverages",
    subtitle: "Craft Botanical Infusions",
    tag: "Welcome Bar",
    video: "/videos/exotic-mocktails.mp4",
  },
  {
    id: "themes",
    title: "Bespoke Counter Styling",
    category: "Themes & Decor",
    subtitle: "Grand Royal Floral & Dining Themes",
    tag: "Thematic Styling",
    video: "/videos/themes-and-counters.mp4",
  },
];

const filters = [
  "All Moments (5)",
  "Weddings",
  "Buffet Architecture",
  "Live Counters",
  "Beverages",
  "Themes & Decor",
];

interface VideoCardProps {
  item: GalleryItem;
  index: number;
  onOpenLightbox: (item: GalleryItem) => void;
}

function GalleryVideoCard({ item, index, onOpenLightbox }: VideoCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (video) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: "250px 0px", threshold: 0.1 }
    );

    io.observe(card);
    return () => io.disconnect();
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => onOpenLightbox(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenLightbox(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open celebration video: ${item.title}`}
      className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-[#C6A15B]/30 bg-[#0B0B0B] shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-2 hover:border-[#C6A15B] hover:shadow-[0_16px_40px_rgba(198,161,91,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
    >
      {/* 9:16 Portrait Reel Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#120B0C]">
        {/* Real Video Element (loaded only when in view, paused offscreen) */}
        {inView && (
          <video
            ref={videoRef}
            src={item.video}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Cinematic Scrim Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-black/40 opacity-90 transition-opacity duration-300 group-hover:opacity-75" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Header Floating Badges */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 sm:p-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/80 px-2.5 py-1 backdrop-blur-md shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C6A15B]" />
            <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#E8D6A8]">
              {item.tag}
            </span>
          </span>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/70 text-[#C6A15B] backdrop-blur-md transition-transform duration-200 hover:scale-110 hover:bg-[#C6A15B] hover:text-[#0B0B0B]"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Center Hover Action Indicator */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A15B]/60 bg-[#0B0B0B]/80 text-[#C6A15B] opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 shadow-[0_0_20px_rgba(198,161,91,0.4)]">
            <Maximize2 className="h-5 w-5" />
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-4.5">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A15B]">
            {item.category}
          </span>
          <h3 className="mt-1 font-heading text-base sm:text-lg font-semibold leading-snug text-[#F5EFE0] drop-shadow-md line-clamp-2">
            {item.title}
          </h3>
          <p className="mt-1 font-body text-xs text-[#E8D6A8]/70 line-clamp-1">
            {item.subtitle}
          </p>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-[#C6A15B] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Play className="h-3 w-3 fill-[#C6A15B]" />
            <span>Click to watch full screen</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function GallerySection() {
  const [activeFilter, setActiveFilter] = React.useState("All Moments (5)");
  const [lightboxItem, setLightboxItem] = React.useState<GalleryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = React.useState<number>(0);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const filteredItems = React.useMemo(() => {
    if (activeFilter.startsWith("All")) return galleryItems;
    return galleryItems.filter(
      (item) => item.category.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter]);

  const openLightbox = (item: GalleryItem) => {
    const idx = galleryItems.findIndex((i) => i.id === item.id);
    setLightboxIndex(idx !== -1 ? idx : 0);
    setLightboxItem(item);
  };

  const nextLightboxVideo = React.useCallback(() => {
    setLightboxIndex((prevIdx) => {
      const nextIdx = (prevIdx + 1) % galleryItems.length;
      setLightboxItem(galleryItems[nextIdx]);
      return nextIdx;
    });
  }, []);

  const prevLightboxVideo = React.useCallback(() => {
    setLightboxIndex((prevIdx) => {
      const prev = (prevIdx - 1 + galleryItems.length) % galleryItems.length;
      setLightboxItem(galleryItems[prev]);
      return prev;
    });
  }, []);

  // Keyboard controls for lightbox
  React.useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
      if (e.key === "ArrowRight") nextLightboxVideo();
      if (e.key === "ArrowLeft") prevLightboxVideo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem, nextLightboxVideo, prevLightboxVideo]);

  // Mobile horizontal scroll helper
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <Section id="gallery" className="relative overflow-hidden bg-[#070707] py-16 sm:py-24">
      {/* Decorative Gold Radial Glow Background */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #C6A15B 0%, #7A1118 60%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* Ambient golden petals (background < petals z-[1] < content z-10) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={5} dustCount={3} sectionId="gallery" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#0B0B0B]/80 px-3.5 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
              Real Event Reels &amp; Moments
            </span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-[#F5EFE0] sm:text-4xl md:text-5xl">
            A Glimpse Into Celebrations{" "}
            <span className="italic text-[#C6A15B]">We Have Catered</span>
          </h2>

          <p className="mt-4 font-body text-sm leading-relaxed text-[#E8D6A8]/75 sm:text-base md:text-lg">
            Authentic, unfiltered video glimpses from real luxury weddings and celebrations across India.
            Pure vegetarian culinary curations captured live on ground.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border border-[#C6A15B] bg-[#C6A15B] text-[#0B0B0B] font-bold shadow-[0_4px_16px_rgba(198,161,91,0.35)]"
                      : "border border-[#C6A15B]/20 bg-[#0B0B0B]/60 text-[#E8D6A8]/80 hover:border-[#C6A15B]/60 hover:text-[#F5EFE0]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Section Sub-bar with count and mobile controls */}
          <div className="mt-6 flex items-center justify-between border-t border-[#C6A15B]/15 pt-4 text-xs text-[#E8D6A8]/60">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Showing <strong className="text-[#C6A15B]">{filteredItems.length}</strong> real event video reels
              </span>
            </div>

            {/* Mobile Scroll Arrows */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C6A15B]/30 bg-[#0B0B0B] text-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#0B0B0B] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C6A15B]/30 bg-[#0B0B0B] text-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#0B0B0B] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5-Video Reel Deck:
            - Desktop: 5-column grid where all 5 videos are visible side-by-side simultaneously!
            - Tablet/Mobile: Smooth horizontal scrollable carousel with snapping so user easily swipes through all 5!
        */}
        <div
          ref={scrollContainerRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-4 pt-2 sm:gap-5 scrollbar-none snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:gap-4 xl:gap-5 lg:overflow-visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="w-[280px] sm:w-[300px] shrink-0 snap-center lg:w-auto"
              >
                <GalleryVideoCard
                  item={item}
                  index={index}
                  onOpenLightbox={openLightbox}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </Container>

      {/* Full-Screen Cinema Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-6 backdrop-blur-xl"
            onClick={() => setLightboxItem(null)}
          >
            {/* Top Bar Controls */}
            <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 z-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-[#C6A15B]/50 bg-[#0B0B0B]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                  {lightboxItem.category}
                </span>
                <span className="hidden sm:inline font-heading text-sm text-[#F5EFE0]">
                  {lightboxItem.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-body text-xs text-[#E8D6A8]/70">
                  {lightboxIndex + 1} of {galleryItems.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/80 text-white transition-all hover:bg-[#C6A15B] hover:text-black"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxVideo();
              }}
              className="absolute left-3 sm:left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/80 text-[#C6A15B] transition-all hover:scale-110 hover:bg-[#C6A15B] hover:text-[#0B0B0B]"
              aria-label="Previous video"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxVideo();
              }}
              className="absolute right-3 sm:right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/80 text-[#C6A15B] transition-all hover:scale-110 hover:bg-[#C6A15B] hover:text-[#0B0B0B]"
              aria-label="Next video"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Cinema Video Container */}
            <motion.div
              key={lightboxItem.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[82vh] w-full max-w-[440px] aspect-[9/16] overflow-hidden rounded-2xl border border-[#C6A15B]/50 bg-black shadow-[0_0_80px_rgba(198,161,91,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={lightboxItem.video}
                autoPlay
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
