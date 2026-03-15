"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("You must be logged in");
  }
  return session;
}

export async function createOrder(data: {
  listingId: string;
  paymentOption: string;
  installmentMonths?: number | null;
  notes?: string;
}) {
  const session = await requireAuth();

  const listing = await prisma.listing.findUnique({
    where: { id: data.listingId },
  });
  if (!listing) throw new Error("Listing not found");
  if (listing.status !== "Available")
    throw new Error("Listing is not available");

  if (data.paymentOption === "installment") {
    if (listing.purchaseType !== "recurring_plan") {
      throw new Error("This listing does not support installment payments");
    }
    if (!data.installmentMonths || !listing.maxInstallment) {
      throw new Error("Invalid installment configuration");
    }
    if (data.installmentMonths > listing.maxInstallment) {
      throw new Error("Installment months exceed maximum allowed");
    }
  }

  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      listingId: data.listingId,
      status: "Pending",
    },
  });
  if (existingOrder) {
    throw new Error("You already have a pending request for this listing");
  }

  await prisma.order.create({
    data: {
      userId: session.user.id,
      listingId: data.listingId,
      paymentOption: data.paymentOption,
      installmentMonths:
        data.paymentOption === "installment" ? data.installmentMonths : null,
      notes: data.notes,
    },
  });

  revalidatePath(`/properties/${data.listingId}`);
  revalidatePath("/my-account/orders");
  revalidatePath("/dashboard/orders");
}

export async function getUserOrders() {
  const session = await requireAuth();

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: { listing: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });
}
