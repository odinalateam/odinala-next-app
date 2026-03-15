"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import type { ListingWithCategory, Category } from "@/lib/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { deleteListing } from "@/lib/actions/listings";
import { ListingForm } from "./listing-form";

function getStatusColor(status: string) {
  switch (status) {
    case "Available":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent";
    case "Sold":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-transparent";
    case "Under Offer":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-transparent";
    default:
      return "";
  }
}

export function ListingsClient({
  data,
  categories,
}: {
  data: ListingWithCategory[];
  categories: Category[];
}) {
  const [activeTab, setActiveTab] = useState<"Property" | "Land">("Property");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = data.filter((l) => l.type === activeTab);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setDeleting(id);
    try {
      await deleteListing(id);
    } finally {
      setDeleting(null);
    }
  };

  const columns: ColumnDef<ListingWithCategory>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => formatPrice(row.original.price),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className={getStatusColor(row.original.status)}>
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
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <ListingForm
            listing={row.original}
            categories={categories}
          />
          <Button
            variant="destructive"
            size="xs"
            onClick={() => handleDelete(row.original.id)}
            disabled={deleting === row.original.id}
          >
            {deleting === row.original.id ? "..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 border-b border-border">
          {(["Property", "Land"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                activeTab === tab
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "Property" ? "Properties" : "Land"}
            </button>
          ))}
        </div>
        <ListingForm categories={categories} defaultType={activeTab} />
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="name"
        searchPlaceholder="Search listings..."
      />
    </div>
  );
}
