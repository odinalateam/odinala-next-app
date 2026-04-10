"use client";

import { useState, useCallback } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePolling } from "@/lib/hooks/use-polling";
import { getUnreadNotificationCount } from "@/lib/actions/notifications";
import NotificationPanel from "./notification-panel";

export default function NotificationBell({
  initialUnreadCount = 0,
}: {
  initialUnreadCount?: number;
}) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [open, setOpen] = useState(false);

  const poll = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      // Silently ignore
    }
  }, []);

  usePolling(poll, 30000);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="relative p-2 rounded-md hover:bg-muted/50 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[9px] leading-none pointer-events-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="p-0 w-full sm:max-w-sm flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <NotificationPanel
            onRead={() => setUnreadCount((n) => Math.max(0, n - 1))}
            onReadAll={() => setUnreadCount(0)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
