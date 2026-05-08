"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ConversationItemProps = {
  user: { name: string; email: string; image: string | null };
  topic: string;
  ticketNumber: number;
  lastMessage?: {
    content: string;
    createdAt: Date;
    senderRole: string;
  };
  unreadCount: number;
  isActive: boolean;
  onClick: () => void;
};

function formatRelativeTime(date: Date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ConversationItem({
  user,
  topic,
  ticketNumber,
  lastMessage,
  unreadCount,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 cursor-pointer",
        isActive && "bg-muted"
      )}
    >
      {/* Avatar */}
      <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm truncate",
              unreadCount > 0 ? "font-semibold" : "font-medium"
            )}
          >
            {user.name}
          </span>
          {lastMessage && (
            <span className="text-[11px] text-muted-foreground shrink-0">
              {formatRelativeTime(lastMessage.createdAt)}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          #{ticketNumber} - {topic}
        </p>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={cn(
              "text-xs truncate",
              unreadCount > 0
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            {lastMessage
              ? `${lastMessage.senderRole === "admin" ? "You: " : ""}${lastMessage.content}`
              : "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <Badge className="h-4.5 min-w-4.5 px-1.5 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
