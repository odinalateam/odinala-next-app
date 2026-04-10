"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NotificationType } from "@prisma/client";
import { sendPushToUser } from "@/lib/push";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}): Promise<void> {
  await prisma.notification.create({ data: params });
  sendPushToUser(params.userId, {
    title: params.title,
    body: params.body,
    url: params.link,
  });
}

export async function getUserNotifications() {
  const session = await requireAuth();
  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getUnreadNotificationCount(): Promise<number> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return 0;
  return prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  const session = await requireAuth();
  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });
  revalidatePath("/my-account");
}

export async function markAllNotificationsRead(): Promise<void> {
  const session = await requireAuth();
  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/my-account");
}
