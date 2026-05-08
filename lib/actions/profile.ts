"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifyNIN, verifyTIN } from "@/lib/verifyme";
import { sendEmail, APP_URL } from "@/lib/email";
import { KycVerifiedEmail } from "@/emails/kyc-verified";

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("You must be logged in");
  }
  return session;
}

async function checkAndUpdateKycStatus(userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });
  if (!profile) return;

  const financialComplete =
    profile.citizenship &&
    profile.taxId &&
    profile.employmentStatus &&
    profile.occupation &&
    profile.sourceOfFunds;

  const shouldBeVerified = profile.ninVerified && financialComplete;

  if (shouldBeVerified && profile.kycStatus !== "verified") {
    await prisma.userProfile.update({
      where: { userId },
      data: { kycStatus: "verified", kycVerifiedAt: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await sendEmail({
        to: user.email,
        subject: "Your KYC Verification is Complete - Odinala",
        react: KycVerifiedEmail({
          userName: user.name,
          appUrl: APP_URL,
        }),
      });
    }
  } else if (!shouldBeVerified && profile.kycStatus === "verified") {
    await prisma.userProfile.update({
      where: { userId },
      data: { kycStatus: "unverified", kycVerifiedAt: null },
    });
  }
}

export async function getProfile() {
  const session = await requireAuth();

  const profile = await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    profile,
  };
}

export async function updatePersonalInfo(data: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}) {
  const session = await requireAuth();

  const fullName = `${data.firstName} ${data.lastName}`.trim();
  if (!fullName) throw new Error("Name is required");

  // Update the user's name
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: fullName },
  });

  // Update or create profile
  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      phone: data.phone || null,
      address: data.address || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    },
    update: {
      phone: data.phone || null,
      address: data.address || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    },
  });

  revalidatePath("/my-account");
}

export async function updateFinancialInfo(data: {
  citizenship: string;
  taxId: string;
  employmentStatus: string;
  occupation: string;
  employerName: string;
  sourceOfFunds: string;
}) {
  const session = await requireAuth();

  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      citizenship: data.citizenship || null,
      taxId: data.taxId || null,
      employmentStatus: data.employmentStatus || null,
      occupation: data.occupation || null,
      employerName: data.employerName || null,
      sourceOfFunds: data.sourceOfFunds || null,
    },
    update: {
      citizenship: data.citizenship || null,
      taxId: data.taxId || null,
      employmentStatus: data.employmentStatus || null,
      occupation: data.occupation || null,
      employerName: data.employerName || null,
      sourceOfFunds: data.sourceOfFunds || null,
    },
  });

  await checkAndUpdateKycStatus(session.user.id);

  revalidatePath("/my-account");
}

export async function verifyNINAction(nin: string) {
  const session = await requireAuth();

  if (!nin || nin.trim().length === 0) {
    throw new Error("Please enter your NIN");
  }

  // Get user's profile for name and DOB
  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  const nameParts = session.user.name.split(" ");
  const firstname = nameParts[0] || "";
  const lastname = nameParts.slice(1).join(" ") || "";

  if (!firstname || !lastname) {
    throw new Error("Please save your first and last name before verifying NIN");
  }

  if (!profile?.dateOfBirth) {
    throw new Error(
      "Please save your date of birth before verifying NIN"
    );
  }

  // Format DOB for VerifyMe API (DD-MM-YYYY)
  const dob = profile.dateOfBirth;
  const day = String(dob.getDate()).padStart(2, "0");
  const month = String(dob.getMonth() + 1).padStart(2, "0");
  const year = dob.getFullYear();
  const formattedDob = `${day}-${month}-${year}`;

  const result = await verifyNIN(nin, firstname, lastname, formattedDob);

  if (!result.success) {
    throw new Error(result.error || "NIN verification failed");
  }

  await prisma.userProfile.update({
    where: { userId: session.user.id },
    data: {
      nin,
      ninVerified: true,
    },
  });

  await checkAndUpdateKycStatus(session.user.id);

  revalidatePath("/my-account");
  return { success: true };
}

export async function verifyTINAction(tin: string) {
  const session = await requireAuth();

  if (!tin || tin.trim().length === 0) {
    throw new Error("Please enter your TIN");
  }

  const result = await verifyTIN(tin);

  if (!result.success) {
    throw new Error(result.error || "TIN verification failed");
  }

  await prisma.userProfile.update({
    where: { userId: session.user.id },
    data: {
      taxId: tin,
      tinVerified: true,
    },
  });

  await checkAndUpdateKycStatus(session.user.id);

  revalidatePath("/my-account");
  return { success: true };
}
