"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendEmail, sendAdminEmail, APP_URL } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { AdminNewOrderEmail } from "@/emails/admin-new-order";
import { AdminApplicationSubmittedEmail } from "@/emails/admin-application-submitted";
import { AdminProofOfPaymentEmail } from "@/emails/admin-proof-of-payment";

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

  const order = await prisma.order.create({
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

  await sendEmail({
    to: session.user.email,
    subject: "Order Confirmation - Odinala",
    react: OrderConfirmationEmail({
      userName: session.user.name,
      listingName: listing.name,
      listingLocation: listing.location,
      price: formatPrice(listing.price),
      paymentOption: data.paymentOption,
      installmentMonths: data.installmentMonths ?? null,
      orderId: order.id,
      appUrl: APP_URL,
    }),
  });

  await sendAdminEmail({
    subject: `New Order: ${listing.name} - Odinala`,
    react: AdminNewOrderEmail({
      userName: session.user.name,
      userEmail: session.user.email,
      listingName: listing.name,
      listingLocation: listing.location,
      price: formatPrice(listing.price),
      paymentOption: data.paymentOption,
      installmentMonths: data.installmentMonths ?? null,
      orderId: order.id,
      appUrl: APP_URL,
    }),
  });
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

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { filledApplicationFormUrl: url },
    include: { listing: true },
  });

  revalidatePath("/my-account/orders");
  revalidatePath("/dashboard/orders");

  await sendAdminEmail({
    subject: `Application Form Submitted: ${updatedOrder.listing.name} - Odinala`,
    react: AdminApplicationSubmittedEmail({
      userName: session.user.name,
      userEmail: session.user.email,
      listingName: updatedOrder.listing.name,
      orderId,
      appUrl: APP_URL,
    }),
  });
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

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { proofOfPaymentUrl: url },
    include: { listing: true },
  });

  revalidatePath("/my-account/orders");
  revalidatePath("/dashboard/orders");

  await sendAdminEmail({
    subject: `Proof of Payment Uploaded: ${updatedOrder.listing.name} - Odinala`,
    react: AdminProofOfPaymentEmail({
      userName: session.user.name,
      userEmail: session.user.email,
      listingName: updatedOrder.listing.name,
      orderId,
      appUrl: APP_URL,
    }),
  });
}
