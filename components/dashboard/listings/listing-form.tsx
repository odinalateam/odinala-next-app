"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createListing, updateListing } from "@/lib/actions/listings";
import type { ListingWithCategory, Category } from "@/lib/types";
import { Plus } from "lucide-react";
import { ImageUpload } from "./image-upload";
import { DocumentUpload } from "./document-upload";

interface ListingFormProps {
  listing?: ListingWithCategory;
  categories: Category[];
  defaultType?: string;
}

export function ListingForm({
  listing,
  categories,
  defaultType = "Property",
}: ListingFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaseType, setPurchaseType] = useState(
    listing?.purchaseType ?? "one_off"
  );
  const [images, setImages] = useState<string[]>(listing?.images ?? []);
  const [documents, setDocuments] = useState<string[]>(
    listing?.documents ?? []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      type: formData.get("type") as string,
      bedrooms: formData.get("bedrooms")
        ? parseInt(formData.get("bedrooms") as string)
        : null,
      bathrooms: formData.get("bathrooms")
        ? parseInt(formData.get("bathrooms") as string)
        : null,
      size: parseFloat(formData.get("size") as string),
      features: (formData.get("features") as string)
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      images,
      documents,
      status: formData.get("status") as string,
      purchaseType: formData.get("purchaseType") as string,
      developmentStatus: formData.get("developmentStatus") as string,
      planStatus: (formData.get("planStatus") as string) || null,
      maxInstallment:
        purchaseType === "recurring_plan" && formData.get("maxInstallment")
          ? parseInt(formData.get("maxInstallment") as string)
          : null,
      pricePerInstallment:
        purchaseType === "recurring_plan" &&
        formData.get("pricePerInstallment")
          ? parseFloat(formData.get("pricePerInstallment") as string)
          : null,
      categoryId: (formData.get("categoryId") as string) || null,
    };

    try {
      if (listing) {
        await updateListing(listing.id, data);
      } else {
        await createListing(data);
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
          listing ? (
            <Button variant="outline" size="xs">
              Edit
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Listing
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {listing ? "Edit Listing" : "Create Listing"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Name</Label>
              <Input
                name="name"
                required
                defaultValue={listing?.name}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                name="description"
                required
                defaultValue={listing?.description}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={listing?.price}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select
                name="type"
                defaultValue={listing?.type ?? defaultType}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring dark:bg-input/30"
              >
                <option value="Property">Property</option>
                <option value="Land">Land</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                name="location"
                required
                defaultValue={listing?.location}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input
                name="address"
                required
                defaultValue={listing?.address}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bedrooms</Label>
              <Input
                name="bedrooms"
                type="number"
                defaultValue={listing?.bedrooms ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bathrooms</Label>
              <Input
                name="bathrooms"
                type="number"
                defaultValue={listing?.bathrooms ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Size (sqm)</Label>
              <Input
                name="size"
                type="number"
                step="0.01"
                required
                defaultValue={listing?.size}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                name="status"
                defaultValue={listing?.status ?? "Available"}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring dark:bg-input/30"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Under Offer">Under Offer</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Purchase Type</Label>
              <select
                name="purchaseType"
                defaultValue={listing?.purchaseType ?? "one_off"}
                onChange={(e) => setPurchaseType(e.target.value)}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring dark:bg-input/30"
              >
                <option value="one_off">One Off</option>
                <option value="recurring_plan">Recurring Plan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Development Status</Label>
              <select
                name="developmentStatus"
                defaultValue={listing?.developmentStatus ?? "completed"}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring dark:bg-input/30"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Plan Status</Label>
              <select
                name="planStatus"
                defaultValue={listing?.planStatus ?? ""}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring dark:bg-input/30"
              >
                <option value="">None</option>
                <option value="off_plan">Off-Plan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select
                name="categoryId"
                defaultValue={listing?.categoryId ?? ""}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring dark:bg-input/30"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {purchaseType === "recurring_plan" && (
              <>
                <div className="space-y-1.5">
                  <Label>Max Installment (months)</Label>
                  <Input
                    name="maxInstallment"
                    type="number"
                    defaultValue={listing?.maxInstallment ?? ""}
                    placeholder="e.g. 18"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Price Per Installment</Label>
                  <Input
                    name="pricePerInstallment"
                    type="number"
                    step="0.01"
                    defaultValue={listing?.pricePerInstallment ?? ""}
                    placeholder="e.g. 2800000"
                  />
                </div>
              </>
            )}
            <div className="col-span-2 space-y-1.5">
              <Label>Features (comma-separated)</Label>
              <Input
                name="features"
                defaultValue={listing?.features.join(", ")}
                placeholder="e.g. Swimming Pool, Garden, Parking"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Images</Label>
              <ImageUpload value={images} onChange={setImages} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Documents (PDF)</Label>
              <DocumentUpload value={documents} onChange={setDocuments} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : listing
                  ? "Update Listing"
                  : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
