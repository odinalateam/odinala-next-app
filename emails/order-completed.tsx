import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface OrderCompletedEmailProps {
  userName: string;
  listingName: string;
  orderId: string;
  appUrl: string;
}

export function OrderCompletedEmail({
  userName,
  listingName,
  orderId,
  appUrl,
}: OrderCompletedEmailProps) {
  return (
    <EmailLayout preview={`Your order for ${listingName} is complete`}>
      <Text style={heading}>Order Completed</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        Congratulations! Your order for <strong>{listingName}</strong> (Order
        ID: {orderId}) has been successfully completed.
      </Text>
      <Text style={paragraph}>
        Thank you for choosing Odinala for your property investment. If you need
        any further assistance, our team is here to help.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/my-account/orders`}>
          View Order Details
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default OrderCompletedEmail;

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
