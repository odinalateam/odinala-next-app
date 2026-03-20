"use client";

import { FileText, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface DocumentUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function DocumentUpload({ value, onChange }: DocumentUploadProps) {
  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((url, i) => (
            <div
              key={url}
              className="flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2"
            >
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline truncate text-muted-foreground hover:text-foreground"
              >
                Document {i + 1}
              </a>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <UploadDropzone
        endpoint="listingDocuments"
        onClientUploadComplete={(res) => {
          onChange([...value, ...res.map((r) => r.serverData.url)]);
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
        appearance={{
          container: "border-border py-6",
          uploadIcon: "text-muted-foreground",
          label: "text-sm text-foreground",
          allowedContent: "text-xs text-muted-foreground",
          button: "bg-primary text-primary-foreground text-xs px-3 py-1.5 h-8",
        }}
        content={{
          uploadIcon: () => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-8 w-8"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          ),
          label: "Upload documents",
          allowedContent: "PDFs up to 8MB (max 5)",
        }}
      />
    </div>
  );
}
