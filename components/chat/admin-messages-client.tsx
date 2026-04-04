"use client";

import { useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { MessageEmptyState } from "./message-empty-state";
import { ConversationItem } from "./conversation-item";
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from "@/lib/actions/messages";
import { usePolling } from "@/lib/hooks/use-polling";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  user: { id: string; name: string; email: string; image: string | null };
  messages: Message[];
  _count: { messages: number };
};

export function AdminMessagesClient({
  conversations: initialConversations,
}: {
  conversations: ConversationData[];
}) {
  const { data: session } = useSession();
  const [conversations, setConversations] =
    useState<ConversationData[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const selected = conversations.find((c) => c.id === selectedId);

  // Poll conversation list
  const pollConversations = useCallback(async () => {
    try {
      const updated = await getConversations();
      setConversations(updated);
    } catch {
      // Silently ignore
    }
  }, []);

  usePolling(pollConversations, 5000);

  // Poll messages for selected conversation
  const pollMessages = useCallback(async () => {
    if (!selectedId) return;
    try {
      const updated = await getMessages(selectedId);
      setMessages(updated);
    } catch {
      // Silently ignore
    }
  }, [selectedId]);

  usePolling(pollMessages, 3000, !!selectedId);

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedId(conversationId);
    setMessages([]);
    setLoadingMessages(true);
    setMobileView("thread");

    try {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      setLoadingMessages(false);
      await markAsRead(conversationId);

      // Update local unread count
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, _count: { messages: 0 } } : c
        )
      );
    } catch {
      setLoadingMessages(false);
    }
  };

  const handleSend = async (content: string) => {
    if (!selectedId) return;
    const newMsg = await sendMessage(selectedId, content);
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleBack = () => {
    setMobileView("list");
    setSelectedId(null);
  };

  if (!session?.user) return null;

  return (
    <div className="rounded-lg border border-border flex h-[500px] overflow-hidden">
      {/* Conversation List */}
      <div
        className={`w-full md:w-80 md:border-r md:border-border shrink-0 flex flex-col ${
          mobileView === "thread" ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-border px-4 py-3 shrink-0">
          <h2 className="text-sm font-medium">Admin Inbox</h2>
        </div>
        {conversations.length === 0 ? (
          <MessageEmptyState
            title="No conversations yet"
            description="Messages from users will appear here"
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                user={conv.user}
                topic={conv.topic}
                ticketNumber={conv.ticketNumber}
                lastMessage={
                  conv.messages[0]
                    ? {
                        content: conv.messages[0].content,
                        createdAt: conv.messages[0].createdAt,
                        senderRole: conv.messages[0].senderRole,
                      }
                    : undefined
                }
                unreadCount={conv._count.messages}
                isActive={conv.id === selectedId}
                onClick={() => handleSelectConversation(conv.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Message Thread */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {selected ? (
          <>
            <div className="border-b border-border px-4 py-3 shrink-0 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleBack}
                className="md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  #{selected.ticketNumber} - {selected.topic}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selected.user.name} &middot; {selected.user.email}
                </p>
              </div>
            </div>
            <MessageList messages={messages} currentUserId={session.user.id} loading={loadingMessages} />
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <MessageEmptyState
            title="Select a conversation"
            description="Choose a conversation from the list to view messages"
          />
        )}
      </div>
    </div>
  );
}
