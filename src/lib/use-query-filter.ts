"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * A useState-like filter backed by a URL query param instead of component
 * state, so the current filter survives navigating away and back (browser
 * history keeps the query string, a fresh useState wouldn't).
 */
export function useQueryFilter(
  key: string,
  fallback: string | null = null,
): [string | null, (value: string | null) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(key) ?? fallback;

  function setValue(next: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set(key, next);
    else params.delete(key);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return [value, setValue];
}
