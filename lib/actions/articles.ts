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

export async function getArticles() {
  await requireAdmin();
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
  });
}

export async function createArticle(data: {
  title: string;
  content: string;
  coverImage: string | null;
  author: string;
  status: string;
}) {
  await requireAdmin();
  const article = await prisma.article.create({
    data: {
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
    },
  });
  revalidatePath("/dashboard/news");
  revalidatePath("/news");

  return article;
}

export async function updateArticle(
  id: string,
  data: {
    title: string;
    content: string;
    coverImage: string | null;
    author: string;
    status: string;
  }
) {
  await requireAdmin();
  const existing = await prisma.article.findUnique({ where: { id } });
  const isNewlyPublished =
    data.status === "published" && existing?.status !== "published";
  const article = await prisma.article.update({
    where: { id },
    data: {
      ...data,
      publishedAt: isNewlyPublished ? new Date() : existing?.publishedAt,
    },
  });
  revalidatePath("/dashboard/news");
  revalidatePath("/news");
  revalidatePath(`/news/${id}`);

  return article;
}

export async function deleteArticle(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await prisma.article.delete({ where: { id } });
    revalidatePath("/dashboard/news");
    revalidatePath("/news");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete article" };
  }
}
