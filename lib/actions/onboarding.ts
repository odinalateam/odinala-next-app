"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { calculateLeadScore } from "@/lib/lead-score";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function getOnboardingStatus(): Promise<{
  onboardingCompleted: boolean;
  onboardingSkipped: boolean;
} | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: { onboardingCompleted: true, onboardingSkipped: true },
    });

    if (!profile) return { onboardingCompleted: false, onboardingSkipped: false };
    return { onboardingCompleted: profile.onboardingCompleted, onboardingSkipped: profile.onboardingSkipped };
  } catch {
    return null;
  }
}

interface SaveOnboardingData {
  country: string;
  investmentBudget: string;
  propertyTypePreference: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function saveOnboarding(data: SaveOnboardingData): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireUser();

    const result = calculateLeadScore({
      email: session.user.email,
      country: data.country,
      investmentBudget: data.investmentBudget,
      propertyTypePreference: data.propertyTypePreference,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    });

    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        country: data.country,
        investmentBudget: data.investmentBudget,
        propertyTypePreference: data.propertyTypePreference,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        onboardingCompleted: true,
        onboardingSkipped: false,
        leadScore: result.score,
        leadTier: result.tier,
        leadScoredAt: new Date(),
      },
      update: {
        country: data.country,
        investmentBudget: data.investmentBudget,
        propertyTypePreference: data.propertyTypePreference,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        onboardingCompleted: true,
        onboardingSkipped: false,
        leadScore: result.score,
        leadTier: result.tier,
        leadScoredAt: new Date(),
      },
    });

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (err) {
    console.error("[saveOnboarding]", err);
    return { success: false, error: "Failed to save onboarding data." };
  }
}

export async function skipOnboarding(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireUser();

    // Compute a partial score from what we have (email domain only at this point)
    const result = calculateLeadScore({ email: session.user.email });

    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        onboardingSkipped: true,
        leadScore: result.score,
        leadTier: result.tier,
        leadScoredAt: new Date(),
      },
      update: {
        onboardingSkipped: true,
        leadScore: result.score,
        leadTier: result.tier,
        leadScoredAt: new Date(),
      },
    });

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (err) {
    console.error("[skipOnboarding]", err);
    return { success: false, error: "Failed to skip onboarding." };
  }
}
