import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const DEBOUNCE_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const userId = session.user.id;
  const body = await request.json().catch(() => ({}));
  const listingId: string | undefined = body.listingId;

  // Update lastActiveAt with 10-min debounce
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveAt: true },
  });

  const now = new Date();
  const shouldUpdate =
    !user?.lastActiveAt ||
    now.getTime() - user.lastActiveAt.getTime() > DEBOUNCE_MS;

  if (shouldUpdate) {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: now },
    });
  }

  // Track listing view if a listingId was provided
  if (listingId) {
    await prisma.listingView.upsert({
      where: { userId_listingId: { userId, listingId } },
      create: { userId, listingId, viewCount: 1 },
      update: { viewCount: { increment: 1 }, updatedAt: now },
    });
  }

  return NextResponse.json({ ok: true });
}
