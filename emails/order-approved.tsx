import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface OrderApprovedEmailProps {
  userName: string;
  listingName: string;
  orderId: string;
  appUrl: string;
}

export function OrderApprovedEmail({
  userName,
  listingName,
  orderId,
  appUrl,
}: OrderApprovedEmailProps) {
  return (
    <EmailLayout preview={`Your order for ${listingName} has been approved`}>
      <Text style={heading}>Order Approved</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        Great news! Your order for <strong>{listingName}</strong> (Order ID:{" "}
        {orderId}) has been approved.
      </Text>
      <Text style={paragraph}>
        Please log in to your account to view the next steps, which may include
        downloading and submitting an application form and uploading your proof
        of payment.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/my-account/orders`}>
          View Order Details
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default OrderApprovedEmail;

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
