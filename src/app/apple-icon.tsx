import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: "#0B0B0B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4A84B",
          fontWeight: 800,
          border: "6px solid #D4A84B",
          borderRadius: "36px",
          fontFamily: "serif",
          letterSpacing: "-1px",
        }}
      >
        SRC
      </div>
    ),
    {
      ...size,
    }
  );
}
