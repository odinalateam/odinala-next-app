"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import { BulkEmail } from "@/emails/bulk-email";
import { APP_URL } from "@/lib/email";
import * as React from "react";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");
  return session;
}

export async function getLeads() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "user" },
    include: { profile: true },
    orderBy: [{ profile: { leadScore: "desc" } }, { createdAt: "desc" }],
  });
}

interface SendBulkEmailInput {
  userIds: string[];
  subject: string;
  body: string;
}

export async function sendBulkEmail({
  userIds,
  subject,
  body,
}: SendBulkEmailInput): Promise<{ success: boolean; sent: number; error?: string }> {
  try {
    await requireAdmin();

    if (!userIds.length) return { success: false, sent: 0, error: "No users selected." };

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const results = await Promise.allSettled(
      users.map((user) =>
        sendEmail({
          to: user.email,
          subject,
          react: React.createElement(BulkEmail, {
            userName: user.name,
            subject,
            body,
            appUrl: APP_URL,
          }),
        })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed > 0) {
      console.error(`[sendBulkEmail] ${failed} email(s) failed to send`);
    }

    return { success: true, sent };
  } catch (err) {
    console.error("[sendBulkEmail]", err);
    return { success: false, sent: 0, error: "Failed to send emails." };
  }
}
