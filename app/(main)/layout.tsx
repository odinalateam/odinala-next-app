"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/partials/header";
import Footer from "@/components/partials/footer";
import { ContactSection } from "@/components/partials/contact-section";
import { CompareFloatingButton } from "@/components/compare/compare-floating-button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/my-account");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      {!isDashboard && <ContactSection />}
      <CompareFloatingButton />
      <Footer />
    </div>
  );
}
