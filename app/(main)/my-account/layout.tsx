import AccountSidebar from "@/components/account/account-sidebar";
import AccountMobileNav from "@/components/account/account-mobile-nav";
import { getUnreadCount } from "@/lib/actions/messages";

export default async function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadMessageCount = await getUnreadCount();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      <AccountMobileNav unreadMessageCount={unreadMessageCount} />
      <div className="flex gap-8">
        <div className="hidden md:block">
          <AccountSidebar unreadMessageCount={unreadMessageCount} />
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
