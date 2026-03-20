import {
  getPublicListings,
  getAvailableFeatures,
} from "@/lib/actions/public-listings";
import { PropertyGrid } from "@/components/property-grid";
import { PropertyFilters } from "@/components/properties/property-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties | Odinala",
  description: "Browse available properties across South-East Nigeria",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const features =
    typeof params.features === "string"
      ? params.features.split(",").filter(Boolean)
      : [];

  const filters = {
    type: "Property" as const,
    search: typeof params.q === "string" ? params.q : undefined,
    developmentStatus:
      typeof params.developmentStatus === "string"
        ? params.developmentStatus
        : undefined,
    purchaseType:
      typeof params.purchaseType === "string"
        ? params.purchaseType
        : undefined,
    features: features.length > 0 ? features : undefined,
    minPrice:
      typeof params.minPrice === "string"
        ? parseFloat(params.minPrice)
        : undefined,
    maxPrice:
      typeof params.maxPrice === "string"
        ? parseFloat(params.maxPrice)
        : undefined,
  };

  const [listings, availableFeatures] = await Promise.all([
    getPublicListings(filters),
    getAvailableFeatures(),
  ]);

  return (
    <main className="max-w-6xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse properties across South-East Nigeria
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <PropertyFilters availableFeatures={availableFeatures} />
        </aside>

        <div className="flex-1 min-w-0">
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">
                No properties found matching your filters.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {listings.length}{" "}
                {listings.length === 1 ? "property" : "properties"} found
              </p>
              <PropertyGrid properties={listings} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
