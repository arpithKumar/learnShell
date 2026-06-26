import Link from "next/link";
import { Terminal } from "lucide-react";
import { TourReplayButton } from "@/components/tour-replay-button";

const FOOTER_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/shortcuts", label: "Shortcuts" },
  { href: "/playground", label: "Playground" },
  { href: "/learn", label: "Learn" },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Terminal className="size-4" aria-hidden="true" />
          <span>
            learn<span className="text-muted-foreground">shell</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <TourReplayButton />
        </nav>
      </div>
    </footer>
  );
}
