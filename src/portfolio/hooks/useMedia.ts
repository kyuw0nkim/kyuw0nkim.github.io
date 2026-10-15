import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Split layout with the scene on the left (matches the CSS breakpoint). */
export const useIsWide = () => useMediaQuery("(min-width: 960px)");

/** Precise pointer that can hover — enables hover-only enhancements like list previews. */
export const useCanHover = () => useMediaQuery("(hover: hover) and (pointer: fine)");
