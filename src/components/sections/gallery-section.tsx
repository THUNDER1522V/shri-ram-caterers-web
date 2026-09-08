import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Camera } from "lucide-react";

interface GalleryItem {
  title: string;
  category: string;
  placeholder: string;
  span: string;
}

const galleryItems: GalleryItem[] = [
  {
    title: "[Grand Royal Reception Setup]",
    category: "[Weddings]",
    placeholder: "[Luxury Wedding Banquet Dining & Royal Floral Decor Setup Photography]",
    span: "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto",
  },
  {
    title: "[Live Chef Culinary Theatre]",
    category: "[Live Counters]",
    placeholder: "[Master Chefs Preparing Artisan Breads at Live Tandoor Photography]",
    span: "aspect-square",
  },
  {
    title: "[Artisan Welcome Bar & Mocktails]",
    category: "[Beverages]",
    placeholder: "[Exotic Welcome Drinks and Infused Refreshment Station Photography]",
    span: "aspect-square",
  },
  {
    title: "[Royal Buffet Architecture]",
    category: "[Buffet Architecture]",
    placeholder: "[Illuminated Multi-Tier Royal Buffet Line & Carvings Photography]",
    span: "aspect-[4/3]",
  },
  {
    title: "[Traditional Mithai & Desserts]",
    category: "[Sweets]",
    placeholder: "[Handcrafted Indian Sweets and Saffron Dessert Bar Photography]",
    span: "aspect-[4/3]",
  },
];

export function GallerySection() {
  return (
    <Section id="gallery" className="bg-ivory-300/40">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            [Real Event Moments]
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            [A Glimpse Into Celebrations We Have Catered]
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground">
            [Authentic, unfiltered glimpses from real weddings and celebrations across India. No stock photography.]
          </p>
        </div>

        {/* Gallery Filter Categories */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {["[All Moments]", "[Grand Weddings]", "[Live Counters]", "[Buffet Architecture]"].map(
            (category, idx) => (
              <span
                key={idx}
                className="cursor-pointer rounded-btn border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition hover:border-gold-300 md:text-sm"
              >
                {category}
              </span>
            )
          )}
        </div>

        {/* Editorial Photo Grid Skeleton */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {galleryItems.map((item, idx) => (
            <figure
              key={idx}
              className={`relative overflow-hidden rounded-card border border-border bg-muted ${item.span}`}
            >
              <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center p-6 text-center">
                <Camera className="h-6 w-6 text-gold-600/70" aria-hidden="true" />
                <p className="mt-3 font-heading text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.placeholder}
                </p>
                <span className="mt-3 inline-block rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-gold-600">
                  {item.category}
                </span>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
