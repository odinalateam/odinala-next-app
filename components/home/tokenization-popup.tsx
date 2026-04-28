"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

const STORAGE_KEY = "odinala_tokenization_popup_seen";
const RESHOW_AFTER_MS = 24 * 60 * 60 * 1000; // 1 day

export function TokenizationPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/tokenization")) return;
    if (typeof window === "undefined") return;

    const lastSeen = localStorage.getItem(STORAGE_KEY);
    if (lastSeen && Date.now() - Number(lastSeen) < RESHOW_AFTER_MS) return;

    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  if (pathname.startsWith("/tokenization")) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogPortal>
        <DialogOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            data-slot="dialog-content"
            className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10 shadow-2xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 duration-150"
            data-open={open ? "" : undefined}
            data-closed={!open ? "" : undefined}
          >
            <div className="flex flex-col sm:flex-row min-h-[340px]">
              {/* Left — image */}
              <div className="relative sm:w-1/2 h-48 sm:h-auto shrink-0 overflow-hidden bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
                  alt="Nigerian real estate"
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent sm:bg-gradient-to-r" />
                <div className="absolute bottom-4 left-4 sm:hidden">
                  <p className="text-white text-xs font-semibold tracking-widest uppercase opacity-80">
                    New Opportunity
                  </p>
                </div>
              </div>

              {/* Right — content */}
              <div className="flex flex-col justify-center px-6 py-7 sm:px-8 sm:w-1/2 gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 hidden sm:block">
                    New Opportunity
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                    OWN PROPERTY BACK HOME. PAY IN YOUR CURRENCY.
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Invest in premium Nigerian real estate from anywhere in the
                    world. You pay in USD, GBP, or EUR — we handle everything
                    else.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link href="/tokenization" onClick={handleClose}>
                    <button className="w-full bg-foreground text-background text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                      SEE HOW IT WORKS
                    </button>
                  </Link>
                  <button
                    onClick={handleClose}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1 cursor-pointer"
                  >
                    No thanks
                  </button>
                </div>

                <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                  By continuing, you may receive updates about investment opportunities.
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
