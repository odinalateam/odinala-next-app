"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationBell from "@/components/notifications/notification-bell";

const navOptions = [
  { label: "Profile", value: "/my-account" },
  { label: "News and Insights", value: "/my-account/news-and-insights" },
  { label: "Messages", value: "/my-account/messages" },
  { label: "My Orders", value: "/my-account/orders" },
  { label: "Logout", value: "logout" },
];

export default function AccountMobileNav({
  unreadMessageCount = 0,
  initialUnreadNotificationCount = 0,
}: {
  unreadMessageCount?: number;
  initialUnreadNotificationCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = async (value: string | null) => {
    if (!value) return;
    if (value === "logout") {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } else {
      router.push(value);
    }
  };

  return (
    <div className="md:hidden mb-6 flex items-center gap-2">
      <Select value={pathname} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {navOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label === "Messages" && unreadMessageCount > 0
                ? `Messages (${unreadMessageCount})`
                : option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <NotificationBell initialUnreadCount={initialUnreadNotificationCount} />
    </div>
  );
}
