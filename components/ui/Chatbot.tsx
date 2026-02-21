"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { chatbotItemKeys, type ChatbotItemKey } from "@/lib/data/chatbot";

const TYPEWRITER_DELAY_MS = 25;
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function findMatchingQuestion(userInput: string, t: (key: string) => string): ChatbotItemKey | null {
  const normalized = normalizeForMatch(userInput);
  if (!normalized || normalized.length < 3) return null;

  let bestMatch: { key: ChatbotItemKey; score: number } | null = null;

  for (const key of chatbotItemKeys) {
    const q = t(`chatbot.items.${key}.q`);
    const a = t(`chatbot.items.${key}.a`);
    if (!q || !a || q === `chatbot.items.${key}.q`) continue;

    const normalizedQ = normalizeForMatch(q);
    const words = normalized.split(" ");
    const qWords = normalizedQ.split(" ");

    let score = 0;
    if (normalizedQ.includes(normalized) || normalized.includes(normalizedQ)) {
      score = 100;
    } else {
      const matchCount = words.filter((w) => w.length > 2 && qWords.some((qw) => qw.includes(w) || w.includes(qw))).length;
      score = (matchCount / Math.max(words.length, 1)) * 50;
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key: key as ChatbotItemKey, score };
    }
  }

  return bestMatch && bestMatch.score >= 30 ? bestMatch.key : null;
}

function TypewriterText({
  text,
  onComplete,
  speedMs,
  prefersReducedMotion,
  className,
}: {
  text: string;
  onComplete?: () => void;
  speedMs: number;
  prefersReducedMotion: boolean;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      onComplete?.();
      return;
    }

    indexRef.current = 0;
    setDisplayed("");
    let cancelled = false;

    const typeNext = () => {
      if (cancelled || indexRef.current >= text.length) {
        onComplete?.();
        return;
      }
      const char = text[indexRef.current];
      indexRef.current += 1;
      setDisplayed((prev) => prev + char);
      const delay = [".", "!", "?"].includes(char) ? speedMs * 8 : speedMs;
      timeoutRef.current = setTimeout(typeNext, delay);
    };

    timeoutRef.current = setTimeout(typeNext, speedMs);
    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speedMs, prefersReducedMotion, onComplete]);

  return <p className={cn("text-small text-foreground leading-relaxed", className)}>{displayed}</p>;
}

export function Chatbot() {
  const t = useTranslations();
  const tA11y = useTranslations("a11y");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; typing?: boolean }[]>([]);
  const [typingKey, setTypingKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && !typingKey) {
      inputRef.current?.focus();
    }
  }, [open, typingKey]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || typingKey) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    const matchedKey = findMatchingQuestion(trimmed, (k) => t(k));

    let answerText: string;
    if (matchedKey) {
      answerText = t(`chatbot.items.${matchedKey}.a`);
    } else {
      answerText = t("chatbot.fallback");
    }

    const msgId = `msg-${Date.now()}`;
    setTypingKey(msgId);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: answerText, typing: true },
    ]);
  }, [input, typingKey, t]);

  const handleQuestionClick = useCallback(
    (key: ChatbotItemKey) => {
      const question = t(`chatbot.items.${key}.q`);
      const answer = t(`chatbot.items.${key}.a`);
      if (!question || !answer || typingKey) return;

      setTypingKey(`typing-${key}`);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: answer, typing: true },
      ]);
    },
    [t, typingKey]
  );

  const handleTypingComplete = useCallback(() => {
    setTypingKey(null);
    setMessages((prev) =>
      prev.map((m) => (m.typing ? { ...m, typing: false } : m))
    );
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? tA11y("chatbotClose") : tA11y("chatbotOpen")}
        aria-expanded={open}
        className={cn(
          "fixed z-[48] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg shadow-black/10 transition-colors hover:bg-muted/10 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:shadow-black/30 sm:h-11 sm:w-11",
          "bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] end-[max(1.25rem,env(safe-area-inset-inline-end,0px))] sm:bottom-6 sm:end-6"
        )}
      >
        <svg
          className="h-5 w-5 sm:h-[18px] sm:w-[18px]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2, ease: "easeOut" }}
            className="fixed z-[49] flex w-[calc(100vw-2rem)] max-w-sm flex-col rounded-xl border border-border bg-card shadow-xl dark:shadow-black/30 bottom-[max(5.5rem,calc(env(safe-area-inset-bottom,0px)+5.5rem))] end-4 start-auto sm:bottom-[5.5rem] sm:end-6 sm:max-w-md"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-small font-semibold text-foreground">{t("chatbot.title")}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={tA11y("chatbotClose")}
                className="rounded p-1.5 text-muted hover:bg-muted/50 hover:text-foreground transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[min(60vh,320px)] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <>
                  <p className="text-small text-muted">{t("chatbot.greeting")}</p>
                  <div>
                    <h3 className="text-small font-semibold text-foreground mb-2">
                      {t("chatbot.suggestedQuestions")}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {chatbotItemKeys.map((key) => {
                        const q = t(`chatbot.items.${key}.q`);
                        if (!q || q === `chatbot.items.${key}.q`) return null;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleQuestionClick(key)}
                            className="text-left rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-small text-foreground hover:bg-muted/60 hover:border-accent/30 transition-colors"
                          >
                            {q}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg px-3 py-2",
                            msg.role === "user"
                              ? "bg-accent text-accent-foreground"
                              : "border border-border bg-muted/30"
                          )}
                        >
                          {msg.role === "user" ? (
                            <p className="text-small">{msg.content}</p>
                          ) : msg.typing ? (
                            <TypewriterText
                              text={msg.content}
                              onComplete={handleTypingComplete}
                              speedMs={TYPEWRITER_DELAY_MS}
                              prefersReducedMotion={prefersReducedMotion}
                            />
                          ) : (
                            <p className="text-small text-foreground leading-relaxed">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMessages([]); setTypingKey(null); }}
                    className="text-small text-accent hover:underline"
                  >
                    {t("chatbot.viewMoreQuestions")}
                  </button>
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("chatbot.placeholder")}
                  disabled={!!typingKey}
                  aria-label={t("chatbot.placeholder")}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || !!typingKey}
                  aria-label={t("chatbot.placeholder")}
                  className="rounded-lg bg-accent px-4 py-2 text-small font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <button
          type="button"
          aria-label={tA11y("chatbotClose")}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[47] cursor-pointer bg-black/20 backdrop-blur-[2px]"
        />
      )}
    </>
  );
}
