"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getListings() {
  await requireAdmin();
  return prisma.listing.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createListing(data: {
  name: string;
  description: string;
  price: number;
  location: string;
  address: string;
  type: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size: number;
  features: string[];
  images: string[];
  documents: string[];
  status: string;
  purchaseType: string;
  developmentStatus: string;
  planStatus?: string | null;
  maxInstallment?: number | null;
  pricePerInstallment?: number | null;
  categoryId?: string | null;
}) {
  await requireAdmin();
  await prisma.listing.create({ data });
  revalidatePath("/dashboard/listings");
  revalidatePath("/");
}

export async function updateListing(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
    location: string;
    address: string;
    type: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    size: number;
    features: string[];
    images: string[];
    documents: string[];
    status: string;
    purchaseType: string;
    developmentStatus: string;
    planStatus?: string | null;
    maxInstallment?: number | null;
    pricePerInstallment?: number | null;
    categoryId?: string | null;
  }
) {
  await requireAdmin();
  await prisma.listing.update({ where: { id }, data });
  revalidatePath("/dashboard/listings");
  revalidatePath("/");
}

export async function deleteListing(id: string) {
  await requireAdmin();
  await prisma.listing.delete({ where: { id } });
  revalidatePath("/dashboard/listings");
  revalidatePath("/");
}

export async function toggleListingVisibility(id: string, isVisible: boolean) {
  await requireAdmin();
  await prisma.listing.update({
    where: { id },
    data: { isVisible },
  });
  revalidatePath("/dashboard/listings");
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/lands");
}
