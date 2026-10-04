import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "#0B0B0B",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4A84B",
          fontWeight: 800,
          borderRadius: "50%",
          border: "1.5px solid #D4A84B",
          fontFamily: "serif",
          letterSpacing: "-0.5px",
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
