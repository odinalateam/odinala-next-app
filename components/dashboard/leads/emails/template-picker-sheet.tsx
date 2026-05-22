"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEmailTemplates } from "@/lib/actions/email-templates";
import { sendBulkEmail } from "@/lib/actions/leads";
import { toast } from "sonner";
import { Mail, Plus, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { EmailTemplate } from "@prisma/client";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface TemplatePickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userIds: string[];
  onSuccess?: () => void;
}

export function TemplatePickerSheet({
  open,
  onOpenChange,
  userIds,
  onSuccess,
}: TemplatePickerSheetProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setLoadingTemplates(true);
    getEmailTemplates().then((data) => {
      setTemplates(data);
      setLoadingTemplates(false);
    });
  }, [open]);

  const selected = templates.find((t) => t.id === selectedId);

  const handleSend = async () => {
    if (!selectedId) return;
    setSending(true);
    const result = await sendBulkEmail({ userIds, templateId: selectedId });
    setSending(false);

    if (result.success) {
      toast.success(`Sent to ${result.sent} recipient${result.sent !== 1 ? "s" : ""}.`);
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to send.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4" />
            Choose a Template
          </SheetTitle>
          <SheetDescription className="text-xs">
            Sending to{" "}
            <span className="font-medium text-foreground">{userIds.length}</span>{" "}
            selected lead{userIds.length !== 1 ? "s" : ""}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loadingTemplates ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium mb-1">No templates yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Create a template first to send emails.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  router.push("/dashboard/leads/emails/new");
                }}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Template
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => {
                const isSelected = t.id === selectedId;
                const preview = stripHtml(t.body).slice(0, 100);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    className={cn(
                      "w-full text-left rounded-lg border p-3.5 transition-colors",
                      isSelected
                        ? "border-foreground bg-muted"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{t.name}</span>
                          {isSelected && (
                            <Badge className="h-4 px-1.5 text-[10px] gap-0.5">
                              <Check className="h-2.5 w-2.5" />
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">
                          Subject: {t.subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {preview}{t.body.length > 100 ? "…" : ""}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                          isSelected ? "border-foreground" : "border-muted-foreground"
                        )}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-foreground" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview + Send footer */}
        {selected && (
          <div className="border-t border-border px-5 py-4 space-y-3 bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">{selected.name}</span> →{" "}
                {userIds.length} recipient{userIds.length !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/leads/emails/${selected.id}/edit`)}
                className="text-foreground underline underline-offset-2 hover:no-underline"
              >
                Edit
              </button>
            </div>
            <Button
              className="w-full gap-1.5"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {sending ? "Sending…" : `Send to ${userIds.length} lead${userIds.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
