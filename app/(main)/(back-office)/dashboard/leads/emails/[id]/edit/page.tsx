import { notFound } from "next/navigation";
import { getEmailTemplate } from "@/lib/actions/email-templates";
import { TemplateEditor } from "@/components/dashboard/leads/emails/template-editor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Template | Dashboard",
};

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await getEmailTemplate(id);

  if (!template) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Edit Template</h1>
        <p className="text-sm text-muted-foreground mt-1">{template.name}</p>
      </div>
      <TemplateEditor template={template} />
    </div>
  );
}
