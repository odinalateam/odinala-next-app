"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteEmailTemplate } from "@/lib/actions/email-templates";
import { toast } from "sonner";
import { Mail, Pencil, Trash2 } from "lucide-react";
import type { EmailTemplate } from "@prisma/client";

export function AgentTemplatesList({ templates }: { templates: EmailTemplate[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete agent template "${name}"? This cannot be undone.`)) return;
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

  if (!templates.length) return null;

  return (
    <>
      {templates.map((t) => {
        const preview = t.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
        return (
          <div
            key={t.id}
            className="group rounded-lg border border-amber-200 bg-amber-50/40 p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    [AGENT: CONTENT ANGLE]
                  </span>
                </div>
                <p className="font-medium text-sm truncate">{t.name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{t.subject}</p>
              </div>
              <Mail className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {preview}{t.body.length > 120 ? "…" : ""}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-200/60 mt-auto">
              <p className="text-[11px] text-muted-foreground">
                Generated {new Date(t.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </>
  );
}
