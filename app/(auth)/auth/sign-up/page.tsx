import { SignUpForm } from "@/components/auth/sign-up-form";
import { AuthCarousel } from "@/components/auth/auth-carousel";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Odinala",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      <AuthCarousel />
      <AuthFormWrapper>
        <SignUpForm />
      </AuthFormWrapper>
    </div>
  );
}
