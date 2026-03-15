"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import type { UserWithProfile } from "@/lib/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Sheet } from "@/components/ui/sheet";
import { UserDetailPanel } from "./user-detail-panel";

const columns: ColumnDef<UserWithProfile>[] = [
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "default" : "secondary"}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    id: "kycStatus",
    header: "KYC Status",
    accessorFn: (row) => row.profile?.kycStatus ?? "unverified",
    cell: ({ row }) => {
      const status = row.original.profile?.kycStatus ?? "unverified";
      return (
        <Badge
          variant="outline"
          className={
            status === "verified"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-transparent"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export function UsersClient({ data }: { data: UserWithProfile[] }) {
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(
    null
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search users..."
        onRowClick={(user) => setSelectedUser(user)}
      />
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
