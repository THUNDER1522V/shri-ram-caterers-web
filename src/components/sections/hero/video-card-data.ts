/**
 * Hero Video Card Stack — Data File
 * ─────────────────────────────────────────────────────────────────────────────
 * Each entry drives one card in the overlapping stack.
 *
 * HOW TO SWAP IN REAL VIDEOS
 * 1. Upload your MP4 and WebM clips to /public/videos/  (or a CDN).
 * 2. Replace the `mp4` and `webm` strings below with the correct paths/URLs.
 * 3. For the poster, drop a JPG/WEBP into /public/images/ and update `poster`.
 * 4. Edit `title`, `guests`, and `location` freely — no code changes needed.
 *
 * Aspect ratio: 9:16 vertical (400 × 700 px on desktop).
 */

export interface VideoCard {
  /** Unique id used as React key */
  id: string;
  /** Event scene title shown on the card overlay */
  title: string;
  /** Guest count string, e.g. "1,200 Guests" */
  guests: string;
  /** City / venue line */
  location: string;
  /** Poster image (shown first, while video loads) */
  poster: string;
  /** MP4 source — primary format */
  mp4: string;
  /** WebM source — fallback / modern codec */
  webm: string;
  /** Accessible label for the card */
  ariaLabel: string;
}

export const VIDEO_CARDS: VideoCard[] = [
  {
    id: "bride-entry",
    title: "Bride Entry",
    guests: "1,200 Guests",
    location: "Leela Palace, New Delhi",
    poster: "/images/hero-reel-poster.webp",
    mp4: "/videos/hero_video.mp4",
    webm: "",
    ariaLabel: "Bride Entry ceremony reel",
  },
  {
    id: "live-cooking",
    title: "Live Cooking Theatres",
    guests: "800 Guests",
    location: "Taj Hotel, Agra",
    poster: "/posters/live-cooking.svg",
    mp4: "/videos/hero_video.mp4",
    webm: "",
    ariaLabel: "Live cooking theatre reel",
  },
  {
    id: "grand-buffet",
    title: "Grand Royal Buffet",
    guests: "2,000 Guests",
    location: "Jaypee Greens, Noida",
    poster: "/posters/grand-buffet.svg",
    mp4: "/videos/hero_video.mp4",
    webm: "",
    ariaLabel: "Grand Royal Buffet reel",
  },
  {
    id: "dessert-counter",
    title: "Dessert Counter",
    guests: "600 Guests",
    location: "Farm House, Chattarpur",
    poster: "/posters/dessert-counter.svg",
    mp4: "/videos/hero_video.mp4",
    webm: "",
    ariaLabel: "Dessert counter reel",
  },
  {
    id: "guests-enjoying",
    title: "Guests & Celebrations",
    guests: "1,500 Guests",
    location: "ITC Maurya, New Delhi",
    poster: "/posters/guests-enjoying.svg",
    mp4: "/videos/hero_video.mp4",
    webm: "",
    ariaLabel: "Guests celebrating reel",
  },
  {
    id: "final-venue",
    title: "Venue Transformation",
    guests: "3,000 Guests",
    location: "Dera Mewat, Gurgaon",
    poster: "/posters/final-venue.svg",
    mp4: "",
    webm: "",
    ariaLabel: "Final venue transformation reel",
  },
];
