import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface ResetPasswordEmailProps {
  userName: string;
  resetUrl: string;
}

export function ResetPasswordEmail({
  userName,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Reset your Odinala password">
      <Text style={heading}>Reset Your Password</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        We received a request to reset your password. Click the button below to
        set a new password. This link will expire in 1 hour.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={resetUrl}>
          Reset Password
        </Button>
      </Section>
      <Text style={paragraph}>
        If you did not request a password reset, you can safely ignore this
        email. Your password will remain unchanged.
      </Text>
    </EmailLayout>
  );
}

export default ResetPasswordEmail;

const heading: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#18181b",
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#3f3f46",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#18181b",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
};
