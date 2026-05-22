"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendBulkEmail } from "@/lib/actions/leads";
import { toast } from "sonner";
import { Mail } from "lucide-react";

interface BulkEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userIds: string[];
  onSuccess?: () => void;
}

export function BulkEmailDialog({ open, onOpenChange, userIds, onSuccess }: BulkEmailDialogProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!subject.trim()) { toast.error("Please enter a subject."); return; }
    if (!body.trim()) { toast.error("Please enter a message."); return; }

    setLoading(true);
    const result = await sendBulkEmail({ userIds, subject: subject.trim(), body: body.trim() });
    setLoading(false);

    if (result.success) {
      toast.success(`Email sent to ${result.sent} user${result.sent !== 1 ? "s" : ""}.`);
      setSubject("");
      setBody("");
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to send emails.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email
          </DialogTitle>
          <DialogDescription>
            Sending to {userIds.length} selected lead{userIds.length !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              placeholder="e.g. Exclusive property opportunity for you"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email-body">Message</Label>
            <Textarea
              id="email-body"
              placeholder="Write your message here..."
              rows={7}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={loading || !subject.trim() || !body.trim()}>
              {loading ? "Sending..." : `Send to ${userIds.length}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
