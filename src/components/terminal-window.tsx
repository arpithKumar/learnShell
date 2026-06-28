"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

export function TerminalWindow() {
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
      className="w-full max-w-md overflow-hidden rounded-xl border bg-card shadow-2xl shadow-primary/10"
    >
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-yellow-400/70" />
        <span className="size-2.5 rounded-full bg-green-400/70" />
        <span className="text-muted-foreground ml-2 text-xs">
          learnshell — zsh
        </span>
      </div>
      <div className="space-y-3 px-5 py-5 font-mono text-sm leading-relaxed">
        <p>
          <span className="text-primary">$</span> grep -rn{" "}
          <span className="text-amber-500">&quot;TODO&quot;</span> ./src
        </p>
        <p className="text-muted-foreground">
          src/index.ts:42:<span className="text-foreground">{"// TODO"}</span>{" "}
          handle edge case
        </p>
        <p>
          <span className="text-primary">$</span> learnshell grep --flags
        </p>
        <div className="space-y-1 rounded-md bg-muted/50 px-3 py-2">
          <p>
            <span className="text-primary">-r</span>{" "}
            <span className="text-muted-foreground">
              recursive directory search
            </span>
          </p>
          <p>
            <span className="text-primary">-n</span>{" "}
            <span className="text-muted-foreground">
              print matching line numbers
            </span>
          </p>
          <p>
            <span className="text-primary">-i</span>{" "}
            <span className="text-muted-foreground">case-insensitive</span>
          </p>
        </div>
        <p className="flex items-center gap-1">
          <span className="text-primary">$</span>
          <span className="bg-foreground/80 inline-block h-4 w-1.5 animate-pulse" />
        </p>
      </div>
    </motion.div>
  );
}
