"use client";

import { useEffect } from "react";
import { startCommandPageTour } from "@/lib/tour";

const STORAGE_KEY = "learnshell-tour-command-seen";

export function CommandPageTour() {
  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => startCommandPageTour(), 600);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
