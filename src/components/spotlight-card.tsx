"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Shared cursor-tracking spotlight + subtle 3D tilt, extracted from the
// (previously duplicated 3x) CommandCard/TrackCard/AIToolRecommendationCard
// implementations. Renders a plain container, not a Link — wrap it yourself
// if the whole card should navigate; several call sites (this one included)
// have interactive children (badges, links) that a card-wide Link would
// conflict with.
export function SpotlightCard({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  // When provided, the card fades/slides in on mount with a delay staggered
  // by this position — the same entrance pattern CatalogueGrid/LearningPath
  // use for their card grids. Omit for cards that shouldn't animate in
  // (e.g. already-mounted content revealed by user interaction).
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Off-canvas default — at (0, 0) the spotlight's radial gradient sits
  // anchored in the corner before any hover, showing as a static blotch on
  // every card. Parking it far outside the card's bounds keeps it invisible
  // until the cursor actually moves over the card.
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });

  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 18%, transparent), transparent 80%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    rotateY.set(((x - rect.width / 2) / rect.width) * 6);
    rotateX.set(-((y - rect.height / 2) / rect.height) * 6);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    // Without this, the spotlight gradient stays frozen wherever the cursor
    // last was inside this card, instead of disappearing when the cursor
    // moves to a different card.
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  return (
    <motion.div
      ref={ref}
      initial={index !== undefined ? { opacity: 0, y: 12 } : undefined}
      whileInView={index !== undefined ? { opacity: 1, y: 0 } : undefined}
      viewport={index !== undefined ? { once: true } : undefined}
      transition={
        index !== undefined ? { duration: 0.3, delay: index * 0.05 } : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn(
        "bg-card relative overflow-hidden rounded-xl border transition-colors hover:border-primary/40",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
