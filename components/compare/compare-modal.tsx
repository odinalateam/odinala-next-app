"use client";

import Image from "next/image";
import Link from "next/link";
import { X, MapPin } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

function getStatusColor(status: string) {
  switch (status) {
    case "Available":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Sold":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  }
}

interface CompareModalProps {
  onClose: () => void;
}

export function CompareModal({ onClose }: CompareModalProps) {
  const { items, removeItem, clearAll } = useCompare();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">
          No properties to compare. Add properties using the compare button on
          property cards.
        </p>
      </div>
    );
  }

  const rows: {
    label: string;
    render: (item: (typeof items)[0]) => React.ReactNode;
  }[] = [
    {
      label: "Image",
      render: (item) =>
        item.images.length > 0 ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src={item.images[0]}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full rounded-lg bg-muted" />
        ),
    },
    {
      label: "Name",
      render: (item) => (
        <Link
          href={`/properties/${item.id}`}
          onClick={onClose}
          className="font-medium text-sm hover:underline"
        >
          {item.name}
        </Link>
      ),
    },
    {
      label: "Price",
      render: (item) => (
        <span className="font-semibold text-sm">{formatPrice(item.price)}</span>
      ),
    },
    {
      label: "Status",
      render: (item) => (
        <span
          className={`text-xs font-semibold rounded-full px-3 py-1 ${getStatusColor(item.status)}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      label: "Location",
      render: (item) => (
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {item.location}
        </span>
      ),
    },
    {
      label: "Bedrooms",
      render: (item) => (
        <span className="text-sm">
          {item.bedrooms != null ? item.bedrooms : "N/A"}
        </span>
      ),
    },
    {
      label: "Bathrooms",
      render: (item) => (
        <span className="text-sm">
          {item.bathrooms != null ? item.bathrooms : "N/A"}
        </span>
      ),
    },
    {
      label: "Size",
      render: (item) => <span className="text-sm">{item.size} sqm</span>,
    },
    {
      label: "Category",
      render: (item) => (
        <span className="text-sm">{item.category?.name || "N/A"}</span>
      ),
    },
    {
      label: "Development",
      render: (item) => (
        <span className="text-xs font-medium capitalize">
          {item.developmentStatus}
        </span>
      ),
    },
    {
      label: "Purchase",
      render: (item) => (
        <span className="text-sm">
          {item.purchaseType === "recurring_plan"
            ? "Installment Plan"
            : "Outright"}
        </span>
      ),
    },
    {
      label: "Plan Status",
      render: (item) => (
        <span className="text-sm">
          {item.planStatus === "off_plan" ? "Off-Plan" : "Standard"}
        </span>
      ),
    },
    {
      label: "Installment",
      render: (item) =>
        item.maxInstallment ? (
          <span className="text-sm">
            {item.maxInstallment} months @{" "}
            {formatPrice(item.pricePerInstallment || 0)}/mo
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        ),
    },
    {
      label: "Features",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.features.slice(0, 5).map((f) => (
            <span
              key={f}
              className="text-[10px] bg-secondary text-secondary-foreground rounded-full px-2 py-0.5"
            >
              {f}
            </span>
          ))}
          {item.features.length > 5 && (
            <span className="text-[10px] text-muted-foreground">
              +{item.features.length - 5} more
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear all
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="w-28 shrink-0" />
              {items.map((item) => (
                <th key={item.id} className="px-3 pb-2 min-w-[180px]">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                <td className="px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider align-top whitespace-nowrap">
                  {row.label}
                </td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 align-top">
                    {row.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
