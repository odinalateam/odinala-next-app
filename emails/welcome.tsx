import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface WelcomeEmailProps {
  userName: string;
  appUrl: string;
}

export function WelcomeEmail({ userName, appUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to Odinala - Your property investment journey starts here">
      <Text style={heading}>Welcome to Odinala!</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        Thank you for creating your account with Odinala. We are your trusted
        partner for property and land investments across Nigeria.
      </Text>
      <Text style={paragraph}>
        To get started, please complete your profile and KYC verification. Once
        verified, you will be able to browse our listings and place orders.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/my-account`}>
          Complete Your Profile
        </Button>
      </Section>
      <Text style={paragraph}>
        If you have any questions, feel free to reach out to us at{" "}
        <a href="mailto:odinalainvest@gmail.com" style={link}>
          odinalainvest@gmail.com
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

export default WelcomeEmail;

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

const link: React.CSSProperties = {
  color: "#18181b",
  textDecoration: "underline",
};
