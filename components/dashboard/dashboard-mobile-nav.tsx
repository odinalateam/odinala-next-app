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

const navOptions = [
  { label: "Overview", value: "/dashboard" },
  { label: "Users", value: "/dashboard/users" },
  { label: "Admins", value: "/dashboard/admins" },
  { label: "Listings", value: "/dashboard/listings" },
  { label: "Orders", value: "/dashboard/orders" },
  { label: "Messages", value: "/dashboard/messages" },
  { label: "Categories", value: "/dashboard/categories" },
  { label: "News & Insights", value: "/dashboard/news" },
  { label: "Logout", value: "logout" },
];

export default function DashboardMobileNav({
  unreadMessageCount = 0,
}: {
  unreadMessageCount?: number;
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
    <div className="md:hidden mb-6">
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
    </div>
  );
}
