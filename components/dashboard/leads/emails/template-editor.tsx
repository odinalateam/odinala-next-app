"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichEditor } from "./rich-editor";
import { createEmailTemplate, updateEmailTemplate } from "@/lib/actions/email-templates";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { EmailTemplate } from "@prisma/client";

interface TemplateEditorProps {
  template?: EmailTemplate;
}

export function TemplateEditor({ template }: TemplateEditorProps) {
  const router = useRouter();
  const isEdit = !!template;

  const [name, setName] = useState(template?.name ?? "");
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [body, setBody] = useState(template?.body ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Please enter a template name."); return; }
    if (!subject.trim()) { toast.error("Please enter an email subject."); return; }
    if (!body || body === "<p></p>") { toast.error("Please write the email body."); return; }

    setLoading(true);
    const data = { name: name.trim(), subject: subject.trim(), body };

    const result = isEdit
      ? await updateEmailTemplate(template.id, data)
      : await createEmailTemplate(data);

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Template updated." : "Template created.");
      router.push("/dashboard/leads/emails");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            placeholder="e.g. Hot Lead Follow-up"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Internal name — not visible to recipients.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="template-subject">Email Subject</Label>
          <Input
            id="template-subject"
            placeholder="e.g. A property opportunity just for you"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Email Body</Label>
        <RichEditor
          value={body}
          onChange={setBody}
          placeholder="Write the email content here. Use {{name}} to personalise the greeting."
          minHeight="320px"
        />
        <p className="text-xs text-muted-foreground">
          The recipient&apos;s name is automatically added as a greeting above your content.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={loading} className="gap-1.5">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create Template"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/leads/emails")}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
