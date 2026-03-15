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

export async function getUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdmins() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "admin" },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchUsers(query: string) {
  await requireAdmin();
  if (!query.trim()) return [];
  return prisma.user.findMany({
    where: {
      role: "user",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
  });
}

export async function promoteToAdmin(userId: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role: "admin" },
  });
  revalidatePath("/dashboard/admins");
  revalidatePath("/dashboard/users");
}

export async function demoteFromAdmin(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    throw new Error("Cannot demote yourself");
  }
  await prisma.user.update({
    where: { id: userId },
    data: { role: "user" },
  });
  revalidatePath("/dashboard/admins");
  revalidatePath("/dashboard/users");
}

export async function banUser(userId: string, reason: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    throw new Error("Cannot ban yourself");
  }
  await prisma.user.update({
    where: { id: userId },
    data: { banned: true, banReason: reason },
  });
  revalidatePath("/dashboard/users");
}

export async function unbanUser(userId: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { banned: false, banReason: null, banExpires: null },
  });
  revalidatePath("/dashboard/users");
}
