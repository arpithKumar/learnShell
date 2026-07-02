"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackButton() {
  const router = useRouter();
  // Drives a floating counterpart once the inline button below has
  // scrolled out of view, so there's always a way back without hunting
  // for the browser's own back button.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 300);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function goBack() {
    router.back();
  }

  return (
    <>
      <button
        type="button"
        onClick={goBack}
        className="text-muted-foreground mb-6 inline-flex items-center gap-1.5 text-sm hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back
      </button>

      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        tabIndex={scrolled ? 0 : -1}
        className={cn(
          "bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 fixed bottom-6 left-6 z-40 flex size-11 items-center justify-center rounded-full border shadow-lg transition-all duration-200",
          scrolled
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
      </button>
    </>
  );
}
