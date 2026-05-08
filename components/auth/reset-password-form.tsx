"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { authClient } from "@/lib/auth-client";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      setError(error.message || "Failed to reset password. The link may have expired.");
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold tracking-tight">Invalid Link</h1>
          <p className="text-sm text-muted-foreground mt-2">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>
        <Link
          href="/auth/forgot-password"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Request New Link
        </Link>
      </>
    );
  }

  if (success) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">
            Password Reset Successfully
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
        </div>
        <Button
          className="w-full h-11"
          size="lg"
          onClick={() => router.push("/auth/sign-in")}
        >
          Sign In
        </Button>
      </>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordRequirements password={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-11"
          disabled={loading}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Reset Password
        </Button>
      </form>

      <Link
        href="/auth/sign-in"
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>
    </>
  );
}
