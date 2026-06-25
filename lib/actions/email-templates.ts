"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");
  return session;
}

export async function getEmailTemplates() {
  await requireAdmin();
  return prisma.emailTemplate.findMany({
    where: { isAgentGenerated: false },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAgentEmailTemplates() {
  await requireAdmin();
  return prisma.emailTemplate.findMany({
    where: { isAgentGenerated: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function getEmailTemplate(id: string) {
  await requireAdmin();
  return prisma.emailTemplate.findUnique({ where: { id } });
}

interface TemplateInput {
  name: string;
  subject: string;
  body: string;
}

export async function createEmailTemplate(
  data: TemplateInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await requireAdmin();
    const template = await prisma.emailTemplate.create({ data });
    revalidatePath("/dashboard/leads/emails");
    return { success: true, id: template.id };
  } catch (err) {
    console.error("[createEmailTemplate]", err);
    return { success: false, error: "Failed to create template." };
  }
}

export async function updateEmailTemplate(
  id: string,
  data: TemplateInput
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await prisma.emailTemplate.update({ where: { id }, data });
    revalidatePath("/dashboard/leads/emails");
    return { success: true };
  } catch (err) {
    console.error("[updateEmailTemplate]", err);
    return { success: false, error: "Failed to update template." };
  }
}

export async function deleteEmailTemplate(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await prisma.emailTemplate.delete({ where: { id } });
    revalidatePath("/dashboard/leads/emails");
    return { success: true };
  } catch (err) {
    console.error("[deleteEmailTemplate]", err);
    return { success: false, error: "Failed to delete template." };
  }
}
