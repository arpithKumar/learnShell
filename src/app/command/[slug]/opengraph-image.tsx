import { ImageResponse } from "next/og";
import { getAllCommandSlugs, getCommandBySlug } from "@/lib/content/loader";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllCommandSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const command = getCommandBySlug(slug);
  const name = command?.name ?? slug;
  const summary = command?.summary ?? "";

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
          alignItems: "baseline",
          gap: 20,
          marginTop: 56,
        }}
      >
        <span style={{ fontSize: 56, color: "#4ade80" }}>$</span>
        <span style={{ fontSize: 80, fontWeight: 700 }}>{name}</span>
      </div>

      <div
        style={{
          fontSize: 32,
          color: "#a1a1a1",
          marginTop: 28,
          maxWidth: 980,
        }}
      >
        {summary}
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 56,
          right: 80,
          fontSize: 28,
          color: "#a1a1a1",
        }}
      >
        learn<span style={{ color: "#4ade80" }}>shell</span>
      </div>
    </div>,
    { ...size },
  );
}
