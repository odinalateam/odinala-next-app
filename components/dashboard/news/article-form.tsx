"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createArticle, updateArticle } from "@/lib/actions/articles";
import { Plus, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface Article {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  author: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ArticleFormProps {
  article?: Article;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [coverImage, setCoverImage] = useState<string | null>(
    article?.coverImage ?? null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      coverImage,
      author: formData.get("author") as string,
      status,
    };

    try {
      if (article) {
        await updateArticle(article.id, data);
      } else {
        await createArticle(data);
      }
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          article ? (
            <Button variant="outline" size="xs">
              Edit
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Article
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? "Edit Article" : "Create Article"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> indicates a required
            field
          </p>
          <div className="space-y-1.5">
            <Label>
              Title <span className="text-destructive">*</span>
            </Label>
            <Input name="title" required defaultValue={article?.title} />
          </div>
          <div className="space-y-1.5">
            <Label>
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              name="content"
              required
              rows={8}
              defaultValue={article?.content}
              placeholder="Write your article content here..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Author <span className="text-destructive">*</span>
            </Label>
            <Input
              name="author"
              required
              defaultValue={article?.author}
              placeholder="e.g. Odinala Team"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Status <span className="text-destructive">*</span>
            </Label>
            <Select value={status} onValueChange={(v) => setStatus(v ?? "draft")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Cover Image</Label>
            {coverImage ? (
              <div className="relative rounded-lg border border-input overflow-hidden">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="listingImages"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.serverData?.url) {
                    setCoverImage(res[0].serverData.url);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  container: "border-border py-4",
                  uploadIcon: "text-muted-foreground",
                  label: "text-sm text-foreground",
                  allowedContent: "text-xs text-muted-foreground",
                  button:
                    "bg-primary text-primary-foreground text-xs px-3 py-1.5 h-8 ut-ready:bg-primary ut-uploading:bg-primary/50",
                }}
                content={{
                  label: "Upload cover image",
                  allowedContent: "Image up to 4MB",
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : article
                  ? "Update Article"
                  : "Create Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
