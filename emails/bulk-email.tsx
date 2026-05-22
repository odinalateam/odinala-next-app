import { Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface BulkEmailProps {
  userName: string;
  subject: string;
  body: string;
  appUrl: string;
}

export function BulkEmail({ userName, subject, body, appUrl: _appUrl }: BulkEmailProps) {
  return (
    <EmailLayout preview={subject}>
      <Text style={heading}>{subject}</Text>
      <Text style={paragraph}>Hi {userName},</Text>
      {body.split("\n").map((line, i) =>
        line.trim() ? (
          <Text key={i} style={paragraph}>
            {line}
          </Text>
        ) : (
          <Section key={i} style={{ height: "8px" }} />
        )
      )}
      <Text style={footer}>
        You are receiving this email because you are registered on Odinala.
      </Text>
    </EmailLayout>
  );
}

export default BulkEmail;

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

const footer: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  lineHeight: "20px",
  margin: "24px 0 0",
  borderTop: "1px solid #e4e4e7",
  paddingTop: "16px",
};
