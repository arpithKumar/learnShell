"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue", id: "tour-nav-catalogue" },
  { href: "/concepts", label: "Concepts" },
  { href: "/shortcuts", label: "Shortcuts", id: "tour-nav-shortcuts" },
  { href: "/playground", label: "Playground" },
  { href: "/learn", label: "Learn" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
      {NAV_LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            id={link.id}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative py-1 transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
            {isActive && (
              <span className="bg-primary absolute -bottom-[1px] left-0 right-0 h-0.5 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
