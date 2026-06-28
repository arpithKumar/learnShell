"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function SupportedCommandTile({
  name,
  description,
  hasEntry,
}: {
  name: string;
  description: string;
  hasEntry: boolean;
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

  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 18%, transparent), transparent 80%)`;

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

  const tile = (
    <motion.div
      ref={ref}
      onMouseMove={hasEntry ? handleMouseMove : undefined}
      onMouseLeave={hasEntry ? handleMouseLeave : undefined}
      style={
        hasEntry ? { rotateX, rotateY, transformPerspective: 800 } : undefined
      }
      className={cn(
        "bg-card relative overflow-hidden rounded-lg border p-3.5 transition-colors",
        hasEntry &&
          "group-hover:border-primary/40 group-focus-visible:border-primary/40",
      )}
    >
      {hasEntry && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight }}
        />
      )}
      <span
        className={cn(
          "relative block font-mono text-sm font-medium",
          hasEntry &&
            "group-hover:text-primary group-focus-visible:text-primary",
        )}
      >
        {name}
      </span>
      {description && (
        <p className="text-muted-foreground relative mt-1 text-xs">
          {description}
        </p>
      )}
    </motion.div>
  );

  if (!hasEntry) return tile;

  return (
    <Link
      href={`/command/${name}`}
      className="group block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {tile}
    </Link>
  );
}
