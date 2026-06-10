"use client";

import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";

const DEPTHS = [25, 50, 75, 100] as const;

export function useScrollDepth(pageName: string) {
  const ph = usePostHog();
  const firedRef = useRef(new Set<number>());

  useEffect(() => {
    firedRef.current = new Set();

    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.round((window.scrollY / docHeight) * 100);

      for (const d of DEPTHS) {
        if (pct >= d && !firedRef.current.has(d)) {
          firedRef.current.add(d);
          ph.capture("scroll_depth_reached", {
            page: pageName,
            depth_percent: d,
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pageName, ph]);
}
