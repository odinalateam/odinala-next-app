import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthCarousel } from "@/components/auth/auth-carousel";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Odinala",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthCarousel />
      <AuthFormWrapper>
        <ForgotPasswordForm />
      </AuthFormWrapper>
    </div>
  );
}
