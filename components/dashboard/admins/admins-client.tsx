"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import type { User } from "@/lib/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { demoteFromAdmin } from "@/lib/actions/admin-users";
import { AddAdminDialog } from "./add-admin-dialog";
import { toast } from "sonner";

export function AdminsClient({ data }: { data: User[] }) {
  const [demoting, setDemoting] = useState<string | null>(null);
  const router = useRouter();

  const handleDemote = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    setDemoting(userId);
    const result = await demoteFromAdmin(userId);
    if (result.success) {
      toast.success("Admin removed successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to remove admin");
    }
    setDemoting(null);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.original.name;
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {initials}
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      header: "Date Joined",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            handleDemote(row.original.id);
          }}
          disabled={demoting === row.original.id}
        >
          {demoting === row.original.id ? "Removing..." : "Remove Admin"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddAdminDialog />
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search admins..."
      />
    </div>
  );
}
