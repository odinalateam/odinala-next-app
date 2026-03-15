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
          onChange([...value, ...res.map((r) => r.ufsUrl)]);
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
