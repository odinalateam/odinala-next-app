"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { ListingWithCategory } from "@/lib/types";

const STORAGE_KEY = "odinala-compare-properties";
const MAX_COMPARE = 4;

interface CompareContextValue {
  items: ListingWithCategory[];
  addItem: (property: ListingWithCategory) => void;
  removeItem: (id: string) => void;
  toggleItem: (property: ListingWithCategory) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  isFull: boolean;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ListingWithCategory[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ListingWithCategory[];
        setItems(
          parsed
            .filter((item) => item.type === "Property")
            .slice(0, MAX_COMPARE)
        );
      }
    } catch {
      // Corrupt data, ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change (only after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((property: ListingWithCategory) => {
    if (property.type !== "Property") return;
    setItems((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      if (prev.some((p) => p.id === property.id)) return prev;
      return [...prev, property];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleItem = useCallback((property: ListingWithCategory) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) return prev.filter((p) => p.id !== property.id);
      if (prev.length >= MAX_COMPARE) return prev;
      if (property.type !== "Property") return prev;
      return [...prev, property];
    });
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const isInCompare = useCallback(
    (id: string) => items.some((p) => p.id === id),
    [items]
  );

  return (
    <CompareContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        clearAll,
        isInCompare,
        isFull: items.length >= MAX_COMPARE,
        count: items.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
