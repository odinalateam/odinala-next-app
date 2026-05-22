export type LeadTier = "hot" | "warm" | "cold";

export interface LeadScoreBreakdown {
  location: number;
  signupSource: number;
  profileCompleteness: number;
  investmentBudget: number;
  emailDomain: number;
}

export interface LeadScoreResult {
  score: number;
  tier: LeadTier;
  breakdown: LeadScoreBreakdown;
}

export interface LeadScoreInput {
  email: string;
  country?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  investmentBudget?: string | null;
  propertyTypePreference?: string | null;
}

const HIGH_REMITTANCE_COUNTRIES = [
  "United Kingdom",
  "UK",
  "GB",
  "United States",
  "US",
  "USA",
  "Canada",
  "CA",
  "United Arab Emirates",
  "UAE",
  "AE",
  "Ireland",
  "IE",
];

const NIGERIA_IDENTIFIERS = ["Nigeria", "NG", "NGR"];

const CONSUMER_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "live.com",
  "me.com",
  "msn.com",
  "ymail.com",
];

export function calculateLeadScore(input: LeadScoreInput): LeadScoreResult {
  // Category 1: Location / Diaspora Status (0–3)
  let location = 0;
  if (input.country) {
    const c = input.country.trim();
    if (HIGH_REMITTANCE_COUNTRIES.some((h) => h.toLowerCase() === c.toLowerCase())) {
      location = 3;
    } else if (!NIGERIA_IDENTIFIERS.some((n) => n.toLowerCase() === c.toLowerCase())) {
      location = 2;
    } else {
      location = 1;
    }
  }

  // Category 2: Signup Source / UTM (0–3)
  let signupSource = 0;
  const src = input.utmSource?.toLowerCase() ?? "";
  const med = input.utmMedium?.toLowerCase() ?? "";
  const camp = input.utmCampaign?.toLowerCase() ?? "";

  if (src === "property-ad" || camp.includes("listing") || camp.includes("property")) {
    signupSource = 3;
  } else if (src === "referral" || med === "referral") {
    signupSource = 3;
  } else if (src === "webinar" || med === "webinar" || camp.includes("webinar")) {
    signupSource = 2;
  } else if (src === "social" || med === "social" || src === "instagram" || src === "facebook" || src === "twitter" || src === "tiktok") {
    signupSource = 1;
  }

  // Category 3: Profile Completeness (0–2)
  let profileCompleteness = 0;
  const hasBudget = !!input.investmentBudget && input.investmentBudget !== "exploring";
  const hasPropType = !!input.propertyTypePreference;
  if (hasBudget && hasPropType) {
    profileCompleteness = 2;
  } else if (hasBudget || hasPropType) {
    profileCompleteness = 1;
  }

  // Category 4: Investment Budget (0–2)
  let investmentBudget = 0;
  if (input.investmentBudget === "5M_plus") {
    investmentBudget = 2;
  } else if (input.investmentBudget === "1M_5M") {
    investmentBudget = 1;
  }

  // Category 5: Email Domain (0–1)
  let emailDomain = 0;
  const domain = input.email.split("@")[1]?.toLowerCase();
  if (domain && !CONSUMER_EMAIL_DOMAINS.includes(domain)) {
    emailDomain = 1;
  }

  const score = location + signupSource + profileCompleteness + investmentBudget + emailDomain;
  const tier: LeadTier = score >= 8 ? "hot" : score >= 4 ? "warm" : "cold";

  return {
    score,
    tier,
    breakdown: { location, signupSource, profileCompleteness, investmentBudget, emailDomain },
  };
}
