"use client";

import Masonry from "react-masonry-css";
import { CommandCard } from "@/components/command-card";
import { isFeatured } from "@/lib/bento";
import type { CommandEntry } from "@/lib/content/schema";

const MASONRY_BREAKPOINTS = { default: 3, 1024: 2, 0: 1 };

export function FeaturedCommands({ commands }: { commands: CommandEntry[] }) {
  return (
    <Masonry
      breakpointCols={MASONRY_BREAKPOINTS}
      className="-ml-4 flex w-auto"
      columnClassName="pl-4"
    >
      {commands.map((cmd, i) => (
        <div key={cmd.slug} className="mb-4">
          <CommandCard command={cmd} featured={isFeatured(i)} />
        </div>
      ))}
    </Masonry>
  );
}
