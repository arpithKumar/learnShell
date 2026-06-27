import Link from "next/link";
import { Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette";
import { LibraryPopover } from "@/components/library-popover";
import { SiteNav } from "@/components/site-nav";
import { MobileNav } from "@/components/mobile-nav";
import type { SearchableEntry } from "@/lib/content/search-index";

export function SiteHeader({ entries }: { entries: SearchableEntry[] }) {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Terminal className="brand-glow-icon size-5" aria-hidden="true" />
            <span className="brand-glow-text">
              learn<span className="brand-glow-text-dim">shell</span>
            </span>
          </Link>
        </div>

        <SiteNav />

        <div className="flex items-center gap-2">
          <CommandPalette entries={entries} />
          <LibraryPopover entries={entries} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
