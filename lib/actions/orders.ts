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
    include: { user: true, listing: true },
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
