"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("You must be logged in");
  }
  return session;
}

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

const TOPIC_INTROS: Record<string, string> = {
  "Property Inquiry":
    "Thank you for reaching out about a property! Please share the property details or any questions you have, and an admin will respond shortly.",
  "Land Inquiry":
    "Thank you for your interest in our land listings! Please share the details of what you're looking for, and an admin will respond shortly.",
  "Payment & Billing":
    "We're here to help with your payment or billing question. Please describe your issue, and an admin will respond shortly.",
  "Order Status":
    "We'd be happy to help you with your order status. Please share your order number or details, and an admin will respond shortly.",
  "KYC Verification":
    "We're here to assist with your KYC verification. Please share the details of your verification concern, and an admin will respond shortly.",
  "General Inquiry":
    "Thank you for reaching out! Please share your question or concern, and an admin will respond shortly.",
};

export async function createConversation(topic: string) {
  const session = await requireAuth();

  const adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
    select: { id: true },
  });

  const introContent =
    TOPIC_INTROS[topic] ||
    "Thank you for reaching out! Please share your question, and an admin will respond shortly.";

  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      topic,
      ...(adminUser && {
        messages: {
          create: {
            senderId: adminUser.id,
            senderRole: "admin",
            content: introContent,
            isReadByUser: false,
            isReadByAdmin: true,
          },
        },
      }),
    },
    include: {
      messages: {
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return conversation;
}

export async function getUserConversations() {
  const session = await requireAuth();

  return prisma.conversation.findMany({
    where: { userId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      },
      _count: {
        select: {
          messages: {
            where: { isReadByUser: false },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getConversations() {
  await requireAdmin();

  return prisma.conversation.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      },
      _count: {
        select: {
          messages: {
            where: { isReadByAdmin: false },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getMessages(conversationId: string) {
  const session = await requireAuth();

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) throw new Error("Conversation not found");
  if (session.user.role !== "admin" && conversation.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
}

export async function sendMessage(conversationId: string, content: string) {
  const session = await requireAuth();

  if (!content.trim()) throw new Error("Message cannot be empty");

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) throw new Error("Conversation not found");

  const isAdmin = session.user.role === "admin";
  if (!isAdmin && conversation.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      senderRole: isAdmin ? "admin" : "user",
      content: content.trim(),
      isReadByAdmin: isAdmin,
      isReadByUser: !isAdmin,
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function markAsRead(conversationId: string) {
  const session = await requireAuth();

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) throw new Error("Conversation not found");

  const isAdmin = session.user.role === "admin";
  if (!isAdmin && conversation.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.message.updateMany({
    where: {
      conversationId,
      ...(isAdmin ? { isReadByAdmin: false } : { isReadByUser: false }),
    },
    data: isAdmin ? { isReadByAdmin: true } : { isReadByUser: true },
  });

}

export async function getUnreadCount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return 0;

  const isAdmin = session.user.role === "admin";

  if (isAdmin) {
    return prisma.message.count({
      where: { isReadByAdmin: false },
    });
  }

  return prisma.message.count({
    where: {
      conversation: { userId: session.user.id },
      isReadByUser: false,
    },
  });
}
