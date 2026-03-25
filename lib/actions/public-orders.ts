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

  // KYC guard
  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile || profile.kycStatus !== "verified") {
    throw new Error(
      "Please complete your KYC verification before placing an order"
    );
  }

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

export async function uploadFilledApplicationForm(
  orderId: string,
  url: string
) {
  const session = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== session.user.id) throw new Error("Unauthorized");
  if (!order.applicationFormReleased) {
    throw new Error("Application form has not been released yet");
  }
  if (order.status === "Rejected") {
    throw new Error("Cannot upload form for a rejected order");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { filledApplicationFormUrl: url },
  });

  revalidatePath("/my-account/orders");
  revalidatePath("/dashboard/orders");
}

export async function uploadProofOfPayment(orderId: string, url: string) {
  const session = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order) throw new Error("Order not found");
  if (order.userId !== session.user.id) throw new Error("Unauthorized");
  if (order.status === "Rejected") {
    throw new Error("Cannot upload proof for a rejected order");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { proofOfPaymentUrl: url },
  });

  revalidatePath("/my-account/orders");
  revalidatePath("/dashboard/orders");
}
