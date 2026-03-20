"use client";

import { useState } from "react";
import { useCompare } from "@/lib/compare-context";
import { CompareModal } from "@/components/compare/compare-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CompareFloatingButton() {
  const { count } = useCompare();
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1.5 bg-foreground text-background px-3.5 py-2.5 justify-center rounded-r-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
        style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
      >
        <span className="text-xs font-semibold tracking-wider uppercase">
          Compare
        </span>
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-background text-foreground text-[10px] font-bold"
          style={{ writingMode: "horizontal-tb" }}
        >
          {count}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Properties</DialogTitle>
          </DialogHeader>
          <CompareModal onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
