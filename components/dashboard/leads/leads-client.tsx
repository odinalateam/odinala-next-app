"use client";

import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Mail, Flame, TrendingUp, Minus } from "lucide-react";
import { BulkEmailDialog } from "./bulk-email-dialog";
import type { UserWithProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type LeadTier = "hot" | "warm" | "cold";
type OnboardingFilter = "all" | "completed" | "pending";

const BUDGET_LABELS: Record<string, string> = {
  "5M_plus": "₦5M+ / $10K+",
  "1M_5M": "₦1M–₦5M",
  "exploring": "Just exploring",
};

function TierBadge({ tier }: { tier: string | null | undefined }) {
  if (!tier) return <Badge variant="outline" className="text-muted-foreground">Unscored</Badge>;
  const t = tier as LeadTier;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-transparent font-medium",
        t === "hot" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        t === "warm" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        t === "cold" && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      )}
    >
      {t === "hot" && <Flame className="h-3 w-3" />}
      {t === "warm" && <TrendingUp className="h-3 w-3" />}
      {t === "cold" && <Minus className="h-3 w-3" />}
      {t.charAt(0).toUpperCase() + t.slice(1)}
    </Badge>
  );
}

function OnboardingBadge({ completed, skipped }: { completed: boolean; skipped: boolean }) {
  if (completed) return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent">Completed</Badge>;
  if (skipped) return <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-transparent">Skipped</Badge>;
  return <Badge variant="outline" className="bg-muted text-muted-foreground border-transparent">Pending</Badge>;
}

const columns: ColumnDef<UserWithProfile>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border cursor-pointer accent-foreground"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border cursor-pointer accent-foreground"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    size: 40,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
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
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.email}</span>,
  },
  {
    id: "leadTier",
    header: "Tier",
    accessorFn: (row) => row.profile?.leadTier ?? "",
    cell: ({ row }) => <TierBadge tier={row.original.profile?.leadTier} />,
  },
  {
    id: "leadScore",
    header: "Score",
    accessorFn: (row) => row.profile?.leadScore ?? -1,
    cell: ({ row }) => {
      const score = row.original.profile?.leadScore;
      return (
        <span className="font-mono text-sm">
          {score != null ? `${score}/11` : "—"}
        </span>
      );
    },
  },
  {
    id: "country",
    header: "Location",
    accessorFn: (row) => row.profile?.country ?? "",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.profile?.country ?? <span className="text-muted-foreground">—</span>}</span>
    ),
  },
  {
    id: "budget",
    header: "Budget",
    accessorFn: (row) => row.profile?.investmentBudget ?? "",
    cell: ({ row }) => {
      const budget = row.original.profile?.investmentBudget;
      return <span className="text-sm">{budget ? BUDGET_LABELS[budget] ?? budget : <span className="text-muted-foreground">—</span>}</span>;
    },
  },
  {
    id: "onboarding",
    header: "Onboarding",
    cell: ({ row }) => (
      <OnboardingBadge
        completed={row.original.profile?.onboardingCompleted ?? false}
        skipped={row.original.profile?.onboardingSkipped ?? false}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];

const TIER_OPTIONS: { value: LeadTier | "all"; label: string }[] = [
  { value: "all", label: "All Tiers" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
];

const ONBOARDING_OPTIONS: { value: OnboardingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

export function LeadsClient({ data }: { data: UserWithProfile[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "leadScore", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [tierFilter, setTierFilter] = useState<LeadTier | "all">("all");
  const [onboardingFilter, setOnboardingFilter] = useState<OnboardingFilter>("all");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const filteredData = useMemo(() => {
    let result = data;
    if (tierFilter !== "all") {
      result = result.filter((u) => u.profile?.leadTier === tierFilter);
    }
    if (onboardingFilter === "completed") {
      result = result.filter((u) => u.profile?.onboardingCompleted);
    } else if (onboardingFilter === "pending") {
      result = result.filter((u) => !u.profile?.onboardingCompleted);
    }
    return result;
  }, [data, tierFilter, onboardingFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: { sorting, columnFilters, rowSelection },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedUserIds = selectedRows.map((r) => r.original.id);

  const tierCounts = useMemo(() => {
    const counts = { hot: 0, warm: 0, cold: 0, unscored: 0 };
    data.forEach((u) => {
      const t = u.profile?.leadTier;
      if (t === "hot") counts.hot++;
      else if (t === "warm") counts.warm++;
      else if (t === "cold") counts.cold++;
      else counts.unscored++;
    });
    return counts;
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Hot", count: tierCounts.hot, color: "text-red-600 dark:text-red-400" },
          { label: "Warm", count: tierCounts.warm, color: "text-amber-600 dark:text-amber-400" },
          { label: "Cold", count: tierCounts.cold, color: "text-slate-500 dark:text-slate-400" },
          { label: "Unscored", count: tierCounts.unscored, color: "text-muted-foreground" },
        ].map(({ label, count, color }) => (
          <div key={label} className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-semibold ${color}`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name or email..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="max-w-xs"
        />

        {/* Tier filter */}
        <div className="flex items-center rounded-lg border border-border overflow-hidden">
          {TIER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setTierFilter(value); setRowSelection({}); }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors border-r border-border last:border-0",
                tierFilter === value ? "bg-foreground text-background" : "hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Onboarding filter */}
        <div className="flex items-center rounded-lg border border-border overflow-hidden">
          {ONBOARDING_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setOnboardingFilter(value); setRowSelection({}); }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors border-r border-border last:border-0",
                onboardingFilter === value ? "bg-foreground text-background" : "hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {selectedUserIds.length > 0 && (
          <Button
            onClick={() => setEmailDialogOpen(true)}
            size="sm"
            className="gap-1.5 ml-auto"
          >
            <Mail className="h-4 w-4" />
            Send Email ({selectedUserIds.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.column.getSize() !== 150 ? header.column.getSize() : undefined }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <BulkEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        userIds={selectedUserIds}
        onSuccess={() => setRowSelection({})}
      />
    </div>
  );
}
