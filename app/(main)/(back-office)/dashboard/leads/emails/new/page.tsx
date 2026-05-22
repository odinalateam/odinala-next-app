import { TemplateEditor } from "@/components/dashboard/leads/emails/template-editor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Template | Dashboard",
};

export default function NewTemplatePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">New Template</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a reusable email template for your leads.
        </p>
      </div>
      <TemplateEditor />
    </div>
  );
}
