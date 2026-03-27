import { Text, Button, Section, Row, Column } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface OrderConfirmationEmailProps {
  userName: string;
  listingName: string;
  listingLocation: string;
  price: string;
  paymentOption: string;
  installmentMonths?: number | null;
  orderId: string;
  appUrl: string;
}

export function OrderConfirmationEmail({
  userName,
  listingName,
  listingLocation,
  price,
  paymentOption,
  installmentMonths,
  orderId,
  appUrl,
}: OrderConfirmationEmailProps) {
  const paymentLabel =
    paymentOption === "installment" && installmentMonths
      ? `Installment (${installmentMonths} months)`
      : "Outright Payment";

  return (
    <EmailLayout preview={`Order received for ${listingName}`}>
      <Text style={heading}>Order Received</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        We have received your order request. Our team will review it and get
        back to you shortly.
      </Text>

      <Section style={detailsBox}>
        <Text style={detailsHeading}>Order Details</Text>
        <Row>
          <Column>
            <Text style={label}>Property</Text>
            <Text style={value}>{listingName}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Location</Text>
            <Text style={value}>{listingLocation}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Price</Text>
            <Text style={value}>{price}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Payment Option</Text>
            <Text style={value}>{paymentLabel}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Order ID</Text>
            <Text style={value}>{orderId}</Text>
          </Column>
        </Row>
      </Section>

      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/my-account/orders`}>
          View Your Orders
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default OrderConfirmationEmail;

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

const detailsBox: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  borderRadius: "6px",
  padding: "20px",
  margin: "16px 0",
};

const detailsHeading: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#18181b",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const label: React.CSSProperties = {
  fontSize: "12px",
  color: "#71717a",
  margin: "0 0 2px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const value: React.CSSProperties = {
  fontSize: "14px",
  color: "#18181b",
  fontWeight: 500,
  margin: "0 0 12px",
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
