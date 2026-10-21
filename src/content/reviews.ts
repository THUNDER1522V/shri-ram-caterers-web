import type { ReviewsContent, UnifiedReviewItem } from "@/types/reviews";

/**
 * Reviews & Testimonials Content
 * Designed so later video testimonials can replace review cards without changing layout.
 * Every card follows a unified polymorphic schema:
 * id, author, role, event, location, date, rating, quote, verified, type, videoUrl/mp4, poster, imageSrc, viewCount.
 */
export const reviewsContent: ReviewsContent = {
  eyebrow: "Customer Stories",
  title: "Words From Families We Have Served",
  subtitle:
    "Real experiences shared by parents and celebration hosts who trusted us with their most cherished milestones.",

  googleSummary: {
    rating: 4.8,
    maxRating: 5,
    reviewCountText: "200+ Host Reviews",
    googleBusinessUrl: "https://maps.google.com/?cid=shriramcaterers",
  },

  // Verified Google Reviews
  googleReviews: [
    {
      id: "g1",
      author: "Aditya Sharma",
      role: "Local Guide • 13 reviews",
      event: "Grand Wedding Reception (1,200 Guests)",
      location: "New Delhi",
      date: "10 months ago",
      rating: 5,
      verified: true,
      type: "google",
      quote:
        "We had an absolutely wonderful experience with Shree Ram Caterers. The service provided was truly amazing and exceeded all our expectations. Every dish served was incredibly tasty and prepared with evident care and quality ingredients. The professionalism with which they managed the entire event was commendable. Our guests were thoroughly impressed with the delicious food and the seamless execution.",
      poster: "/images/hero-reel-poster.webp",
      videoUrl: "/videos/grand-wedding.mp4",
      mp4: "/videos/grand-wedding.mp4",
      viewCount: "14.2K",
    },
    {
      id: "g2",
      author: "Tanvi Agarwal",
      role: "Local Guide • 7 reviews",
      event: "Sangeet & Cocktail Night (800 Guests)",
      location: "Agra",
      date: "a year ago",
      rating: 5,
      verified: true,
      type: "google",
      quote:
        "Shri Ram Caterers provided outstanding catering for our family event! The food was delicious, beautifully presented, and served on time. The team was professional, attentive, and made sure everything went smoothly. Guests especially loved the live chaat counter and South Indian live station. I highly recommend their services for any royal celebration!",
      poster: "/images/grand-wedding-reception.png",
      videoUrl: "/videos/livecounter.mp4",
      mp4: "/videos/livecounter.mp4",
      viewCount: "9.8K",
    },
    {
      id: "g3",
      author: "Kailash Lal Sah",
      role: "Host Family • 5 reviews",
      event: "Golden Wedding Anniversary Banquet",
      location: "Gwalior",
      date: "2 years ago",
      rating: 5,
      verified: true,
      type: "google",
      quote:
        "Absolutely stellar experience with this catering service! From start to finish, their attention to detail and commitment to quality shone through. The food was not just delicious, but exquisitely presented, pleasing both the palate and the eye. Every dish was a testament to their culinary expertise and dedication to royal vegetarian excellence.",
      poster: "/images/hero-reel-poster.webp",
      videoUrl: "/videos/v1.mp4",
      mp4: "/videos/v1.mp4",
      viewCount: "18.5K",
    },
    {
      id: "g4",
      author: "Deepak & Meenakshi Singhal",
      role: "Parents of the Bride",
      event: "Palace Destination Wedding (1,500 Guests)",
      location: "Jaipur",
      date: "6 months ago",
      rating: 5,
      verified: true,
      type: "google",
      quote:
        "Managing food for 1,500 guests across 3 days at a palace venue seemed daunting until Shri Ram Caterers took over. Their mobile kitchens were spotless, the captains were courteous to every elder, and the Awadhi biryani is still talked about in our family circles. Truly royal hospitality.",
      poster: "/images/grand-wedding-reception.png",
      videoUrl: "/videos/themes-and-counters.mp4",
      mp4: "/videos/themes-and-counters.mp4",
      viewCount: "22K",
    },
    {
      id: "g5",
      author: "Vikram Malhotra",
      role: "Local Guide • 24 reviews",
      event: "Executive Corporate Gala (600 Dignitaries)",
      location: "Noida",
      date: "8 months ago",
      rating: 5,
      verified: true,
      type: "google",
      quote:
        "Punctual, discreet, and extraordinarily flavorful. The presentation of the live food theatres elevated our corporate gala to an international standard. Pure vegetarian catering at its finest.",
      poster: "/images/hero-reel-poster.webp",
      videoUrl: "/videos/divyansh-naina.mp4",
      mp4: "/videos/divyansh-naina.mp4",
      viewCount: "11.1K",
    },
  ],

  // Video Testimonials for the Luxury Video Coverflow
  videoReviews: [
    {
      id: "v1",
      author: "Rajesh Sharma",
      event: "Wedding Reception",
      location: "Gwalior",
      poster: "/images/hero-reel-poster.webp",
      mp4: "/videos/grand-wedding.mp4",
      viewCount: "12K",
      quote: "The royal thali was the highlight of our reception. Guests loved every dish.",
      rating: 5,
      type: "video",
      verified: true,
      role: "Father of the Groom",
      date: "March 2025",
    },
    {
      id: "v2",
      author: "Sneha & Varun",
      event: "Sangeet Night",
      location: "Agra",
      poster: "/images/grand-wedding-reception.png",
      mp4: "/videos/v1.mp4",
      viewCount: "8.4K",
      quote: "Flawless management, beautiful presentation, and high energy live stations!",
      rating: 5,
      type: "video",
      verified: true,
      role: "Newlyweds",
      date: "January 2025",
    },
    {
      id: "v3",
      author: "The Gupta Family",
      event: "Grand Wedding",
      location: "Delhi NCR",
      poster: "/images/hero-reel-poster.webp",
      mp4: "/videos/divyansh-naina.mp4",
      viewCount: "24K",
      quote: "Pure vegetarian perfection. Exceeded every expectation our elders had.",
      rating: 5,
      type: "video",
      verified: true,
      role: "Host Family",
      date: "December 2024",
    },
    {
      id: "v4",
      author: "Priya Malhotra",
      event: "Anniversary Banquet",
      location: "Mathura",
      poster: "/images/grand-wedding-reception.png",
      mp4: "/videos/bhelpuri.mp4",
      viewCount: "5K",
      quote: "Authentic North Indian heritage flavors that transported us back to royal kitchens.",
      rating: 5,
      type: "video",
      verified: true,
      role: "Host",
      date: "November 2024",
    },
    {
      id: "v5",
      author: "Amitabh Verma",
      event: "Corporate Gala",
      location: "Noida",
      poster: "/images/hero-reel-poster.webp",
      mp4: "/videos/buffet-architecture.mp4",
      viewCount: "16K",
      quote: "Professional floor captains, exquisite live counter architecture, and zero delays.",
      rating: 5,
      type: "video",
      verified: true,
      role: "Event Director",
      date: "October 2024",
    },
    {
      id: "v6",
      author: "Neha & Siddharth Singh",
      event: "Destination Wedding",
      location: "Jaipur",
      poster: "/images/grand-wedding-reception.png",
      mp4: "/videos/themes-and-counters.mp4",
      viewCount: "31K",
      quote: "They brought our royal dining vision to life at the palace without a single hiccup.",
      rating: 5,
      type: "video",
      verified: true,
      role: "Bride & Groom",
      date: "September 2024",
    },
  ],

  // Client Moments
  imageReviews: [
    {
      id: "img1",
      author: "Sunil & Radhika Singhania",
      role: "Host Family",
      event: "Grand Wedding Thali Feast",
      location: "Gurugram",
      rating: 5,
      type: "image",
      imageSrc: "/images/hero-reel-poster.webp",
      caption: "Over 2,200 guests savored the royal thali banquet without a single hitch.",
      quote: "The warmth with which the captains served our elders was extraordinary.",
      verified: true,
      date: "February 2025",
    },
    {
      id: "img2",
      author: "Rameshwar Dayal & Sons",
      role: "Distinguished Family Host",
      event: "Silver Jubilee Celebration",
      location: "New Delhi",
      rating: 5,
      type: "image",
      imageSrc: "/images/grand-wedding-reception.png",
      caption: "Handwritten note of gratitude presented by the host elders to our head chef.",
      quote: "The purity of the ghee and the cleanliness of the kitchen left everyone spellbound.",
      verified: true,
      date: "January 2025",
    },
  ],
};

/**
 * Unified Reviews List
 * All cards share identical layout dimensions and structure so video testimonials can replace review cards without changing layout.
 */
export const unifiedReviewsList: UnifiedReviewItem[] = [
  ...reviewsContent.googleReviews,
  ...reviewsContent.videoReviews,
];

export default reviewsContent;
