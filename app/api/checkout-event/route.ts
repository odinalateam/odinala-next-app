import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { tasks } from "@trigger.dev/sdk/v3";

// POST — create a "started" checkout event
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const listingId: string | undefined = body.listingId;

  const event = await prisma.checkoutEvent.create({
    data: {
      userId: session.user.id,
      step: "started",
      listingId: listingId ?? null,
    },
  });

  return NextResponse.json({ id: event.id });
}

// PATCH — update to "abandoned" or "completed"
export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id: string | undefined = body.id;
  const step: "abandoned" | "completed" | undefined = body.step;

  if (!id || !step) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = await prisma.checkoutEvent.update({
    where: { id },
    data: { step },
  });

  // Fire re-engagement sequence immediately on abandonment (Trigger type B)
  if (step === "abandoned") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { reengagementStatus: true, marketingOptIn: true },
    });

    if (
      user?.marketingOptIn &&
      !user.reengagementStatus
    ) {
      await tasks
        .trigger("reengagement-sequence", { userId: session.user.id })
        .catch(() => {});
    }
  }

  // If completed, mark user as exited from any active sequence
  if (step === "completed") {
    await prisma.user
      .update({
        where: { id: session.user.id },
        data: { reengagementStatus: "exited" },
      })
      .catch(() => {});
  }

  return NextResponse.json({ ok: true, id: event.id });
}
