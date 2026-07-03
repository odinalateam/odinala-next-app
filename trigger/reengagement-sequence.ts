import { task, wait } from "@trigger.dev/sdk/v3";
import Anthropic from "@anthropic-ai/sdk";
import { createElement } from "react";
import { prisma } from "../lib/prisma";
import { resend } from "../lib/resend";
import { sendPushToUser } from "../lib/push";
import { ReengageEmail } from "../emails/ReengageEmail";
import {
  REENGAGEMENT_SYSTEM_PROMPT,
  buildEmail1Prompt,
  buildEmail2Prompt,
  buildEmail3Prompt,
  buildPushBody,
  type UserContext,
} from "../lib/agents/prompts/reengagement";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://odinala.com";
const FROM_EMAIL = "Odinala <hello@odinala.com>";

/**
 * Agent 5 — Re-engagement Sequence (per-user)
 * Runs for up to 8 days: Email 1 + Push on Day 0, Email 2 on Day 3, Email 3 on Day 7.
 * Exits early if the user logs in or completes an investment between steps.
 */
export const reengagementSequence = task({
  id: "reengagement-sequence",
  maxDuration: 700000, // ~8 days in seconds

  run: async ({ userId }: { userId: string }) => {
    // Idempotency guard — skip if already in a sequence
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { reengagementStatus: true },
    });
    if (existing?.reengagementStatus === "active") {
      return { status: "skipped", reason: "already-active" };
    }

    // Mark as active and store run ID for potential cancellation
    await prisma.user.update({
      where: { id: userId },
      data: { reengagementStatus: "active" },
    });

    const user = await getUserContext(userId);
    if (!user) {
      return exitSequence(userId, "user-not-found");
    }

    // ── DAY 0: Email 1 + Push ────────────────────────────────────────────────
    const email1 = await generateEmailCopy(buildEmail1Prompt(user));

    await sendReengageEmail({
      userId,
      user,
      emailBody: email1,
      stage: 1,
    });

    sendPushToUser(userId, {
      title: "Odinala — We saved your spot",
      body: buildPushBody(user),
      url: `/properties/${user.lastListingId}`,
    });

    await logAction(userId, "push-sent", { listingId: user.lastListingId });

    // ── WAIT 3 DAYS ──────────────────────────────────────────────────────────
    await wait.for({ days: 3 });

    if (await hasUserReengaged(userId)) {
      return exitSequence(userId, "user-returned-after-email-1");
    }

    // ── DAY 3: Email 2 ───────────────────────────────────────────────────────
    const email2 = await generateEmailCopy(
      buildEmail2Prompt({ ...user, daysInactive: user.daysInactive + 3 })
    );

    await sendReengageEmail({
      userId,
      user,
      emailBody: email2,
      stage: 2,
    });

    // ── WAIT 4 MORE DAYS ─────────────────────────────────────────────────────
    await wait.for({ days: 4 });

    if (await hasUserReengaged(userId)) {
      return exitSequence(userId, "user-returned-after-email-2");
    }

    // ── DAY 7: Email 3 ───────────────────────────────────────────────────────
    const email3 = await generateEmailCopy(
      buildEmail3Prompt({ ...user, daysInactive: user.daysInactive + 7 })
    );

    await sendReengageEmail({
      userId,
      user,
      emailBody: email3,
      stage: 3,
    });

    // ── SEQUENCE COMPLETE ────────────────────────────────────────────────────
    await prisma.user.update({
      where: { id: userId },
      data: { reengagementStatus: "completed" },
    });

    await logAction(userId, "sequence-completed", {});

    return { status: "completed", userId };
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getUserContext(userId: string): Promise<UserContext | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: { select: { country: true } },
      listingViews: {
        orderBy: { viewCount: "desc" },
        take: 1,
        include: { listing: { select: { id: true, name: true } } },
      },
    },
  });

  if (!user) return null;

  const firstName = user.name.split(" ")[0] ?? user.name;
  const topView = user.listingViews[0];
  const lastActiveAt = user.lastActiveAt ?? user.createdAt;
  const daysInactive = Math.floor(
    (Date.now() - lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    firstName,
    email: user.email,
    lastProperty: topView?.listing.name ?? "your saved property",
    lastListingId: topView?.listing.id ?? "",
    viewCount: topView?.viewCount ?? 1,
    daysInactive,
    country: user.profile?.country ?? "Nigeria",
  };
}

async function generateEmailCopy(userPrompt: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    system: REENGAGEMENT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });
  return (msg.content[0] as { type: string; text: string }).text.trim();
}

async function sendReengageEmail({
  userId,
  user,
  emailBody,
  stage,
}: {
  userId: string;
  user: UserContext;
  emailBody: string;
  stage: 1 | 2 | 3;
}) {
  const propertyUrl = user.lastListingId
    ? `${BASE_URL}/properties/${user.lastListingId}`
    : BASE_URL;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: getSubject(stage, user.lastProperty),
      react: createElement(ReengageEmail, {
        firstName: user.firstName,
        emailBody,
        stage,
        propertyName: user.lastProperty,
        propertyUrl,
      }),
      headers: {
        "X-Email-Type": "agent-reengagement",
        "X-Email-Stage": String(stage),
        "X-Agent-Id": "re-engagement",
      },
    });

    await logAction(userId, `email-${stage}-sent`, {
      stage,
      property: user.lastProperty,
    });
  } catch (err) {
    await logAction(userId, `email-${stage}-failed`, {
      error: String(err),
    });
  }
}

function getSubject(stage: 1 | 2 | 3, propertyName: string): string {
  if (stage === 1) return `Still thinking about ${propertyName}?`;
  if (stage === 2) return `The Lagos market is moving — quick note`;
  return `We're still here whenever you're ready`;
}

async function hasUserReengaged(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { orders: { take: 1 } },
  });
  if (!user) return true;

  const recentLogin =
    user.lastActiveAt &&
    user.lastActiveAt > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  return !!(recentLogin || user.orders.length > 0);
}

async function exitSequence(userId: string, reason: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { reengagementStatus: "exited" },
  }).catch(() => {});

  await logAction(userId, "exited-early", { reason });

  return { status: "exited-early", reason };
}

async function logAction(
  userId: string,
  action: string,
  payload: Record<string, string | number | boolean | null>
) {
  await prisma.agentActionLog.create({
    data: {
      agentId: "re-engagement",
      userId,
      action,
      payload,
      status: "completed",
    },
  }).catch(() => {});
}
