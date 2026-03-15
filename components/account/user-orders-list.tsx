"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Listing, Order, Category } from "@prisma/client";

type OrderWithListing = Order & {
  listing: Listing & {
    category: Category | null;
  };
};

function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent";
    case "Rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-transparent";
    case "Completed":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-transparent";
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-transparent";
    default:
      return "";
  }
}

const tabs = ["Properties", "Lands"] as const;

export function UserOrdersList({ orders }: { orders: OrderWithListing[] }) {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Properties");

  const filtered = orders.filter((o) =>
    activeTab === "Properties"
      ? o.listing.type === "Property"
      : o.listing.type === "Land"
  );

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
              activeTab === tab
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Package className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No orders yet</p>
          <p className="text-xs mt-1 opacity-60">
            Your {activeTab.toLowerCase()} orders will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                  {order.listing.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.listing.location}
                </p>
                {order.listing.category && (
                  <span className="inline-block text-xs text-muted-foreground mt-1">
                    {order.listing.category.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium whitespace-nowrap">
                  {formatPrice(order.listing.price)}
                </span>
                <Badge
                  variant="outline"
                  className="border-transparent bg-secondary text-secondary-foreground"
                >
                  {order.paymentOption === "installment"
                    ? `Installment (${order.installmentMonths}mo)`
                    : "Outright"}
                </Badge>
                <Badge
                  variant="outline"
                  className={getStatusColor(order.status)}
                >
                  {order.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
