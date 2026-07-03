"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

interface ActivityTrackerProps {
  listingId?: string;
}

/**
 * Fire-and-forget component that records the current user's activity.
 * Mounts silently — errors are swallowed so they never affect the UI.
 * Pass a listingId when mounted inside a property detail page to also
 * increment that listing's view count for re-engagement personalisation.
 */
export function ActivityTracker({ listingId }: ActivityTrackerProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listingId ? { listingId } : {}),
    }).catch(() => {});
  }, [session, listingId]);

  return null;
}
