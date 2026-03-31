"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

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

export default function DashboardMobileNav() {
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
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
