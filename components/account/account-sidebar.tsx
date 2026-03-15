"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  User,
  Newspaper,
  MessageSquare,
  Package,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    label: "Profile",
    href: "/my-account",
    icon: User,
  },
  {
    label: "News and Insights",
    href: "/my-account/news-and-insights",
    icon: Newspaper,
  },
  {
    label: "Messages",
    href: "/my-account/messages",
    icon: MessageSquare,
  },
  {
    label: "My Orders",
    href: "/my-account/orders",
    icon: Package,
  },
];

export default function AccountSidebar() {
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
        <h2 className="text-lg font-semibold">My Account</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
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
