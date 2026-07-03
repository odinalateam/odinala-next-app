import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface Props {
  firstName: string;
  emailBody: string;
  stage: 1 | 2 | 3;
  propertyName: string;
  propertyUrl: string;
}

const stageLabels: Record<1 | 2 | 3, string> = {
  1: "Checking In",
  2: "Market Update",
  3: "Still Here For You",
};

export function ReengageEmail({
  firstName,
  emailBody,
  stage,
  propertyName,
  propertyUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "sans-serif",
          background: "#f6f4f4",
          padding: "24px",
          margin: 0,
        }}
      >
        <Container
          style={{ maxWidth: "560px", margin: "0 auto", background: "#ffffff", borderRadius: "10px", overflow: "hidden" }}
        >
          {/* Agent tag badge */}
          <Section
            style={{
              background: "#fce7f3",
              padding: "6px 16px",
              borderBottom: "1px solid #fbcfe8",
            }}
          >
            <Text
              style={{
                color: "#9d174d",
                fontSize: "11px",
                fontWeight: "bold",
                margin: 0,
                letterSpacing: "0.05em",
              }}
            >
              [AGENT: RE-ENGAGE] · Stage {stage} of 3 · {stageLabels[stage]}
            </Text>
          </Section>

          {/* Brand header */}
          <Section
            style={{
              background: "#4950bc",
              padding: "24px 28px",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Hi {firstName}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "13px",
                margin: "4px 0 0",
              }}
            >
              A note from the Odinala team
            </Text>
          </Section>

          {/* AI-generated body */}
          <Section style={{ padding: "28px 28px 8px" }}>
            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.7",
                color: "#1a1a2e",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {emailBody}
            </Text>
          </Section>

          {/* CTA — stages 1 & 2 only */}
          {stage < 3 && (
            <Section style={{ textAlign: "center", padding: "20px 28px" }}>
              <Link
                href={propertyUrl}
                style={{
                  background: "#4950bc",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "14px",
                  display: "inline-block",
                }}
              >
                View {propertyName}
              </Link>
            </Section>
          )}

          {/* Footer */}
          <Section
            style={{
              padding: "20px 28px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#888",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              Odinala · Fractional Real Estate Investment
              <br />
              You are receiving this because you expressed interest in a property.
              <br />
              <Link href="{{unsubscribe_url}}" style={{ color: "#9d174d" }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
