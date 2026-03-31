"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building,
  Package,
  MessageSquare,
  Tag,
  Newspaper,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Admins", href: "/dashboard/admins", icon: ShieldCheck },
  { label: "Listings", href: "/dashboard/listings", icon: Building },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "News & Insights", href: "/dashboard/news", icon: Newspaper },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <aside className="w-64 shrink-0">
      <div className="mb-4 px-3">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <div className="relative flex items-center">
                {isActive && (
                  <span className="absolute -left-3 h-5 w-0.5 rounded-full bg-primary" />
                )}
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px]",
                    isActive ? "text-primary" : ""
                  )}
                />
              </div>
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
