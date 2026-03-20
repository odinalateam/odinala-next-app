"use client";

import { Scale } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import type { ListingWithCategory } from "@/lib/types";

interface CompareToggleButtonProps {
  property: ListingWithCategory;
}

export function CompareToggleButton({ property }: CompareToggleButtonProps) {
  const { toggleItem, isInCompare, isFull } = useCompare();
  const active = isInCompare(property.id);

  if (property.type !== "Property") return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(property);
      }}
      disabled={!active && isFull}
      title={
        active
          ? "Remove from compare"
          : isFull
            ? "Compare list full (max 4)"
            : "Add to compare"
      }
      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
        active
          ? "bg-foreground text-background shadow-md"
          : "bg-black/40 text-white hover:bg-black/60"
      } ${!active && isFull ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Scale className="w-4 h-4" />
    </button>
  );
}
