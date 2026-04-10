"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/lib/hooks/use-push-notifications";
import { isIOS, isStandalone } from "@/lib/hooks/use-pwa-install";

export default function PushPermissionPrompt() {
  const { state, loading, subscribe } = usePushNotifications();
  // On iOS, only show this prompt when already in standalone mode
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ios = isIOS();
    const standalone = isStandalone();
    // Show for non-iOS users, or for iOS users who have already installed the PWA
    if (!ios || standalone) {
      setShow(true);
    }
  }, []);

  if (!show || state === "granted" || state === "denied" || state === "unsupported") {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-border bg-muted/40 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Bell className="h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm">
          Enable notifications to get order updates and new article alerts.
        </p>
      </div>
      <Button size="sm" onClick={subscribe} disabled={loading} className="shrink-0">
        {loading ? "Enabling…" : "Enable"}
      </Button>
    </div>
  );
}
