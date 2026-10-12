"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Play, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight, X, Sparkles, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { GalleryContent, GalleryMediaItem } from "@/types/gallery";
import { galleryContent as defaultGalleryContent } from "@/content/gallery";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

interface VideoCardProps {
  item: GalleryMediaItem;
  index: number;
  onOpenLightbox: (item: GalleryMediaItem) => void;
}

function GalleryCard({ item, index, onOpenLightbox }: VideoCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || item.type !== "video") return;

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
  }, [item.type]);

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
      aria-label={`Open celebration media: ${item.title}`}
      className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-[#C6A15B]/30 bg-[#0B0B0B] shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-2 hover:border-[#C6A15B] hover:shadow-[0_16px_40px_rgba(198,161,91,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
    >
      {/* 9:16 Portrait Reel Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#120B0C]">
        {item.type === "video" ? (
          inView ? (
            <video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={item.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#120B0C] flex items-center justify-center">
              <span className="font-heading text-xs text-[#E8D6A8]/40 uppercase tracking-widest">
                {item.title}
              </span>
            </div>
          )
        ) : (
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Ambient Top Vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/20 to-transparent pointer-events-none" />

        {/* Ambient Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent pointer-events-none" />

        {/* Category Badge & Sound Control */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/75 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wider text-[#E8D6A8] backdrop-blur-md shadow-sm">
            <Sparkles className="h-3 w-3 text-[#C6A15B]" />
            {item.tag}
          </span>

          {item.type === "video" && (
            <button
              type="button"
              onClick={toggleMute}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-[#C6A15B]/30 bg-[#0B0B0B]/75 text-[#E8D6A8] backdrop-blur-md transition-all duration-300 hover:border-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
              aria-label={isMuted ? "Unmute video reel" : "Mute video reel"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Floating Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#0B0B0B]/60 text-[#E8D6A8] opacity-0 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
            {item.type === "video" ? (
              <Play className="h-5 w-5 fill-[#C6A15B] text-[#C6A15B] ml-0.5" />
            ) : (
              <ImageIcon className="h-5 w-5 text-[#C6A15B]" />
            )}
          </div>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col justify-end">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-[#C6A15B]">
            {item.category}
          </p>
          <h3 className="mt-1 font-heading text-base font-semibold leading-snug text-[#E8D6A8] drop-shadow-md sm:text-lg">
            {item.title}
          </h3>
          <p className="mt-1 font-body text-xs text-[#E8D6A8]/75 line-clamp-1">
            {item.subtitle}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-[#C6A15B]/15 pt-2.5">
            <span className="font-body text-[11px] font-medium text-[#C6A15B]/80 flex items-center gap-1">
              Tap to view full reel
            </span>
            <Maximize2 className="h-3.5 w-3.5 text-[#C6A15B]/60 transition-colors group-hover:text-[#C6A15B]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface GallerySectionProps {
  content?: GalleryContent;
  items?: GalleryMediaItem[];
  categories?: string[];
}

export function GallerySection({
  content = defaultGalleryContent,
  items,
  categories,
}: GallerySectionProps) {
  const mediaList = items || content.items;
  const filterList = categories || content.categories;

  const [activeFilter, setActiveFilter] = React.useState(filterList[0] || "All Moments");
  const [lightboxItem, setLightboxItem] = React.useState<GalleryMediaItem | null>(null);

  // Synchronize active filter if categories prop changes
  React.useEffect(() => {
    if (!filterList.includes(activeFilter)) {
      setActiveFilter(filterList[0] || "All Moments");
    }
  }, [filterList, activeFilter]);

  const filteredItems = React.useMemo(() => {
    if (activeFilter.startsWith("All Moments")) {
      return mediaList;
    }
    return mediaList.filter((item) => item.category === activeFilter);
  }, [activeFilter, mediaList]);

  const handleNextLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setLightboxItem(filteredItems[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxItem(filteredItems[prevIndex]);
  };

  return (
    <Section id="gallery" className="relative overflow-hidden bg-[#0B0B0B] py-24 sm:py-32">
      {/* Soft Maroon Radial Glow in Background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4A0A10]/20 blur-[130px]" />

      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <Petals petalCount={6} dustCount={3} sectionId="gallery" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#C6A15B] md:text-sm">
            {content.eyebrow}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-[#E8D6A8] md:text-5xl drop-shadow-sm">
            {content.title}
          </h2>
          <p className="mt-4 font-body text-base text-[#E8D6A8]/75">
            {content.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {filterList.map((category) => {
            const count = category.startsWith("All Moments")
              ? mediaList.length
              : mediaList.filter((i) => i.category === category).length;
            const label = category.startsWith("All Moments")
              ? `All Moments (${count})`
              : `${category} (${count})`;
            const isActive = activeFilter === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={`rounded-full px-4 py-2 font-body text-xs sm:text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] ${
                  isActive
                    ? "bg-[#C6A15B] text-[#0B0B0B] shadow-[0_2px_12px_rgba(198,161,91,0.35)]"
                    : "border border-[#C6A15B]/25 bg-white/5 text-[#E8D6A8]/80 hover:border-[#C6A15B]/60 hover:bg-white/10 hover:text-[#E8D6A8]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 9:16 Portrait Grid */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={idx}
                onOpenLightbox={(selected) => setLightboxItem(selected)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-sm overflow-hidden rounded-2xl border border-[#C6A15B]/50 bg-[#0B0B0B]"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.type === "video" ? (
                <video
                  src={lightboxItem.src}
                  autoPlay
                  controls
                  playsInline
                  className="h-full w-full max-h-[80vh] object-cover"
                />
              ) : (
                <div className="relative aspect-[9/16] w-full max-h-[80vh]">
                  <Image
                    src={lightboxItem.src}
                    alt={lightboxItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4 bg-[#0B0B0B]/95 border-t border-[#C6A15B]/20">
                <p className="font-heading text-xs uppercase tracking-wider text-[#C6A15B]">
                  {lightboxItem.category}
                </p>
                <h3 className="font-heading text-lg font-bold text-[#E8D6A8]">
                  {lightboxItem.title}
                </h3>
                <p className="mt-1 font-body text-xs text-[#E8D6A8]/80">
                  {lightboxItem.subtitle}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-[#C6A15B] hover:text-black"
                aria-label="Close celebration media"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Navigation Arrows */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevLightbox}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-[#C6A15B] hover:text-black"
                    aria-label="Previous media"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextLightbox}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-[#C6A15B] hover:text-black"
                    aria-label="Next media"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
