"use client";

import { useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { MessageEmptyState } from "./message-empty-state";
import {
  getUserConversations,
  getMessages,
  sendMessage,
  markAsRead,
  createConversation,
} from "@/lib/actions/messages";
import { CHAT_TOPICS } from "@/lib/constants";
import { usePolling } from "@/lib/hooks/use-polling";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Plus,
  ArrowLeft,
  MessageSquare,
  Home,
  MapPin,
  CreditCard,
  Package,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  content: string;
  isReadByUser: boolean;
  isReadByAdmin: boolean;
  createdAt: Date;
  sender: { id: string; name: string; image: string | null };
};

type ConversationData = {
  id: string;
  userId: string;
  topic: string;
  ticketNumber: number;
  updatedAt: Date;
  messages: Message[];
  _count: { messages: number };
};

const topicIcons: Record<string, React.ElementType> = {
  "Property Inquiry": Home,
  "Land Inquiry": MapPin,
  "Payment & Billing": CreditCard,
  "Order Status": Package,
  "KYC Verification": ShieldCheck,
  "General Inquiry": HelpCircle,
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

type View = "list" | "topic-select" | "thread";

export function UserMessagesClient({
  conversations: initialConversations,
}: {
  conversations: ConversationData[];
}) {
  const { data: session } = useSession();

  const [conversations, setConversations] =
    useState<ConversationData[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [view, setView] = useState<View>("list");
  const [creating, setCreating] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const selected = conversations.find((c) => c.id === selectedId);

  // Poll conversation list when on list view
  const pollConversations = useCallback(async () => {
    try {
      const updated = await getUserConversations();
      setConversations(updated);
    } catch {
      // Silently ignore
    }
  }, []);

  usePolling(pollConversations, 5000, view === "list");

  // Poll messages for selected conversation
  const pollMessages = useCallback(async () => {
    if (!selectedId) return;
    try {
      const updated = await getMessages(selectedId);
      setMessages(updated);

      const hasUnread = updated.some(
        (m) => !m.isReadByUser && m.senderRole === "admin"
      );
      if (hasUnread) {
        await markAsRead(selectedId);
      }
    } catch {
      // Silently ignore
    }
  }, [selectedId]);

  usePolling(pollMessages, 3000, view === "thread" && !!selectedId);

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedId(conversationId);
    setMessages([]);
    setLoadingMessages(true);
    setView("thread");

    try {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      setLoadingMessages(false);
      await markAsRead(conversationId);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, _count: { messages: 0 } } : c
        )
      );
    } catch {
      setLoadingMessages(false);
    }
  };

  const handleTopicSelect = async (topic: string) => {
    setCreating(true);
    try {
      const conv = await createConversation(topic);
      setConversations((prev) => [
        { ...conv, _count: { messages: 0 } },
        ...prev,
      ]);
      setSelectedId(conv.id);
      setMessages(conv.messages);
      setView("thread");
    } finally {
      setCreating(false);
    }
  };

  const handleSend = async (content: string) => {
    if (!selectedId) return;
    const newMsg = await sendMessage(selectedId, content);
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleBack = () => {
    setView("list");
    setSelectedId(null);
    pollConversations();
  };

  if (!session?.user) return null;

  // Topic selection view
  if (view === "topic-select") {
    return (
      <div className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-sm font-medium">New Conversation</h2>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-primary opacity-60" />
            <h3 className="text-base font-medium mb-1">
              How can we help you?
            </h3>
            <p className="text-sm text-muted-foreground">
              Select a topic to start a conversation with the Odinala team
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            {CHAT_TOPICS.map((topic) => {
              const Icon = topicIcons[topic] || HelpCircle;
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  disabled={creating}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm text-left hover:bg-muted/50 hover:border-primary/30 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Thread view
  if (view === "thread" && selected) {
    return (
      <div className="rounded-lg border border-border flex flex-col h-[500px]">
        <div className="border-b border-border px-4 py-3 shrink-0 flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              #{selected.ticketNumber} - {selected.topic}
            </p>
            <p className="text-xs text-muted-foreground">
              Messages with Odinala Team
            </p>
          </div>
        </div>
        <MessageList messages={messages} currentUserId={session.user.id} loading={loadingMessages} />
        <MessageInput onSend={handleSend} />
      </div>
    );
  }

  // Conversation list view (default)
  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">Messages</h2>
        <Button size="sm" onClick={() => setView("topic-select")}>
          <Plus className="h-3.5 w-3.5" />
          New Conversation
        </Button>
      </div>
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1 opacity-60 mb-4">
            Start a conversation with the Odinala team
          </p>
          <Button size="sm" onClick={() => setView("topic-select")}>
            <Plus className="h-3.5 w-3.5" />
            Start a Conversation
          </Button>
        </div>
      ) : (
        <div>
          {conversations.map((conv) => {
            const lastMsg = conv.messages[0];
            return (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b border-border last:border-b-0 cursor-pointer"
                )}
              >
                <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {(() => {
                    const Icon = topicIcons[conv.topic] || HelpCircle;
                    return <Icon className="h-4 w-4" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm truncate",
                        conv._count.messages > 0
                          ? "font-semibold"
                          : "font-medium"
                      )}
                    >
                      #{conv.ticketNumber} - {conv.topic}
                    </span>
                    {lastMsg && (
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatRelativeTime(lastMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={cn(
                        "text-xs truncate",
                        conv._count.messages > 0
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {lastMsg
                        ? `${lastMsg.senderRole === "user" ? "You: " : ""}${lastMsg.content}`
                        : "No messages yet"}
                    </p>
                    {conv._count.messages > 0 && (
                      <Badge className="h-4.5 min-w-4.5 px-1.5 text-[10px]">
                        {conv._count.messages}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
