"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicListings(filters?: {
  type?: string;
  status?: string;
}) {
  return prisma.listing.findMany({
    where: {
      ...(filters?.type && { type: filters.type }),
      ...(filters?.status ? { status: filters.status } : { status: "Available" }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublicListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: { category: true },
  });
}
