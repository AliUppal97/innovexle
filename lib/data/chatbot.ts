/**
 * Chatbot Q&A structure. Each item references message keys for i18n.
 * Add new items here and corresponding translations in messages/*.json
 */
export const chatbotItemKeys = [
  "services",
  "process",
  "contact",
  "careers",
  "pricing",
  "technologies",
  "remote",
  "engagement",
] as const;

export type ChatbotItemKey = (typeof chatbotItemKeys)[number];
