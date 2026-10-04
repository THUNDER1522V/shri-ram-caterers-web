import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/siteConfig";

export const alt = `${siteConfig.name} - Royal Indian Wedding Catering`;
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
          background: "#0B0B0B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          border: "12px solid #7A1118",
          position: "relative",
        }}
      >
        {/* Inner gold border */}
        <div
          style={{
            position: "absolute",
            inset: 20,
            border: "1.5px solid rgba(212, 168, 75, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#D4A84B",
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            Royal Indian Wedding Catering · {siteConfig.city}
          </div>

          {/* Headline */}
          <div
            style={{
              display: "flex",
              fontSize: 64,
              color: "#E8D6A8",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 20,
              textAlign: "center",
              fontFamily: "serif",
            }}
          >
            {siteConfig.name}
          </div>

          {/* Subline */}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#F5EFE0",
              opacity: 0.85,
              maxWidth: 820,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            {siteConfig.description}
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 28,
              marginTop: 32,
              color: "#D4A84B",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            <span>500+ Celebrations</span>
            <span>·</span>
            <span>100% Pure Vegetarian</span>
            <span>·</span>
            <span>Master Chef Curations</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
