import webpush from "web-push";
import { prisma } from "@/lib/prisma";

let vapidInitialised = false;

function initVapid() {
  if (vapidInitialised) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  vapidInitialised = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Fire-and-forget push to all subscriptions for a user.
 * Stale subscriptions (410/404) are automatically removed from the DB.
 */
export function sendPushToUser(userId: string, payload: PushPayload): void {
  if (
    !process.env.VAPID_SUBJECT ||
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY
  ) {
    return;
  }
  initVapid();
  prisma.pushSubscription
    .findMany({ where: { userId } })
    .then((subs) => {
      subs.forEach((sub) => {
        webpush
          .sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify(payload)
          )
          .catch(async (err: { statusCode?: number; message?: string }) => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await prisma.pushSubscription
                .delete({ where: { endpoint: sub.endpoint } })
                .catch(() => {});
            } else {
              console.error("[Push Error]", err.message);
            }
          });
      });
    })
    .catch((err: Error) => console.error("[Push DB Error]", err));
}
