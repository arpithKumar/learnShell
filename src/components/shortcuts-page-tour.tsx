"use client";

import { useEffect } from "react";
import { startShortcutsPageTour } from "@/lib/tour";

const STORAGE_KEY = "learnshell-tour-shortcuts-seen";

export function ShortcutsPageTour() {
  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => startShortcutsPageTour(), 600);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
