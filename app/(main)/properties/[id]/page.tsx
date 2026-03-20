import { notFound } from "next/navigation";
import { getPublicListingById } from "@/lib/actions/public-listings";
import { PropertyDetailClient } from "@/components/property-detail-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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

  let kycVerified = false;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session) {
      const profile = await prisma.userProfile.findUnique({
        where: { userId: session.user.id },
        select: { kycStatus: true },
      });
      kycVerified = profile?.kycStatus === "verified";
    }
  } catch {
    // Not logged in
  }

  return <PropertyDetailClient listing={listing} kycVerified={kycVerified} />;
}
