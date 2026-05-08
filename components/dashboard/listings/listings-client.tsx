"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import type { ListingWithCategory, Category } from "@/lib/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { deleteListing, toggleListingVisibility } from "@/lib/actions/listings";
import { Switch } from "@/components/ui/switch";
import { ListingForm } from "./listing-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [toggling, setToggling] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;
    setToggling(id);
    toast.promise(toggleListingVisibility(id, newValue), {
      loading: newValue ? "Making listing visible..." : "Hiding listing...",
      success: newValue
        ? "Listing is now visible to the public"
        : "Listing is now hidden from the public",
      error: "Failed to update listing visibility",
      finally: () => setToggling(null),
    });
  };

  const filtered = data.filter((l) => {
    if (l.type !== activeTab) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (locationFilter !== "all" && l.location !== locationFilter) return false;
    return true;
  });

  const locations = [
    ...new Set(data.filter((l) => l.type === activeTab).map((l) => l.location)),
  ].sort();

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
        <span className={cn("font-medium", !row.original.isVisible && "opacity-50")}>
          {row.original.name}
        </span>
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
      accessorKey: "isVisible",
      header: "Visible",
      cell: ({ row }) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.original.isVisible}
            onCheckedChange={() =>
              handleToggleVisibility(row.original.id, row.original.isVisible)
            }
            disabled={toggling === row.original.id}
          />
          <span className="text-xs text-muted-foreground">
            {row.original.isVisible ? "Public" : "Hidden"}
          </span>
        </div>
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
        filterComponent={
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
                <SelectItem value="Under Offer">Under Offer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v ?? "all")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
