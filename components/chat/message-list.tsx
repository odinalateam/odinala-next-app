"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { MessageEmptyState } from "./message-empty-state";

type MessageItem = {
  id: string;
  content: string;
  senderRole: string;
  createdAt: Date;
  sender: { id: string; name: string; image: string | null };
};

function formatDateSeparator(date: Date) {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (today.getTime() - messageDay.getTime()) / 86400000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function SkeletonBubble({ align }: { align: "left" | "right" }) {
  return (
    <div
      className={`flex flex-col max-w-[75%] ${align === "right" ? "ml-auto items-end" : "items-start"}`}
    >
      <div
        className={`rounded-2xl px-3.5 py-2 ${align === "right" ? "rounded-br-md bg-primary/15" : "rounded-bl-md bg-muted"}`}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse" />
          <div
            className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}

export function MessageList({
  messages,
  currentUserId,
  loading,
}: {
  messages: MessageItem[];
  currentUserId: string;
  loading?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(messages.length);

  useEffect(() => {
    // Auto-scroll on new messages
    if (messages.length > prevCountRef.current || prevCountRef.current === 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCountRef.current = messages.length;
  }, [messages.length]);

  // Scroll to bottom on initial mount
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  if (messages.length === 0 && !loading) {
    return <MessageEmptyState />;
  }

  if (messages.length === 0 && loading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          <SkeletonBubble align="left" />
          <SkeletonBubble align="right" />
          <SkeletonBubble align="right" />
        </div>
      </div>
    );
  }

  let lastDateStr = "";

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-3">
        {messages.map((msg) => {
          const dateStr = formatDateSeparator(msg.createdAt);
          const showSeparator = dateStr !== lastDateStr;
          lastDateStr = dateStr;

          return (
            <div key={msg.id}>
              {showSeparator && (
                <div className="flex items-center justify-center my-3">
                  <span className="text-[11px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                    {dateStr}
                  </span>
                </div>
              )}
              <MessageBubble
                content={msg.content}
                senderName={msg.sender.name}
                senderRole={msg.senderRole}
                createdAt={msg.createdAt}
                isMine={msg.sender.id === currentUserId}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
