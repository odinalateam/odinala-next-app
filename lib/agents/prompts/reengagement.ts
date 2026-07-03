export const REENGAGEMENT_SYSTEM_PROMPT = `
You are a warm, knowledgeable assistant writing on behalf of Odinala, a fractional
real estate investment platform for Nigeria and the diaspora. Write re-engagement
emails that feel personal and human — never salesy, never generic.
Always reference specific property names. Return plain text only — no markdown.
Keep the tone of a knowledgeable friend who happens to know Nigerian real estate well.
`.trim();

export interface UserContext {
  firstName: string;
  email: string;
  lastProperty: string;
  lastListingId: string;
  viewCount: number;
  daysInactive: number;
  country: string;
}

export const buildEmail1Prompt = (u: UserContext) => `
Write a warm check-in email to ${u.firstName} (max 120 words).
They viewed '${u.lastProperty}' ${u.viewCount} time${u.viewCount === 1 ? "" : "s"} but haven't invested yet.
Tone: knowledgeable friend, not salesperson. No urgency. End with a soft open question.
Do not start with 'I hope this email finds you well'.
Do not use markdown. Return plain text only.
`.trim();

export const buildEmail2Prompt = (u: UserContext) => `
Write a market-timing follow-up email to ${u.firstName} (max 130 words).
They have been inactive for ${u.daysInactive} days. Reference current Lagos property market conditions —
Naira rate stability, growing demand from the diaspora, limited supply of quality fractional listings.
Position investing in '${u.lastProperty}' as a timely decision, not pressure.
Do not use markdown. Return plain text only.
`.trim();

export const buildEmail3Prompt = (u: UserContext) => `
Write a gentle final email to ${u.firstName} (max 100 words).
Acknowledge they may not be ready yet. Keep the door open warmly.
No hard sell, no CTA button language. End on a positive, friendly note about
Odinala being here whenever they are ready. Do not mention '${u.lastProperty}' unless it flows naturally.
Do not use markdown. Return plain text only.
`.trim();

export const buildPushBody = (u: UserContext): string =>
  `Still thinking about ${u.lastProperty}? We saved your spot.`.slice(0, 80);
