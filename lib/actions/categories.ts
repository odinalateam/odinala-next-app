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

export async function getCategories() {
  await requireAdmin();
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createCategory(data: { name: string; type: string }) {
  await requireAdmin();
  await prisma.category.create({ data });
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/listings");
}

export async function updateCategory(
  id: string,
  data: { name: string; type: string }
) {
  await requireAdmin();
  await prisma.category.update({ where: { id }, data });
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/listings");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/listings");
}
