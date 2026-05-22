import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AuthCarousel } from "@/components/auth/auth-carousel";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile | Odinala",
};

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/auth/sign-in");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
    select: { onboardingCompleted: true },
  });

  if (profile?.onboardingCompleted) redirect("/");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthCarousel />
      <AuthFormWrapper>
        <OnboardingForm />
      </AuthFormWrapper>
    </div>
  );
}
