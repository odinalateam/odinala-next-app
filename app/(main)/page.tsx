import { getPublicListings } from "@/lib/actions/public-listings";
import { PropertyGrid } from "@/components/property-grid";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;

  const listings = await getPublicListings({ search });

  return (
    <main className="max-w-6xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {search ? `Results for "${search}"` : "Featured Listings"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Discover properties and land across South-East Nigeria
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            No listings found{search ? ` for "${search}"` : ""}.
          </p>
        </div>
      ) : (
        <PropertyGrid properties={listings} />
      )}
    </main>
  );
}
