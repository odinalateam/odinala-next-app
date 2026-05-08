"use client";

import { cn } from "@/lib/utils";

function formatTime(date: Date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageBubble({
  content,
  senderName,
  senderRole,
  createdAt,
  isMine,
}: {
  content: string;
  senderName: string;
  senderRole: string;
  createdAt: Date;
  isMine: boolean;
}) {
  return (
    <div
      className={cn("flex flex-col max-w-[75%]", isMine ? "ml-auto items-end" : "items-start")}
    >
      <span className="text-[11px] text-muted-foreground mb-1 px-1">
        {isMine ? "You" : senderRole === "admin" ? "Odinala Team" : senderName}
      </span>
      <div
        className={cn(
          "rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words",
          isMine
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        {content}
      </div>
      <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
        {formatTime(createdAt)}
      </span>
    </div>
  );
}
