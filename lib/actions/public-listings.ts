"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicListings(filters?: {
  type?: string;
  status?: string;
  search?: string;
  developmentStatus?: string;
  purchaseType?: string;
  features?: string[];
  minPrice?: number;
  maxPrice?: number;
}) {
  return prisma.listing.findMany({
    where: {
      isVisible: true,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.status ? { status: filters.status } : { status: "Available" }),
      ...(filters?.developmentStatus && {
        developmentStatus: filters.developmentStatus,
      }),
      ...(filters?.purchaseType && { purchaseType: filters.purchaseType }),
      ...(filters?.features &&
        filters.features.length > 0 && {
          features: { hasEvery: filters.features },
        }),
      ...((filters?.minPrice !== undefined || filters?.maxPrice !== undefined) && {
        price: {
          ...(filters?.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters?.maxPrice !== undefined && { lte: filters.maxPrice }),
        },
      }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" as const } },
          { location: { contains: filters.search, mode: "insensitive" as const } },
          { address: { contains: filters.search, mode: "insensitive" as const } },
        ],
      }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAvailableFeatures(): Promise<string[]> {
  const listings = await prisma.listing.findMany({
    where: { status: "Available", type: "Property", isVisible: true },
    select: { features: true },
  });
  const featureSet = new Set<string>();
  for (const listing of listings) {
    for (const f of listing.features) {
      featureSet.add(f);
    }
  }
  return Array.from(featureSet).sort();
}

export async function getPublicListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: { category: true },
  });
}
