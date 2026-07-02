"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

// Same terminal-chrome visual language as the homepage's TerminalWindow
// (traffic-light dots, mouse-tracked 3D tilt) but its own content — that
// component is hardcoded to the homepage's grep example, not parameterized,
// so this is a sibling rather than a shared instance (same precedent as the
// site reusing "terminal chrome" as a look across not-found/error/OG images
// rather than one literal shared component).
export function AIToolsHeroMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rotateY.set(((x - rect.width / 2) / rect.width) * 10);
    rotateX.set(-((y - rect.height / 2) / rect.height) * 10);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="bg-card shadow-primary/10 w-full max-w-md overflow-hidden rounded-xl border shadow-2xl"
    >
      <div className="bg-muted/40 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-yellow-400/70" />
        <span className="size-2.5 rounded-full bg-green-400/70" />
        <span className="text-muted-foreground ml-2 text-xs">CLAUDE.md</span>
      </div>
      <div className="space-y-2.5 px-5 py-5 font-mono text-xs leading-relaxed">
        <p className="text-muted-foreground"># Coding conventions</p>
        <p>
          <span className="text-primary">-</span> Use TypeScript strict mode
        </p>
        <p>
          <span className="text-primary">-</span> Run{" "}
          <span className="text-amber-500">npm test</span> before committing
        </p>
        <p className="text-muted-foreground mt-3"># Architecture</p>
        <p>
          <span className="text-primary">-</span> API routes live in{" "}
          <span className="text-amber-500">src/api/**</span>
        </p>
        <div className="bg-muted/50 mt-2 space-y-1 rounded-md px-3 py-2">
          <p className="flex items-center gap-1">
            <span className="text-primary">$</span> claude
            <span className="bg-foreground/80 inline-block h-3.5 w-1.5 animate-pulse" />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
