import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF8F5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          border: "12px solid #E5DFD7",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#9C7A44",
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            Royal Indian Celebrations
          </div>
          <div
            style={{
              fontSize: 62,
              color: "#18181B",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#71717A",
              maxWidth: 750,
              lineHeight: 1.5,
            }}
          >
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
