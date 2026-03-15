import AccountSidebar from "@/components/account/account-sidebar";
import AccountMobileNav from "@/components/account/account-mobile-nav";

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      <AccountMobileNav />
      <div className="flex gap-8">
        <div className="hidden md:block">
          <AccountSidebar />
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
