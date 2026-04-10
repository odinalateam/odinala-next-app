"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Package, Newspaper, MessageSquare, CheckCheck, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/notifications";
import type { Notification } from "@prisma/client";

const TYPE_ICON = {
  MESSAGE: MessageSquare,
  ORDER_UPDATE: Package,
  ARTICLE_PUBLISHED: Newspaper,
} as const;

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationPanel({
  onRead,
  onReadAll,
}: {
  onRead: () => void;
  onReadAll: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getUserNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      onRead();
    });
  }

  function handleMarkAll() {
    startTransition(async () => {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onReadAll();
    });
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading…</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {unreadCount > 0 && (
        <div className="px-4 pb-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAll}
            className="text-xs gap-1.5 h-7"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Bell className="h-8 w-8 opacity-30" />
            <p className="text-sm">No notifications yet.</p>
          </div>
        )}
        {notifications.map((n) => {
          const Icon = TYPE_ICON[n.type as keyof typeof TYPE_ICON] ?? Bell;
          const content = (
            <div
              className={cn(
                "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/40 cursor-pointer",
                !n.isRead && "bg-primary/5"
              )}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
            >
              <div className="mt-0.5 shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm", !n.isRead && "font-medium")}>
                  {n.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {n.body}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {relativeTime(new Date(n.createdAt))}
                </p>
              </div>
              {!n.isRead && (
                <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </div>
          );

          return n.link ? (
            <Link key={n.id} href={n.link}>
              {content}
            </Link>
          ) : (
            <div key={n.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
