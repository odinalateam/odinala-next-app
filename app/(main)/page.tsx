import { getPublicListings } from "@/lib/actions/public-listings";
import { PropertyGrid } from "@/components/property-grid";

export default async function Home() {
  const listings = await getPublicListings();

  return (
    <main className="max-w-6xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Featured Listings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Discover properties and land across South-East Nigeria
        </p>
      </div>

      <PropertyGrid properties={listings} />
    </main>
  );
}
