import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthCarousel } from "@/components/auth/auth-carousel";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Odinala",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthCarousel />
      <AuthFormWrapper>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </AuthFormWrapper>
    </div>
  );
}
