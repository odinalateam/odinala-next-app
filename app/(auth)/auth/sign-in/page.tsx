import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { AuthCarousel } from "@/components/auth/auth-carousel";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Afrova",
};

export default function SignInPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthCarousel />
      <AuthFormWrapper>
        <Suspense>
          <SignInForm />
        </Suspense>
      </AuthFormWrapper>
    </div>
  );
}
