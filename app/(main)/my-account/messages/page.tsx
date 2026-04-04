import { getUserConversations } from "@/lib/actions/messages";
import { UserMessagesClient } from "@/components/chat/user-messages-client";

export default async function MessagesPage() {
  const conversations = await getUserConversations();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Messages</h1>
      <UserMessagesClient conversations={conversations} />
    </div>
  );
}
