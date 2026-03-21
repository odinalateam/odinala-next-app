"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface PropertyFiltersProps {
  availableFeatures: string[];
}

export function PropertyFilters({ availableFeatures }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateFilters = (updates: Record<string, string | null>) => {
    const qs = createQueryString(updates);
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const currentDevStatus = searchParams.get("developmentStatus") || "";
  const currentPurchaseType = searchParams.get("purchaseType") || "";
  const currentFeatures =
    searchParams.get("features")?.split(",").filter(Boolean) || [];

  // Local state for price inputs with debouncing
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  // Update URL when debounced price values change
  useEffect(() => {
    updateFilters({
      minPrice: debouncedMinPrice || null,
      maxPrice: debouncedMaxPrice || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMinPrice, debouncedMaxPrice]);

  // Sync local state with URL params when they change externally
  useEffect(() => {
    const urlMin = searchParams.get("minPrice") || "";
    const urlMax = searchParams.get("maxPrice") || "";
    if (urlMin !== minPrice) setMinPrice(urlMin);
    if (urlMax !== maxPrice) setMaxPrice(urlMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const toggleFeature = (feature: string) => {
    const updated = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature];
    updateFilters({
      features: updated.length > 0 ? updated.join(",") : null,
    });
  };

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  };

  const hasActiveFilters = !!(
    currentDevStatus ||
    currentPurchaseType ||
    currentFeatures.length > 0 ||
    minPrice ||
    maxPrice ||
    searchParams.get("q")
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Price Range
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="text-xs"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      <Separator />

      {/* Development Status */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Development Status
        </Label>
        <div className="space-y-2">
          {["ongoing", "completed", "uncompleted"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="developmentStatus"
                checked={currentDevStatus === status}
                onChange={() =>
                  updateFilters({
                    developmentStatus:
                      currentDevStatus === status ? null : status,
                  })
                }
                className="accent-primary"
              />
              <span className="text-sm capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Purchase Type */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Purchase Type
        </Label>
        <div className="space-y-2">
          {[
            { value: "one_off", label: "Outright" },
            { value: "recurring_plan", label: "Installment Plan" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="purchaseType"
                checked={currentPurchaseType === value}
                onChange={() =>
                  updateFilters({
                    purchaseType:
                      currentPurchaseType === value ? null : value,
                  })
                }
                className="accent-primary"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities / Features */}
      {availableFeatures.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Amenities
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={currentFeatures.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    className="accent-primary rounded"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
