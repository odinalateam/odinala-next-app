"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage+cookie",
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();
  const { data: session } = useSession();
  const prevUserIdRef = useRef<string | null>(null);

  // Fire manual pageview on every route change, skip admin dashboard
  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;
    const url =
      pathname +
      (searchParams.toString() ? `?${searchParams.toString()}` : "");
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  // Identify user when session arrives, reset on sign-out
  useEffect(() => {
    if (!session) {
      if (prevUserIdRef.current !== null) ph.reset();
      prevUserIdRef.current = null;
      return;
    }
    const userId = session.user.id;
    if (prevUserIdRef.current !== userId) {
      ph.identify(userId, {
        email: session.user.email,
        name: session.user.name,
        role: (session.user as { role?: string }).role ?? "user",
      });
      prevUserIdRef.current = userId;
    }
  }, [session, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      {children}
      <PostHogPageView />
    </PHProvider>
  );
}
