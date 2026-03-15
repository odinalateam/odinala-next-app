"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/lib/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/categories";
import { CategoryForm } from "./category-form";

export function CategoriesClient({ data }: { data: Category[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setDeleting(id);
    try {
      await deleteCategory(id);
    } finally {
      setDeleting(null);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.type}</Badge>
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
          <CategoryForm category={row.original} />
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
      <div className="flex justify-end">
        <CategoryForm />
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search categories..."
      />
    </div>
  );
}
