"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bed,
  Bath,
  Ruler,
  MapPin,
  FileText,
  CheckCircle,
  Scale,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { createOrder } from "@/lib/actions/public-orders";
import { formatPrice } from "@/lib/format";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ListingWithCategory } from "@/lib/types";
import { useCompare } from "@/lib/compare-context";

const gradients = [
  "from-emerald-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-blue-400 to-indigo-500",
  "from-teal-400 to-emerald-500",
  "from-fuchsia-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-lime-400 to-green-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-teal-500",
];

function getStatusColor(status: string) {
  switch (status) {
    case "Available":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Sold":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  }
}

function getDevStatusLabel(status: string) {
  switch (status) {
    case "ongoing":
      return "ONGOING";
    case "completed":
      return "COMPLETED";
    case "uncompleted":
      return "UNCOMPLETED";
    default:
      return status.toUpperCase();
  }
}

function getDevStatusColor(status: string) {
  switch (status) {
    case "ongoing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "uncompleted":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

interface Props {
  listing: ListingWithCategory;
  kycVerified?: boolean;
}

export function PropertyDetailClient({ listing, kycVerified = false }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toggleItem, isInCompare, isFull } = useCompare();
  const inCompare = isInCompare(listing.id);
  const [paymentOption, setPaymentOption] = useState<"outright" | "installment">(
    "outright"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const hasImages = listing.images.length > 0;
  const gradientIndex =
    Math.abs(listing.id.charCodeAt(0)) % gradients.length;

  const handleSendRequest = async () => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createOrder({
        listingId: listing.id,
        paymentOption,
        installmentMonths:
          paymentOption === "installment" ? listing.maxInstallment : null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto w-full px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      {/* Image Section */}
      {hasImages ? (
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={listing.images[selectedImage]}
              alt={listing.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {listing.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    i === selectedImage
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gradient-to-br ${gradients[gradientIndex]}`}
        />
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 mt-6 flex-wrap">
        <span
          className={`text-xs font-semibold uppercase rounded-full px-3 py-1 ${getDevStatusColor(listing.developmentStatus)}`}
        >
          {getDevStatusLabel(listing.developmentStatus)}
        </span>
        {listing.planStatus === "off_plan" && (
          <span className="text-xs font-semibold uppercase rounded-full px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            OFF-PLAN
          </span>
        )}
        {listing.type === "Property" && (
          <Button
            variant={inCompare ? "default" : "outline"}
            size="sm"
            onClick={() => toggleItem(listing)}
            disabled={!inCompare && isFull}
            className="ml-auto"
          >
            <Scale className="w-4 h-4" />
            {inCompare ? "Remove from Compare" : isFull ? "Compare Full" : "Add to Compare"}
          </Button>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="border border-border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {listing.name}
                </h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {listing.address}
                </p>
              </div>
              <p className="text-2xl font-bold whitespace-nowrap">
                {formatPrice(listing.price)}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Specs */}
            <div className="flex flex-wrap gap-6">
              {listing.bedrooms != null && (
                <div className="flex items-center gap-2 text-sm">
                  <Bed className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">{listing.bedrooms}</p>
                  </div>
                </div>
              )}
              {listing.bathrooms != null && (
                <div className="flex items-center gap-2 text-sm">
                  <Bath className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">{listing.bathrooms}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="font-medium">{listing.size} sqm</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <span className="inline-block text-xs font-medium bg-secondary text-secondary-foreground rounded-full px-3 py-1 mb-3">
                Purchase type:{" "}
                {listing.purchaseType === "recurring_plan"
                  ? "Recurring Plan"
                  : "One Off"}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Features */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {listing.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs font-medium bg-secondary text-secondary-foreground rounded-full px-3 py-1"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Category */}
            {listing.category && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="text-lg font-semibold mb-3">Category</h2>
                  <span className="text-xs font-medium bg-secondary text-secondary-foreground rounded-full px-3 py-1">
                    {listing.category.name}
                  </span>
                </div>
              </>
            )}

            {/* Documents */}
            {listing.documents.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="text-lg font-semibold mb-3">Documents</h2>
                  <div className="space-y-2">
                    {listing.documents.map((doc, i) => (
                      <a
                        key={doc}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Document {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Sidebar */}
        {!listing.isVisible ? (
          <div className="lg:w-80 shrink-0">
            <div className="border border-border rounded-lg p-6 sticky top-20 text-center">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-lg">!</span>
                </div>
                <p className="font-medium">This listing is currently unavailable</p>
                <p className="text-sm text-muted-foreground">
                  For inquiries, please contact us at{" "}
                  <a
                    href="mailto:odinalainvest@gmail.com"
                    className="text-primary underline font-medium"
                  >
                    odinalainvest@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : listing.status === "Available" && (
          <div className="lg:w-80 shrink-0">
            <div className="border border-border rounded-lg p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-center mb-4">
                Payment option
              </h3>

              {success ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                  <p className="font-medium">Request sent!</p>
                  <p className="text-sm text-muted-foreground">
                    Your request has been submitted. We&apos;ll get back to you
                    shortly.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose a payment option
                  </p>

                  {/* Outright Payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption("outright")}
                    className={`w-full flex items-center gap-3 rounded-lg border p-4 mb-3 text-left transition-colors cursor-pointer ${
                      paymentOption === "outright"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                        paymentOption === "outright"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/40"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      Outright payment
                    </span>
                  </button>

                  {/* Installment Payment - only for recurring_plan */}
                  {listing.purchaseType === "recurring_plan" && (
                    <>
                      <h4 className="text-sm font-medium mt-4 mb-2">
                        Payment plans
                      </h4>
                      <div className="text-xs text-muted-foreground flex justify-between mb-2 px-1">
                        <span>Installments</span>
                        <span>Price Per Installment</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentOption("installment")}
                        className={`w-full flex items-center justify-between gap-3 rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                          paymentOption === "installment"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                              paymentOption === "installment"
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40"
                            }`}
                          />
                          <span className="text-sm font-semibold">
                            {listing.maxInstallment} MONTHS
                          </span>
                        </div>
                        {listing.pricePerInstallment && (
                          <span className="text-sm font-medium">
                            {formatPrice(listing.pricePerInstallment)}
                          </span>
                        )}
                      </button>
                    </>
                  )}

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                      {error}
                    </p>
                  )}

                  {session && !kycVerified && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Complete your{" "}
                        <Link
                          href="/my-account"
                          className="underline font-medium"
                        >
                          KYC verification
                        </Link>{" "}
                        to place orders.
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={handleSendRequest}
                    disabled={submitting || (!!session && !kycVerified)}
                  >
                    {submitting
                      ? "Sending..."
                      : !session
                        ? "Sign in to continue"
                        : !kycVerified
                          ? "Complete KYC to continue"
                          : "Send request"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
