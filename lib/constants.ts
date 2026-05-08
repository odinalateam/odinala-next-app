export const CHAT_TOPICS = [
  "Property Inquiry",
  "Land Inquiry",
  "Payment & Billing",
  "Order Status",
  "KYC Verification",
  "General Inquiry",
] as const;

export type ChatTopic = (typeof CHAT_TOPICS)[number];
