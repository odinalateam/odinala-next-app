import { Text, Button, Section, Row, Column } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface AdminApplicationSubmittedEmailProps {
  userName: string;
  userEmail: string;
  listingName: string;
  orderId: string;
  appUrl: string;
}

export function AdminApplicationSubmittedEmail({
  userName,
  userEmail,
  listingName,
  orderId,
  appUrl,
}: AdminApplicationSubmittedEmailProps) {
  return (
    <EmailLayout
      preview={`${userName} submitted an application form for ${listingName}`}
    >
      <Text style={heading}>Application Form Submitted</Text>
      <Text style={paragraph}>
        A client has submitted their filled application form and it requires
        your review.
      </Text>

      <Section style={detailsBox}>
        <Row>
          <Column>
            <Text style={label}>Client</Text>
            <Text style={value}>{userName}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Email</Text>
            <Text style={value}>{userEmail}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Property</Text>
            <Text style={value}>{listingName}</Text>
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
        <Button style={button} href={`${appUrl}/dashboard/orders`}>
          Review in Dashboard
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default AdminApplicationSubmittedEmail;

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
