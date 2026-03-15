/**
 * Chatbot Q&A structure. Each item references message keys for i18n.
 * Add new items here and corresponding translations in messages/*.json
 */
const baseChatbotItemKeys = [
  "services",
  "process",
  "contact",
  "careers",
  "pricing",
  "technologies",
  "remote",
  "engagement",
] as const;

export type ChatbotItemKey = (typeof baseChatbotItemKeys)[number];

/** Excludes careers when page is hidden in production. */
export const chatbotItemKeys: readonly ChatbotItemKey[] =
  process.env.NODE_ENV === "production"
    ? baseChatbotItemKeys.filter((key): key is ChatbotItemKey => key !== "careers")
    : baseChatbotItemKeys;
