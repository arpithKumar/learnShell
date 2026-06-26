"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            borderRadius: "0.5rem",
            border: "1px solid #2a2a2a",
            overflow: "hidden",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderBottom: "1px solid #2a2a2a",
              background: "#161616",
              padding: "0.5rem 0.75rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f87171b3",
              }}
            />
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#fbbf24b3",
              }}
            />
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ade80b3",
              }}
            />
            <span
              style={{
                marginLeft: "0.25rem",
                fontSize: "0.75rem",
                color: "#a1a1a1",
              }}
            >
              shell
            </span>
          </div>
          <div
            style={{
              padding: "0.75rem 1rem",
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.875rem",
              background: "#111111",
            }}
          >
            <p style={{ margin: 0 }}>
              <span style={{ color: "#4ade80" }}>$</span> ./learnshell
            </p>
            <p style={{ margin: "0.5rem 0 0", color: "#fb7185" }}>
              kernel panic — not syncing
            </p>
          </div>
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          The app crashed
        </h1>
        <p style={{ color: "#a1a1a1", maxWidth: "28rem", margin: 0 }}>
          Something went wrong at the very top level. Reloading usually fixes
          it.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "0.5rem",
            borderRadius: "9999px",
            background: "#4ade80",
            color: "#0a0a0a",
            border: "none",
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
