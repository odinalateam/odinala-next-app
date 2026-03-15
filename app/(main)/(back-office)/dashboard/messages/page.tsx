import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Dashboard",
};

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Messages</h1>
      <div className="rounded-lg border border-border">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">Admin Inbox</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No messages yet</p>
          <p className="text-xs mt-1 opacity-60">
            Messages from users will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
