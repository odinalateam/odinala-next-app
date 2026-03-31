import { getPublicListings } from "@/lib/actions/public-listings";
import { PropertyGrid } from "@/components/property-grid";
import { HeroSection } from "@/components/home/hero-section";
import { ValuePropositions } from "@/components/home/value-propositions";
import { CompetitiveEdge } from "@/components/home/competitive-edge";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;

  const listings = await getPublicListings({ search });

  return (
    <main>
      {!search && <HeroSection />}

      {!search && <ValuePropositions />}

      <div className="max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {search ? `Results for "${search}"` : "Featured Listings"}
          </h2>
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
          <PropertyGrid properties={listings.slice(0, 6)} />
        )}
      </div>

      {!search && (
        <>
          <CompetitiveEdge />
          <HowItWorks />
          <Testimonials />
        </>
      )}
    </main>
  );
}
