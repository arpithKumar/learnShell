"use client";

import { useEffect, useRef, useState } from "react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
};

let nextSparkleId = 0;
const SPAWN_INTERVAL_MS = 25;
const LIFESPAN_MS = 850;
const MAX_ON_SCREEN = 40;
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, summary, [data-slot="button"]';

export function CursorTrail() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const lastSpawnRef = useRef(0);
  const disabledRef = useRef(false);

  useEffect(() => {
    // iOS Safari only reliably triggers :active (tap press-states) if a
    // touchstart listener exists somewhere in the document — without one,
    // taps can show zero visual feedback sitewide, not just no :hover
    // (which is expected on touch). Unrelated to the sparkle trail itself,
    // but this is the one component guaranteed to mount on every page.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    function syncDisabled() {
      disabledRef.current = reducedMotion.matches || !finePointer.matches;
    }
    syncDisabled();
    reducedMotion.addEventListener("change", syncDisabled);
    finePointer.addEventListener("change", syncDisabled);

    function handleMouseMove(e: MouseEvent) {
      if (disabledRef.current) return;

      // Don't trail over anything clickable — sparkles spawning right where
      // someone's about to click reads as noisy/distracting, not delightful.
      const target = e.target;
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
        return;
      }

      const now = performance.now();
      if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS) return;
      lastSpawnRef.current = now;

      const id = nextSparkleId++;
      const sparkle: Sparkle = {
        id,
        x: e.clientX,
        y: e.clientY,
        size: 8 + Math.random() * 8,
        rotate: Math.random() * 60 - 30,
      };

      setSparkles((prev) => [...prev.slice(-(MAX_ON_SCREEN - 1)), sparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, LIFESPAN_MS);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      reducedMotion.removeEventListener("change", syncDisabled);
      finePointer.removeEventListener("change", syncDisabled);
      document.removeEventListener("touchstart", noop);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      aria-hidden="true"
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="cursor-sparkle"
          style={
            {
              left: s.x,
              top: s.y,
              "--sparkle-size": `${s.size}px`,
              "--sparkle-rotate": `${s.rotate}deg`,
            } as React.CSSProperties
          }
        >
          ✦
        </span>
      ))}
    </div>
  );
}
