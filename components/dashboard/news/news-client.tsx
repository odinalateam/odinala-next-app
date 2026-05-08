"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/lib/actions/articles";
import { ArticleForm } from "./article-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Article {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  author: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function NewsClient({ data }: { data: Article[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const result = await deleteArticle(id);
    if (result.success) {
      toast.success("Article deleted");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete article");
    }
  };

  const columns: ColumnDef<Article>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            row.original.status === "published"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
          }`}
        >
          {row.original.status === "published" ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ArticleForm article={row.original} />
          <Button
            variant="destructive"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original.id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ArticleForm />
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search articles..."
      />
    </div>
  );
}
