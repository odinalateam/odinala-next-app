import { getPublicListings } from "@/lib/actions/public-listings";
import { PropertyGrid } from "@/components/property-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lands | Odinala",
  description: "Browse available land across Nigeria",
};

export default async function LandsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const listings = await getPublicListings({
    type: "Land",
    search: typeof params.q === "string" ? params.q : undefined,
  });

  return (
    <main className="max-w-6xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Lands</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse land listings across Nigeria
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            No land listings found.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {listings.length}{" "}
            {listings.length === 1 ? "listing" : "listings"} found
          </p>
          <PropertyGrid properties={listings} />
        </>
      )}
    </main>
  );
}
