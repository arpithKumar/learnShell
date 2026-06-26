import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "ui-monospace, monospace",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#f87171",
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fbbf24",
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#4ade80",
            }}
          />
        </div>
        <span style={{ fontSize: 28, color: "#a1a1a1" }}>shell</span>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 88,
          fontWeight: 700,
          marginTop: 56,
        }}
      >
        learn<span style={{ color: "#4ade80" }}>shell</span>
      </div>

      <div
        style={{
          fontSize: 34,
          color: "#a1a1a1",
          marginTop: 28,
          maxWidth: 980,
        }}
      >
        {SITE_DESCRIPTION}
      </div>
    </div>,
    { ...size },
  );
}
