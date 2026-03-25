"use client";

import { useState } from "react";
import {
  Package,
  CheckCircle2,
  FileText,
  ExternalLink,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  uploadProofOfPayment,
  uploadFilledApplicationForm,
} from "@/lib/actions/public-orders";
import type { Listing, Order, Category } from "@prisma/client";

type OrderWithListing = Order & {
  listing: Listing & {
    category: Category | null;
  };
};

function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent";
    case "Rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-transparent";
    case "Completed":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-transparent";
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-transparent";
    default:
      return "";
  }
}

const tabs = ["Properties", "Lands"] as const;

function ProofOfPaymentSection({ order }: { order: OrderWithListing }) {
  const [uploaded, setUploaded] = useState(!!order.proofOfPaymentUrl);
  const [uploading, setUploading] = useState(false);

  if (order.status === "Rejected") return null;

  // Hide until application form step is done (if applicable)
  if (
    order.listing.applicationFormUrl &&
    order.applicationFormReleased &&
    !order.filledApplicationFormUrl
  )
    return null;

  // Hide if form exists but hasn't been released yet
  if (order.listing.applicationFormUrl && !order.applicationFormReleased)
    return null;

  if (uploaded || order.proofOfPaymentUrl) {
    return (
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            Proof of payment uploaded
          </span>
          {order.proofOfPaymentUrl && (
            <a
              href={order.proofOfPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline ml-auto"
            >
              <FileText className="h-3.5 w-3.5" />
              View
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs text-muted-foreground mb-2">
        Upload proof of payment
      </p>
      {uploading ? (
        <p className="text-xs text-muted-foreground">Saving...</p>
      ) : (
        <UploadDropzone
          endpoint="proofOfPayment"
          onClientUploadComplete={async (res) => {
            if (res?.[0]?.serverData?.url) {
              setUploading(true);
              try {
                await uploadProofOfPayment(order.id, res[0].serverData.url);
                setUploaded(true);
              } catch (error) {
                console.error("Failed to upload proof of payment:", error);
                alert("Failed to save proof of payment. Please try again.");
              } finally {
                setUploading(false);
              }
            }
          }}
          onUploadError={(error) => {
            console.error("Upload error:", error);
            alert("Upload failed. Please try again.");
          }}
          appearance={{
            container: "border-border py-6",
            uploadIcon: "text-muted-foreground",
            label: "text-sm text-foreground",
            allowedContent: "text-xs text-muted-foreground",
            button: "bg-primary text-primary-foreground text-xs px-3 py-1.5 h-8 ut-ready:bg-primary ut-uploading:bg-primary/50",
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
            label: "Upload proof of payment",
            allowedContent: "Image or PDF (max 4MB)",
          }}
        />
      )}
    </div>
  );
}

function OrderProgressTracker({ order }: { order: OrderWithListing }) {
  if (order.status === "Rejected") return null;
  if (!order.applicationFormReleased) return null;

  const step1Complete = !!order.filledApplicationFormUrl;
  const step2Complete = !!order.proofOfPaymentUrl;

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs font-medium text-muted-foreground mb-3">
        Order Progress
      </p>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
              step1Complete
                ? "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-400"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {step1Complete ? <CheckCircle2 className="w-4 h-4" /> : "1"}
          </div>
          <span className="text-[10px] text-muted-foreground text-center max-w-[80px] leading-tight">
            Application Form
          </span>
        </div>

        <div
          className={cn(
            "flex-1 h-0.5 mt-3.5 rounded-full transition-colors",
            step1Complete
              ? "bg-emerald-500 dark:bg-emerald-400"
              : "bg-muted-foreground/20"
          )}
        />

        <div className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
              step2Complete
                ? "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-400"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {step2Complete ? <CheckCircle2 className="w-4 h-4" /> : "2"}
          </div>
          <span className="text-[10px] text-muted-foreground text-center max-w-[80px] leading-tight">
            Proof of Payment
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationFormSection({ order }: { order: OrderWithListing }) {
  const [uploaded, setUploaded] = useState(!!order.filledApplicationFormUrl);
  const [uploading, setUploading] = useState(false);

  if (!order.applicationFormReleased || !order.listing.applicationFormUrl)
    return null;
  if (order.status === "Rejected") return null;

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs text-muted-foreground mb-2">
        Step 1: Application Form
      </p>

      <a
        href={order.listing.applicationFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-primary hover:underline mb-3"
      >
        <Download className="h-3.5 w-3.5" />
        Download Application Form
        <ExternalLink className="h-3 w-3" />
      </a>

      {uploaded || order.filledApplicationFormUrl ? (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            Filled form uploaded
          </span>
          {order.filledApplicationFormUrl && (
            <a
              href={order.filledApplicationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline ml-auto"
            >
              <FileText className="h-3.5 w-3.5" />
              View
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-2">
            Upload filled application form
          </p>
          {uploading ? (
            <p className="text-xs text-muted-foreground">Saving...</p>
          ) : (
            <UploadDropzone
              endpoint="filledApplicationForm"
              onClientUploadComplete={async (res) => {
                if (res?.[0]?.serverData?.url) {
                  setUploading(true);
                  try {
                    await uploadFilledApplicationForm(
                      order.id,
                      res[0].serverData.url
                    );
                    setUploaded(true);
                  } catch (error) {
                    console.error("Failed to upload filled form:", error);
                    alert("Failed to save filled form. Please try again.");
                  } finally {
                    setUploading(false);
                  }
                }
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
                alert("Upload failed. Please try again.");
              }}
              appearance={{
                container: "border-border py-6",
                uploadIcon: "text-muted-foreground",
                label: "text-sm text-foreground",
                allowedContent: "text-xs text-muted-foreground",
                button:
                  "bg-primary text-primary-foreground text-xs px-3 py-1.5 h-8 ut-ready:bg-primary ut-uploading:bg-primary/50",
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
                label: "Upload filled application form",
                allowedContent: "PDF or Image (max 8MB)",
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export function UserOrdersList({ orders }: { orders: OrderWithListing[] }) {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Properties");

  const filtered = orders.filter((o) =>
    activeTab === "Properties"
      ? o.listing.type === "Property"
      : o.listing.type === "Land"
  );

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
              activeTab === tab
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Package className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No orders yet</p>
          <p className="text-xs mt-1 opacity-60">
            Your {activeTab.toLowerCase()} orders will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="border border-border rounded-lg p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {order.listing.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.listing.location}
                  </p>
                  {order.listing.category && (
                    <span className="inline-block text-xs text-muted-foreground mt-1">
                      {order.listing.category.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {formatPrice(order.listing.price)}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-transparent bg-secondary text-secondary-foreground"
                  >
                    {order.paymentOption === "installment"
                      ? `Installment (${order.installmentMonths}mo)`
                      : "Outright"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <OrderProgressTracker order={order} />
              <ApplicationFormSection order={order} />
              <ProofOfPaymentSection order={order} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
