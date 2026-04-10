import AccountSidebar from "@/components/account/account-sidebar";
import AccountMobileNav from "@/components/account/account-mobile-nav";
import { getUnreadCount } from "@/lib/actions/messages";
import { getUnreadNotificationCount } from "@/lib/actions/notifications";

export default async function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadMessageCount, unreadNotificationCount] = await Promise.all([
    getUnreadCount(),
    getUnreadNotificationCount(),
  ]);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      <AccountMobileNav
        unreadMessageCount={unreadMessageCount}
        initialUnreadNotificationCount={unreadNotificationCount}
      />
      <div className="flex gap-8">
        <div className="hidden md:block">
          <AccountSidebar
            unreadMessageCount={unreadMessageCount}
            initialUnreadNotificationCount={unreadNotificationCount}
          />
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
