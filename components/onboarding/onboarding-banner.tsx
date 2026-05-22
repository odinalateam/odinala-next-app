"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { getOnboardingStatus } from "@/lib/actions/onboarding";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function OnboardingBanner() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (isPending || !session || isAdmin || isDashboard) {
      setShow(false);
      return;
    }

    getOnboardingStatus().then((status) => {
      if (status && status.onboardingSkipped && !status.onboardingCompleted) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [session, isPending, isAdmin, isDashboard, pathname]);

  if (!show) return null;

  return (
    <div className="w-full bg-muted/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Complete your investor profile to get personalised property recommendations.</span>
        </div>
        <Link
          href="/onboarding"
          className="shrink-0 text-foreground font-medium underline underline-offset-2 hover:no-underline transition-all"
        >
          Complete now
        </Link>
      </div>
    </div>
  );
}
