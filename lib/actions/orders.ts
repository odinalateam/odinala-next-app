"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendEmail, APP_URL } from "@/lib/email";
import { OrderApprovedEmail } from "@/emails/order-approved";
import { OrderRejectedEmail } from "@/emails/order-rejected";
import { OrderCompletedEmail } from "@/emails/order-completed";
import { ApplicationFormReleasedEmail } from "@/emails/application-form-released";
import { createNotification } from "@/lib/actions/notifications";
import { NotificationType } from "@prisma/client";

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    include: { user: { include: { profile: true } }, listing: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { user: true, listing: true },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/my-account/orders");

  if (status === "Approved") {
    sendEmail({
      to: order.user.email,
      subject: "Your Order Has Been Approved - Odinala",
      react: OrderApprovedEmail({
        userName: order.user.name,
        listingName: order.listing.name,
        orderId: order.id,
        appUrl: APP_URL,
      }),
    });
    void createNotification({
      userId: order.user.id,
      type: NotificationType.ORDER_UPDATE,
      title: "Order Approved",
      body: `Your order for ${order.listing.name} has been approved.`,
      link: "/my-account/orders",
    });
  } else if (status === "Rejected") {
    sendEmail({
      to: order.user.email,
      subject: "Order Update - Odinala",
      react: OrderRejectedEmail({
        userName: order.user.name,
        listingName: order.listing.name,
        orderId: order.id,
        appUrl: APP_URL,
      }),
    });
    void createNotification({
      userId: order.user.id,
      type: NotificationType.ORDER_UPDATE,
      title: "Order Update",
      body: `Your order for ${order.listing.name} has been reviewed.`,
      link: "/my-account/orders",
    });
  } else if (status === "Completed") {
    sendEmail({
      to: order.user.email,
      subject: "Your Order is Complete - Odinala",
      react: OrderCompletedEmail({
        userName: order.user.name,
        listingName: order.listing.name,
        orderId: order.id,
        appUrl: APP_URL,
      }),
    });
    void createNotification({
      userId: order.user.id,
      type: NotificationType.ORDER_UPDATE,
      title: "Order Completed",
      body: `Your order for ${order.listing.name} is complete!`,
      link: "/my-account/orders",
    });
  }
}

export async function releaseApplicationForm(orderId: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { listing: true, user: true },
  });
  if (!order) throw new Error("Order not found");
  if (!order.listing.applicationFormUrl) {
    throw new Error("No application form uploaded for this listing");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { applicationFormReleased: true },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/my-account/orders");

  sendEmail({
    to: order.user.email,
    subject: "Application Form Available - Odinala",
    react: ApplicationFormReleasedEmail({
      userName: order.user.name,
      listingName: order.listing.name,
      orderId,
      appUrl: APP_URL,
    }),
  });
  void createNotification({
    userId: order.user.id,
    type: NotificationType.ORDER_UPDATE,
    title: "Application Form Available",
    body: `Your application form for ${order.listing.name} is ready to download.`,
    link: "/my-account/orders",
  });
}
