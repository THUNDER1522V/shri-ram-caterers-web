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
}

export interface VideoReviewItem extends BaseReview {
  type: "video";
  poster: string;
  mp4: string;
  webm?: string;
  viewCount?: string;
}

export interface GoogleReviewItem extends BaseReview {
  type: "google";
  verified: boolean;
}

export interface ImageReviewItem extends BaseReview {
  type: "image";
  imageSrc: string;
  caption?: string;
}

export type ReviewItem = VideoReviewItem | GoogleReviewItem | ImageReviewItem;

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
