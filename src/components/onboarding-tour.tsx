"use client";

import { useEffect } from "react";
import { startTour } from "@/lib/tour";

const STORAGE_KEY = "learnshell-tour-seen";

export function OnboardingTour() {
  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => startTour(), 600);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
