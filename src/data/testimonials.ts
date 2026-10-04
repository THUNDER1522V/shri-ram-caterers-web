export interface VideoTestimonial {
  id: string;
  name: string;
  eventType: string;
  location: string; // or guest count
  poster: string;
  mp4: string;
  webm?: string;
  viewCount?: string;
  quote?: string;
}

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: "v1",
    name: "Rajesh Sharma",
    eventType: "Wedding Reception",
    location: "Gwalior",
    poster: "/images/testimonials/poster-1.jpg",
    mp4: "/videos/testimonials/vid-1.mp4",
    viewCount: "12K",
    quote: "The royal thali was the highlight of our reception."
  },
  {
    id: "v2",
    name: "Sneha & Varun",
    eventType: "Sangeet Night",
    location: "Agra",
    poster: "/images/testimonials/poster-2.jpg",
    mp4: "/videos/testimonials/vid-2.mp4",
    viewCount: "8.4K",
    quote: "Flawless management, beautiful presentation!"
  },
  {
    id: "v3",
    name: "The Gupta Family",
    eventType: "Grand Wedding",
    location: "Delhi",
    poster: "/images/testimonials/poster-3.jpg",
    mp4: "/videos/testimonials/vid-3.mp4",
    viewCount: "24K",
    quote: "Pure vegetarian perfection. Exceeded expectations."
  },
  {
    id: "v4",
    name: "Priya Malhotra",
    eventType: "Anniversary Banquet",
    location: "Mathura",
    poster: "/images/testimonials/poster-4.jpg",
    mp4: "/videos/testimonials/vid-4.mp4",
    viewCount: "5K",
    quote: "Authentic North Indian flavors that our guests loved."
  },
  {
    id: "v5",
    name: "Amitabh Verma",
    eventType: "Corporate Gala",
    location: "Noida",
    poster: "/images/testimonials/poster-5.jpg",
    mp4: "/videos/testimonials/vid-5.mp4",
    quote: "Professional staff, exquisite chaat counter."
  },
  {
    id: "v6",
    name: "Neha Singh",
    eventType: "Destination Wedding",
    location: "Jaipur",
    poster: "/images/testimonials/poster-6.jpg",
    mp4: "/videos/testimonials/vid-6.mp4",
    viewCount: "31K",
    quote: "They brought our royal dining vision to life."
  }
];
