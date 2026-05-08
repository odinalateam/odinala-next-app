import { Text, Section, Row, Column } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface ContactInquiryEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactInquiryEmail({
  name,
  email,
  subject,
  message,
}: ContactInquiryEmailProps) {
  return (
    <EmailLayout preview={`New inquiry from ${name}: ${subject}`}>
      <Text style={heading}>New Contact Inquiry</Text>
      <Text style={paragraph}>
        You have received a new message from the website contact form.
      </Text>

      <Section style={detailsBox}>
        <Row>
          <Column>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={label}>Subject</Text>
            <Text style={value}>{subject}</Text>
          </Column>
        </Row>
      </Section>

      <Section style={detailsBox}>
        <Text style={label}>Message</Text>
        <Text style={messageText}>{message}</Text>
      </Section>
    </EmailLayout>
  );
}

export default ContactInquiryEmail;

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
  margin: "0 0 12px",
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

const messageText: React.CSSProperties = {
  fontSize: "14px",
  color: "#18181b",
  lineHeight: "22px",
  margin: "4px 0 0",
  whiteSpace: "pre-wrap" as const,
};
