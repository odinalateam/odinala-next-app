"use client";

import { useState } from "react";
import type { OrderWithFullRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateOrderStatus } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/format";
import { FileText, ExternalLink } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-muted-foreground text-sm shrink-0">{label}</span>
      <span className="text-sm text-right">{value || "—"}</span>
    </div>
  );
}

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

export function OrderDetailPanel({
  order,
  onClose,
}: {
  order: OrderWithFullRelations;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: string) => {
    setLoading(true);
    try {
      await updateOrderStatus(order.id, status);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SheetContent className="overflow-y-auto sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Order Details</SheetTitle>
        <SheetDescription>Order #{order.id.slice(-8)}</SheetDescription>
      </SheetHeader>

      <div className="px-4 pb-4 space-y-6">
        {/* Status Badge */}
        <div>
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>

        {/* Order Information */}
        <div>
          <h3 className="text-sm font-medium mb-2">Order Information</h3>
          <Separator className="mb-3" />
          <InfoRow label="Order ID" value={order.id} />
          <InfoRow
            label="Date"
            value={new Date(order.createdAt).toLocaleDateString()}
          />
          <InfoRow
            label="Payment Option"
            value={
              order.paymentOption === "installment"
                ? `Installment (${order.installmentMonths} months)`
                : "Outright"
            }
          />
          {order.notes && <InfoRow label="Notes" value={order.notes} />}
        </div>

        {/* Listing Details */}
        <div>
          <h3 className="text-sm font-medium mb-2">Listing Details</h3>
          <Separator className="mb-3" />
          <InfoRow label="Name" value={order.listing.name} />
          <InfoRow label="Price" value={formatPrice(order.listing.price)} />
          <InfoRow label="Location" value={order.listing.location} />
          <InfoRow label="Type" value={order.listing.type} />
          <InfoRow label="Status" value={order.listing.status} />
        </div>

        {/* Buyer Info */}
        <div>
          <h3 className="text-sm font-medium mb-2">Buyer</h3>
          <Separator className="mb-3" />
          <InfoRow label="Name" value={order.user.name} />
          <InfoRow label="Email" value={order.user.email} />
        </div>

        {/* Proof of Payment */}
        <div>
          <h3 className="text-sm font-medium mb-2">Proof of Payment</h3>
          <Separator className="mb-3" />
          {order.proofOfPaymentUrl ? (
            <a
              href={order.proofOfPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <FileText className="w-4 h-4" />
              View Proof of Payment
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">Not yet uploaded</p>
          )}
        </div>

        {/* Actions */}
        {order.status === "Pending" && (
          <div>
            <h3 className="text-sm font-medium mb-2">Actions</h3>
            <Separator className="mb-3" />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleStatusChange("Approved")}
                disabled={loading}
              >
                {loading ? "Updating..." : "Approve"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusChange("Rejected")}
                disabled={loading}
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        {order.status === "Approved" && (
          <div>
            <h3 className="text-sm font-medium mb-2">Actions</h3>
            <Separator className="mb-3" />
            <Button
              size="sm"
              onClick={() => handleStatusChange("Completed")}
              disabled={loading}
            >
              {loading ? "Updating..." : "Mark as Completed"}
            </Button>
          </div>
        )}
      </div>
    </SheetContent>
  );
}
