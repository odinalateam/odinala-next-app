import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface OrderRejectedEmailProps {
  userName: string;
  listingName: string;
  orderId: string;
  appUrl: string;
}

export function OrderRejectedEmail({
  userName,
  listingName,
  orderId,
  appUrl,
}: OrderRejectedEmailProps) {
  return (
    <EmailLayout preview={`Update on your order for ${listingName}`}>
      <Text style={heading}>Order Update</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        Unfortunately, your order for <strong>{listingName}</strong> (Order ID:{" "}
        {orderId}) could not be approved at this time.
      </Text>
      <Text style={paragraph}>
        If you have any questions or would like more information, please do not
        hesitate to contact us at{" "}
        <a href="mailto:odinalainvest@gmail.com" style={link}>
          odinalainvest@gmail.com
        </a>
        .
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/my-account/orders`}>
          View Your Orders
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default OrderRejectedEmail;

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

const link: React.CSSProperties = {
  color: "#18181b",
  textDecoration: "underline",
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
