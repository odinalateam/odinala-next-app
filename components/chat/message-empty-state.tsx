"use client";

import { MessageSquare } from "lucide-react";

export function MessageEmptyState({
  title = "No messages yet",
  description = "Start the conversation by sending a message below",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground">
      <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
      <p className="text-sm">{title}</p>
      <p className="text-xs mt-1 opacity-60">{description}</p>
    </div>
  );
}
