import Navbar from "@/components/partials/header";
import Footer from "@/components/partials/footer";
import { CompareFloatingButton } from "@/components/compare/compare-floating-button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <CompareFloatingButton />
      <Footer />
    </div>
  );
}
