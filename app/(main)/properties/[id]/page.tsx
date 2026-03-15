import { notFound } from "next/navigation";
import { getPublicListingById } from "@/lib/actions/public-listings";
import { PropertyDetailClient } from "@/components/property-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getPublicListingById(id);
  if (!listing) return { title: "Property Not Found" };
  return {
    title: `${listing.name} | Odinala`,
    description: listing.description,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getPublicListingById(id);
  if (!listing) notFound();

  return <PropertyDetailClient listing={listing} />;
}
