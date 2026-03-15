"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import type { Category } from "@/lib/types";
import { Plus } from "lucide-react";

export function CategoryForm({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
    };

    try {
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
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
          category ? (
            <Button variant="outline" size="xs">
              Edit
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              name="name"
              required
              defaultValue={category?.name}
              placeholder="Category name"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              name="type"
              defaultValue={category?.type ?? "Property"}
              className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring dark:bg-input/30"
            >
              <option value="Property">Property</option>
              <option value="Land">Land</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
