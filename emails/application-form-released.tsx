import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface ApplicationFormReleasedEmailProps {
  userName: string;
  listingName: string;
  orderId: string;
  appUrl: string;
}

export function ApplicationFormReleasedEmail({
  userName,
  listingName,
  orderId,
  appUrl,
}: ApplicationFormReleasedEmailProps) {
  return (
    <EmailLayout
      preview={`Application form available for ${listingName}`}
    >
      <Text style={heading}>Application Form Available</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        The application form for your order on <strong>{listingName}</strong>{" "}
        (Order ID: {orderId}) is now available for download.
      </Text>
      <Text style={paragraph}>
        Please log in to your account, download the form, complete it, and
        upload the filled form back through your orders page.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/my-account/orders`}>
          Download Application Form
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default ApplicationFormReleasedEmail;

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
