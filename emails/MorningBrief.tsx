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

interface Story {
  title: string;
  why: string;
}

interface MorningBriefProps {
  date: string;
  stories: Story[];
  contentAngles: [string, string];
  dataPoint: string;
}

export function MorningBrief({ date, stories, contentAngles, dataPoint }: MorningBriefProps) {
  return (
    <Html>
      <Head />
      <Preview>Afrova Morning Brief — {date}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Agent badge */}
          <Section style={agentBadgeSection}>
            <Text style={agentBadgeText}>[AGENT: SOCIAL BRIEF]</Text>
          </Section>

          {/* Brand header */}
          <Section style={header}>
            <Text style={logo}>AFROVA</Text>
            <Text style={tagline}>Morning Brief · {date}</Text>
          </Section>

          <Hr style={hr} />

          {/* Top Stories */}
          <Section style={contentSection}>
            <Text style={sectionHeading}>Top Stories</Text>
            {stories.map((story, i) => (
              <Section key={i} style={storyCard}>
                <Text style={storyTitle}>
                  {i + 1}. {story.title}
                </Text>
                <Text style={storyWhy}>Why it matters: {story.why}</Text>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Content Angles */}
          <Section style={contentSection}>
            <Text style={sectionHeading}>Content Angles</Text>
            {contentAngles.map((angle, i) => (
              <Text key={i} style={angleItem}>
                → {angle}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Data Point */}
          <Section style={dataPointSection}>
            <Text style={dataPointLabel}>Today&apos;s Data Point</Text>
            <Text style={dataPointValue}>{dataPoint}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This briefing was generated automatically by the Afrova Social Listening Agent.
            </Text>
            <Text style={footerText}>Afrova Investment Ltd. · afrova.io</Text>
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

const agentBadgeSection: React.CSSProperties = {
  backgroundColor: "#fef9c3",
  padding: "6px 24px",
  borderBottom: "1px solid #fde68a",
};

const agentBadgeText: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#854d0e",
  margin: 0,
  letterSpacing: "0.5px",
};

const header: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "28px 24px 20px",
  backgroundColor: "#18181b",
};

const logo: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#ffffff",
  letterSpacing: "3px",
  margin: "0 0 4px",
};

const tagline: React.CSSProperties = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: 0,
};

const hr: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: 0,
};

const contentSection: React.CSSProperties = {
  padding: "24px 24px 16px",
};

const sectionHeading: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#71717a",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
  margin: "0 0 16px",
};

const storyCard: React.CSSProperties = {
  borderLeft: "3px solid #18181b",
  paddingLeft: "12px",
  marginBottom: "16px",
};

const storyTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#18181b",
  margin: "0 0 4px",
  lineHeight: "1.4",
};

const storyWhy: React.CSSProperties = {
  fontSize: "12px",
  color: "#71717a",
  margin: 0,
  lineHeight: "1.5",
};

const angleItem: React.CSSProperties = {
  fontSize: "13px",
  color: "#3f3f46",
  margin: "0 0 10px",
  lineHeight: "1.5",
};

const dataPointSection: React.CSSProperties = {
  padding: "20px 24px",
  backgroundColor: "#f4f4f5",
};

const dataPointLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#71717a",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
  margin: "0 0 6px",
};

const dataPointValue: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: "#18181b",
  margin: 0,
};

const footer: React.CSSProperties = {
  padding: "20px 24px",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  fontSize: "11px",
  color: "#a1a1aa",
  margin: "0 0 4px",
  lineHeight: "1.6",
};
