import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackScrollDepth } from "@/lib/analytics";

/**
 * Fires `scroll_depth` GA4 events at 25 / 50 / 75 / 100 % of page height,
 * once per route visit. Resets when the location changes.
 */
export function useScrollDepth() {
  const location = useLocation();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();
    const thresholds: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100];

    const handler = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const viewport = window.innerHeight || doc.clientHeight;
      const fullHeight = doc.scrollHeight;
      const scrollable = Math.max(fullHeight - viewport, 1);
      const pct = Math.min(100, Math.round((scrollTop / scrollable) * 100));
      const path = location.pathname + location.search + location.hash;
      for (const t of thresholds) {
        if (pct >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          trackScrollDepth(t, path);
        }
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    // Fire once in case the page is already short enough to be "fully scrolled".
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [location.pathname, location.search, location.hash]);
}
