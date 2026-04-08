import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ODINALA</Text>
            <Text style={tagline}>
              Property & Land Investment - Nigeria
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={content}>{children}</Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Odinala Investment Ltd. - Discover properties and land across
              Nigeria.
            </Text>
            <Text style={footerText}>
              This is an automated notification. Please do not reply to this
              email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: "40px 0",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #e4e4e7",
};

const header: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "32px 24px 16px",
};

const logo: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#18181b",
  letterSpacing: "2px",
  margin: "0 0 4px",
};

const tagline: React.CSSProperties = {
  fontSize: "13px",
  color: "#71717a",
  margin: 0,
};

const hr: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: 0,
};

const content: React.CSSProperties = {
  padding: "32px 24px",
};

const footer: React.CSSProperties = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: "0 0 4px",
  lineHeight: "18px",
};
