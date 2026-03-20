"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden border border-border"
            >
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <UploadDropzone
        endpoint="listingImages"
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
          label: "Upload images",
          allowedContent: "Images up to 4MB (max 10)",
        }}
      />
    </div>
  );
}
