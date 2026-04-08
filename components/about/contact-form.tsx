"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContactForm } from "@/lib/actions/contact";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const subjects = [
  "General Inquiry",
  "Investment Opportunity",
  "Partnership",
  "Other",
];

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [subject, setSubject] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContactForm({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: subject as string,
        message: formData.get("message") as string,
      });

      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
      setSubject(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          required
          minLength={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Select value={subject} onValueChange={setSubject} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="How can we help?"
          required
          minLength={10}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
