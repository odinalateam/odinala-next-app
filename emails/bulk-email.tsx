import {
  Text,
  Section,
  Html,
  Head,
  Body,
  Container,
  Font,
} from "@react-email/components";
import * as React from "react";
import sanitizeHtml from "sanitize-html";

interface BulkEmailProps {
  userName: string;
  subject: string;
  bodyHtml: string;
  appUrl: string;
}

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "span",
  "div",
];

const ALLOWED_ATTRIBUTES = {
  a: ["href", "target"],
  span: ["style"],
  p: ["style"],
  div: ["style"],
};

export function BulkEmail({
  userName,
  subject,
  bodyHtml,
  appUrl: _appUrl,
}: BulkEmailProps) {
  const safeHtml = sanitizeHtml(bodyHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>odinala</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>
            {/* Safe HTML from admin-created template, sanitized above */}
            <div // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: safeHtml }}
              style={htmlBody}
            />
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              You are receiving this email because you are registered on Afrova.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BulkEmail;

const body: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container: React.CSSProperties = {
  maxWidth: "580px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #e4e4e7",
};

const header: React.CSSProperties = {
  backgroundColor: "#18181b",
  padding: "20px 32px",
};

const logo: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  margin: 0,
  letterSpacing: "-0.3px",
};

const content: React.CSSProperties = {
  padding: "32px",
};

const greeting: React.CSSProperties = {
  fontSize: "15px",
  color: "#3f3f46",
  margin: "0 0 16px",
  lineHeight: "24px",
};

const htmlBody: React.CSSProperties = {
  fontSize: "15px",
  color: "#3f3f46",
  lineHeight: "24px",
};

const footerSection: React.CSSProperties = {
  borderTop: "1px solid #e4e4e7",
  padding: "16px 32px",
  backgroundColor: "#fafafa",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: 0,
  lineHeight: "18px",
};
