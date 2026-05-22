"use client";

import { useState, useCallback, useEffect } from "react";
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
  Target,
  ChevronDown,
  List,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getUnreadCount } from "@/lib/actions/messages";
import { usePolling } from "@/lib/hooks/use-polling";

type SidebarItem =
  | { label: string; href: string; icon: React.ElementType; children?: never }
  | {
      label: string;
      href: string;
      icon: React.ElementType;
      children: { label: string; href: string; icon: React.ElementType }[];
    };

const sidebarItems: SidebarItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: Target,
    children: [
      { label: "All Leads", href: "/dashboard/leads", icon: List },
      { label: "Email Templates", href: "/dashboard/leads/emails", icon: Mail },
    ],
  },
  { label: "Admins", href: "/dashboard/admins", icon: ShieldCheck },
  { label: "Listings", href: "/dashboard/listings", icon: Building },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "News & Insights", href: "/dashboard/news", icon: Newspaper },
];

export default function DashboardSidebar({
  unreadMessageCount: initialCount = 0,
}: {
  unreadMessageCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(initialCount);

  // Track which expandable items are open — default open if current path is inside
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sidebarItems.forEach((item) => {
      if (item.children) {
        initial[item.href] = pathname.startsWith(item.href);
      }
    });
    return initial;
  });

  // Keep open if navigating into the group
  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (item.children && pathname.startsWith(item.href)) {
        setOpenGroups((prev) => ({ ...prev, [item.href]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const pollUnread = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Silently ignore
    }
  }, []);

  usePolling(pollUnread, 30000);

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
          const hasChildren = !!item.children?.length;
          const isGroupOpen = hasChildren && !!openGroups[item.href];
          const isActive = hasChildren
            ? pathname.startsWith(item.href)
            : item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          if (hasChildren) {
            return (
              <div key={item.href}>
                {/* Dropdown trigger */}
                <button
                  type="button"
                  onClick={() => toggleGroup(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
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
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isGroupOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {/* Children */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isGroupOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3 pb-1">
                    {item.children!.map((child) => {
                      const isChildActive =
                        child.href === item.href
                          ? pathname === child.href
                          : pathname === child.href ||
                            pathname.startsWith(child.href + "/");
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                            isChildActive
                              ? "text-foreground font-medium bg-muted"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          <child.icon className="h-3.5 w-3.5 shrink-0" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

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
              {item.label === "Messages" && unreadCount > 0 && (
                <Badge className="ml-auto h-4.5 min-w-4.5 px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
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
