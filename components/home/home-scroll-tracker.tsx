"use client";

import { useScrollDepth } from "@/lib/hooks/use-scroll-depth";

export function HomeScrollTracker() {
  useScrollDepth("home");
  return null;
}
