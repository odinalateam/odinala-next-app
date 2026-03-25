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

export async function getOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    include: { user: { include: { profile: true } }, listing: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/dashboard/orders");
  revalidatePath("/my-account/orders");
}

export async function releaseApplicationForm(orderId: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { listing: true },
  });
  if (!order) throw new Error("Order not found");
  if (!order.listing.applicationFormUrl) {
    throw new Error("No application form uploaded for this listing");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { applicationFormReleased: true },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/my-account/orders");
}
