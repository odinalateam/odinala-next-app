"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteEmailTemplate } from "@/lib/actions/email-templates";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Mail } from "lucide-react";
import type { EmailTemplate } from "@prisma/client";
import { cn } from "@/lib/utils";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function TemplatesList({ templates }: { templates: EmailTemplate[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const result = await deleteEmailTemplate(id);
    setDeletingId(null);
    if (result.success) {
      toast.success("Template deleted.");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete.");
    }
  };

  if (!templates.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
        <Mail className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium mb-1">No templates yet</p>
        <p className="text-xs text-muted-foreground mb-4">
          Create your first email template to get started.
        </p>
        <Button
          size="sm"
          onClick={() => router.push("/dashboard/leads/emails/new")}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          New Template
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((t) => {
        const preview = stripHtml(t.body).slice(0, 120);
        return (
          <div
            key={t.id}
            className="group rounded-lg border border-border bg-card p-4 flex flex-col gap-3 hover:border-foreground/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{t.name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{t.subject}</p>
              </div>
              <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {preview}
              {t.body.length > 120 ? "…" : ""}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50 mt-auto">
              <p className="text-[11px] text-muted-foreground">
                Updated {new Date(t.updatedAt).toLocaleDateString()}
              </p>
              <div className={cn("flex gap-1 transition-opacity", "opacity-0 group-hover:opacity-100")}>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => router.push(`/dashboard/leads/emails/${t.id}/edit`)}
                  title="Edit template"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleDelete(t.id, t.name)}
                  disabled={deletingId === t.id}
                  className="text-destructive hover:text-destructive"
                  title="Delete template"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
