export interface GalleryMediaItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  tag: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  aspectRatio?: "9/16" | "16/9" | "4/3" | "1/1";
}

export interface GalleryContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  categories: string[];
  items: GalleryMediaItem[];
}
