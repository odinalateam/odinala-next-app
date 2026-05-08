import { getConversations } from "@/lib/actions/messages";
import { AdminMessagesClient } from "@/components/chat/admin-messages-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Dashboard",
};

export default async function MessagesPage() {
  const conversations = await getConversations();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Messages</h1>
      <AdminMessagesClient conversations={conversations} />
    </div>
  );
}
