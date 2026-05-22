import { getEmailTemplates } from "@/lib/actions/email-templates";
import { TemplatesList } from "@/components/dashboard/leads/emails/templates-list";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Templates | Dashboard",
};

export default async function EmailTemplatesPage() {
  const templates = await getEmailTemplates();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Email Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage reusable email templates for your leads.
          </p>
        </div>
        <Link
          href="/dashboard/leads/emails/new"
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-foreground text-background px-3 py-1.5 rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Template
        </Link>
      </div>
      <TemplatesList templates={templates} />
    </div>
  );
}
