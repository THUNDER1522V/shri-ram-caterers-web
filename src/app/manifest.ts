import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Shri Ram",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#C5A880",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
