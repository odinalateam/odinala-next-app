import { schedules, tasks } from "@trigger.dev/sdk/v3";
import { prisma } from "../lib/prisma";

/**
 * Agent 5 — Re-engagement Scanner
 * Runs daily at 09:00 WAT (06:00 UTC).
 * Finds users inactive for 14+ days who are not already in a sequence,
 * then triggers one reengagement-sequence task per user.
 */
export const reengagementScanner = schedules.task({
  id: "reengagement-scanner",
  cron: "0 6 * * *", // 06:00 UTC = 09:00 WAT
  maxDuration: 120,

  run: async () => {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const inactive = await prisma.user.findMany({
      where: {
        OR: [
          { lastActiveAt: { lt: cutoff } },
          { lastActiveAt: null, createdAt: { lt: cutoff } },
        ],
        reengagementStatus: null,
        marketingOptIn: true,
        orders: { none: {} },
      },
      select: { id: true },
      take: 100,
    });

    if (!inactive.length) {
      await prisma.agentActionLog.create({
        data: {
          agentId: "re-engagement",
          action: "scanner-no-users",
          status: "completed",
        },
      });
      return { triggered: 0 };
    }

    await Promise.all(
      inactive.map((u) =>
        tasks.trigger("reengagement-sequence", { userId: u.id })
      )
    );

    await prisma.agentActionLog.create({
      data: {
        agentId: "re-engagement",
        action: "scanner-triggered",
        payload: { count: inactive.length },
        status: "completed",
      },
    });

    return { triggered: inactive.length };
  },
});
