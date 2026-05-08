"use client";

import { useEffect, useState } from "react";
import { X, Share } from "lucide-react";
import { isIOS, isStandalone } from "@/lib/hooks/use-pwa-install";

const DISMISSED_KEY = "odinala_ios_prompt_dismissed";

export default function IOSInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isIOS() || isStandalone()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="mb-4 rounded-lg border border-border bg-muted/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">Get notifications on your iPhone</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add Odinala to your Home Screen to receive order updates and new
            article alerts.
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Tap</span>
            <span className="inline-flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 text-[11px] font-medium">
              <Share className="h-3 w-3" />
              Share
            </span>
            <span>then</span>
            <span className="rounded border border-border px-1.5 py-0.5 text-[11px] font-medium">
              Add to Home Screen
            </span>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-md p-1 hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
