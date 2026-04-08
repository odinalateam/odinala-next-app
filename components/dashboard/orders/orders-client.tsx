"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import type { OrderWithFullRelations, UserWithProfile } from "@/lib/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Sheet } from "@/components/ui/sheet";
import { OrderDetailPanel } from "./order-detail-panel";
import { UserDetailPanel } from "@/components/dashboard/users/user-detail-panel";
import { formatPrice } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export function OrdersClient({ data }: { data: OrderWithFullRelations[] }) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] =
    useState<OrderWithFullRelations | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(
    null
  );

  const columns: ColumnDef<OrderWithFullRelations>[] = [
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => row.listing.name,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.listing.name}</span>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessorFn: (row) => row.listing.price,
      cell: ({ row }) => formatPrice(row.original.listing.price),
    },
    {
      id: "payment",
      header: "Payment",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="border-transparent bg-secondary text-secondary-foreground"
        >
          {row.original.paymentOption === "installment"
            ? `Installment (${row.original.installmentMonths}mo)`
            : "Outright"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={getStatusColor(row.original.status)}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "viewUser",
      header: "",
      cell: ({ row }) => (
        <span
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row.original.user);
          }}
        >
          View User
        </span>
      ),
    },
    {
      id: "viewOrder",
      header: "",
      cell: ({ row }) => (
        <span
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(row.original);
          }}
        >
          View Order
        </span>
      ),
    },
  ];

  const filtered = data.filter((order) => {
    if (typeFilter !== "all" && order.listing.type !== typeFilter) return false;
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    return true;
  });

  const filterComponent = (
    <div className="flex items-center gap-3 ml-auto">
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Filter Type:
        </span>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Property">Property</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Filter Status:
        </span>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={filtered}
        filterComponent={filterComponent}
      />

      {/* Order Detail Sheet */}
      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      >
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </Sheet>

      {/* User Detail Sheet */}
      <Sheet
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        {selectedUser && (
          <UserDetailPanel
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Sheet>
    </>
  );
}
