"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

const navOptions = [
  { label: "Profile", value: "/my-account" },
  { label: "News and Insights", value: "/my-account/news-and-insights" },
  { label: "Messages", value: "/my-account/messages" },
  { label: "My Orders", value: "/my-account/orders" },
  { label: "Logout", value: "logout" },
];

export default function AccountMobileNav({
  unreadMessageCount = 0,
}: {
  unreadMessageCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
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
      <select
        value={pathname}
        onChange={handleChange}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      >
        {navOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label === "Messages" && unreadMessageCount > 0
              ? `Messages (${unreadMessageCount})`
              : option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
