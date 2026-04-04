import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardMobileNav from "@/components/dashboard/dashboard-mobile-nav";
import { getUnreadCount } from "@/lib/actions/messages";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const unreadMessageCount = await getUnreadCount();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      <DashboardMobileNav unreadMessageCount={unreadMessageCount} />
      <div className="flex gap-8">
        <div className="hidden md:block">
          <DashboardSidebar unreadMessageCount={unreadMessageCount} />
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
