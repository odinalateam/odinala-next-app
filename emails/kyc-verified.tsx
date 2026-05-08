import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface KycVerifiedEmailProps {
  userName: string;
  appUrl: string;
}

export function KycVerifiedEmail({ userName, appUrl }: KycVerifiedEmailProps) {
  return (
    <EmailLayout preview="Your KYC verification is complete - You can now place orders">
      <Text style={heading}>KYC Verification Complete</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        Your identity verification has been successfully completed. You are now
        fully verified on Odinala and can browse our property and land listings
        to place orders.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/properties`}>
          Browse Properties
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default KycVerifiedEmail;

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
