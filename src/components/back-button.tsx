"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-muted-foreground mb-6 inline-flex items-center gap-1.5 text-sm hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      Back
    </button>
  );
}
