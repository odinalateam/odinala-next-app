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
import { createListing, updateListing } from "@/lib/actions/listings";
import type { ListingWithCategory, Category } from "@/lib/types";
import { Plus, FileText, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
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
  const [listingType, setListingType] = useState(listing?.type ?? defaultType);
  const [status, setStatus] = useState(listing?.status ?? "Available");
  const [purchaseType, setPurchaseType] = useState(
    listing?.purchaseType ?? "one_off"
  );
  const [developmentStatus, setDevelopmentStatus] = useState(
    listing?.developmentStatus ?? "completed"
  );
  const [planStatus, setPlanStatus] = useState(listing?.planStatus ?? "");
  const [categoryId, setCategoryId] = useState(listing?.categoryId ?? "");
  const [images, setImages] = useState<string[]>(listing?.images ?? []);
  const [documents, setDocuments] = useState<string[]>(
    listing?.documents ?? []
  );
  const [applicationForm, setApplicationForm] = useState<string | null>(
    listing?.applicationFormUrl ?? null
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
      type: listingType,
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
      status,
      purchaseType,
      developmentStatus,
      planStatus: planStatus || null,
      maxInstallment:
        purchaseType === "recurring_plan" && formData.get("maxInstallment")
          ? parseInt(formData.get("maxInstallment") as string)
          : null,
      pricePerInstallment:
        purchaseType === "recurring_plan" &&
        formData.get("pricePerInstallment")
          ? parseFloat(formData.get("pricePerInstallment") as string)
          : null,
      categoryId: categoryId || null,
      applicationFormUrl: applicationForm,
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
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> indicates a required
            field
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input
                name="name"
                required
                defaultValue={listing?.name}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea
                name="description"
                required
                defaultValue={listing?.description}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price <span className="text-destructive">*</span></Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={listing?.price}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type <span className="text-destructive">*</span></Label>
              <Select value={listingType} onValueChange={(v) => setListingType(v ?? defaultType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Property">Property</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Location <span className="text-destructive">*</span></Label>
              <Input
                name="location"
                required
                defaultValue={listing?.location}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Address <span className="text-destructive">*</span></Label>
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
              <Label>Size (sqm) <span className="text-destructive">*</span></Label>
              <Input
                name="size"
                type="number"
                step="0.01"
                required
                defaultValue={listing?.size}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status <span className="text-destructive">*</span></Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "Available")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Under Offer">Under Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Purchase Type <span className="text-destructive">*</span></Label>
              <Select value={purchaseType} onValueChange={(v) => setPurchaseType(v ?? "one_off")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_off">One Off</SelectItem>
                  <SelectItem value="recurring_plan">Recurring Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Development Status <span className="text-destructive">*</span></Label>
              <Select value={developmentStatus} onValueChange={(v) => setDevelopmentStatus(v ?? "completed")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="uncompleted">Uncompleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Plan Status</Label>
              <Select value={planStatus} onValueChange={(v) => setPlanStatus(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="off_plan">Off-Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label>Images <span className="text-destructive">*</span></Label>
              <ImageUpload value={images} onChange={setImages} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Documents (PDF)</Label>
              <DocumentUpload value={documents} onChange={setDocuments} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Application Form (optional)</Label>
              {applicationForm ? (
                <div className="flex items-center gap-2 rounded-lg border border-input p-2">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a
                    href={applicationForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate"
                  >
                    Application Form
                  </a>
                  <button
                    type="button"
                    onClick={() => setApplicationForm(null)}
                    className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="applicationForm"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.serverData?.url) {
                      setApplicationForm(res[0].serverData.url);
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
                    label: "Upload application form",
                    allowedContent: "PDF up to 8MB",
                  }}
                />
              )}
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
