import { SignUpForm } from "@/components/auth/sign-up-form";
import { AuthCarousel } from "@/components/auth/auth-carousel";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Afrova",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthCarousel />
      <AuthFormWrapper>
        <SignUpForm />
      </AuthFormWrapper>
    </div>
  );
}
