"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bot, Copy, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEmailTemplate } from "@/lib/actions/email-templates";
import type { OutreachResult } from "@/lib/agents/prompts/outreach-generator";

function EmailCard({
  label,
  email,
  prospectName,
  onSave,
}: {
  label: string;
  email: { subject: string; body: string };
  prospectName: string;
  onSave: () => void;
}) {
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          Subject
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm flex-1 bg-muted/50 rounded px-3 py-2 leading-relaxed">
            {email.subject}
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => copyText(email.subject)}
            title="Copy subject"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          Email body
        </p>
        <div className="relative">
          <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed bg-muted/50 rounded px-3 py-2 pr-10">
            {email.body}
          </pre>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={() => copyText(email.body)}
            title="Copy body"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Button size="sm" variant="outline" className="w-full" onClick={onSave}>
        Save as template
      </Button>
    </div>
  );
}

export function GenerateOutreachSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutreachResult | null>(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    profession: "",
    milestone: "",
    nigeriaConnection: "",
  });

  const handleGenerate = async () => {
    if (!form.name || !form.location || !form.profession) {
      toast.error("Name, location, and profession are required.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/agents/generate-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Generation failed");
      }

      const data: OutreachResult = await res.json();
      setResult(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate emails",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    type: "legacy" | "investment" | "easeAndTrust",
    label: string,
  ) => {
    if (!result) return;
    const email = result[type];
    const res = await createEmailTemplate({
      name: `${form.name} — ${label} Outreach`,
      subject: email.subject,
      body: email.body.replace(/\n/g, "<br>"),
    });
    if (res.success) {
      toast.success("Template saved.");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to save template.");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      location: "",
      profession: "",
      milestone: "",
      nigeriaConnection: "",
    });
    setResult(null);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <SheetTrigger
        render={
          <Button size="sm" variant="outline" disabled className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI Outreach hhhh
          </Button>
        }
      />

      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-amber-600" />
            <SheetTitle>Generate Outreach Emails</SheetTitle>
          </div>
          <SheetDescription>
            Enter prospect details and Claude will generate 3 personalised
            diaspora outreach emails for Afrova.io.
          </SheetDescription>
        </SheetHeader>

        {/* Prospect form */}
        {!result && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name *</Label>
              <Input
                id="name"
                placeholder="e.g. Chioma Adeyemi"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Manchester, UK"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                placeholder="e.g. NHS Doctor, Software Engineer"
                value={form.profession}
                onChange={(e) =>
                  setForm((f) => ({ ...f, profession: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="milestone">Recent milestone / notes</Label>
              <Input
                id="milestone"
                placeholder="e.g. Recently promoted to Senior Consultant"
                value={form.milestone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, milestone: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nigeriaConnection">Nigeria connection</Label>
              <Textarea
                id="nigeriaConnection"
                placeholder="e.g. From Lagos, family in Abuja, mentions building a home"
                value={form.nigeriaConnection}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nigeriaConnection: e.target.value }))
                }
                rows={2}
              />
            </div>

            <Button
              className="w-full gap-2 mt-2"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate emails
                </>
              )}
            </Button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                3 emails generated for{" "}
                <span className="text-foreground">{form.name}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResult(null)}
                className="text-xs h-7"
              >
                New prospect
              </Button>
            </div>

            <Tabs defaultValue="legacy">
              <TabsList className="w-full">
                <TabsTrigger value="legacy" className="flex-1 text-xs">
                  Legacy
                </TabsTrigger>
                <TabsTrigger value="investment" className="flex-1 text-xs">
                  Investment
                </TabsTrigger>
                <TabsTrigger value="easeAndTrust" className="flex-1 text-xs">
                  Ease & Trust
                </TabsTrigger>
              </TabsList>

              <TabsContent value="legacy" className="mt-4">
                <EmailCard
                  label="Legacy & Family"
                  email={result.legacy}
                  prospectName={form.name}
                  onSave={() => handleSave("legacy", "Legacy & Family")}
                />
              </TabsContent>

              <TabsContent value="investment" className="mt-4">
                <EmailCard
                  label="Investment & Yield"
                  email={result.investment}
                  prospectName={form.name}
                  onSave={() => handleSave("investment", "Investment & Yield")}
                />
              </TabsContent>

              <TabsContent value="easeAndTrust" className="mt-4">
                <EmailCard
                  label="Ease & Trust"
                  email={result.easeAndTrust}
                  prospectName={form.name}
                  onSave={() => handleSave("easeAndTrust", "Ease & Trust")}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
