export type ReviewType = "google" | "video" | "image";

export interface BaseReview {
  id: string;
  author: string;
  rating: number;
  date?: string;
  role?: string;
  event?: string;
  location?: string;
  quote?: string;
  type: ReviewType;
  verified?: boolean;
  avatar?: string;
  // Video testimonial replacement fields
  videoUrl?: string;
  mp4?: string;
  webm?: string;
  poster?: string;
  viewCount?: string;
  // Image review replacement fields
  imageSrc?: string;
  caption?: string;
}

export interface VideoReviewItem extends BaseReview {
  type: "video";
  poster: string;
  mp4: string;
}

export interface GoogleReviewItem extends BaseReview {
  type: "google";
  verified: boolean;
}

export interface ImageReviewItem extends BaseReview {
  type: "image";
  imageSrc: string;
}

export type ReviewItem = BaseReview;
export type UnifiedReviewItem = BaseReview;

export interface GoogleReviewSummary {
  rating: number;
  maxRating: number;
  reviewCountText: string;
  googleBusinessUrl: string;
}

export interface ReviewsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  googleSummary: GoogleReviewSummary;
  videoReviews: VideoReviewItem[];
  googleReviews: GoogleReviewItem[];
  imageReviews?: ImageReviewItem[];
}
