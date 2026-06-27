"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Keyboard,
  Lightbulb,
  Menu,
  Terminal,
  TerminalSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  {
    href: "/catalogue",
    label: "Catalogue",
    description: "Every command, searchable",
    icon: Compass,
  },
  {
    href: "/concepts",
    label: "Concepts",
    description: "Shell scripting ideas explained",
    icon: Lightbulb,
  },
  {
    href: "/shortcuts",
    label: "Shortcuts",
    description: "Readline, vi mode, tmux",
    icon: Keyboard,
  },
  {
    href: "/playground",
    label: "Playground",
    description: "A simulated shell, in your browser",
    icon: TerminalSquare,
  },
  {
    href: "/learn",
    label: "Learn",
    description: "Guided tracks through the catalogue",
    icon: GraduationCap,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-0 p-0">
        <SheetHeader className="border-b py-4">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <Terminal className="brand-glow-icon size-5" aria-hidden="true" />
            <span className="brand-glow-text">
              learn<span className="brand-glow-text-dim">shell</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <SheetClose
                key={link.href}
                nativeButton={false}
                render={
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-colors active:scale-[0.98] active:bg-accent",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground active:text-foreground",
                    )}
                  />
                }
              >
                {isActive && (
                  <span
                    className="bg-primary absolute inset-y-2 left-0 w-0.5 rounded-full"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    isActive ? "bg-primary/15" : "bg-muted",
                  )}
                >
                  <Icon
                    className={cn("size-4", isActive && "text-primary")}
                    aria-hidden="true"
                  />
                </span>
                <span className="flex-1">
                  <span className="block text-base font-medium leading-none">
                    {link.label}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-xs">
                    {link.description}
                  </span>
                </span>
                <ArrowRight
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5"
                  aria-hidden="true"
                />
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
