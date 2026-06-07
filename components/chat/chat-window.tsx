"use client";

import { useMemo, useState } from "react";
import { Loader2, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { SafetySupportCard } from "@/components/safety/SafetySupportCard";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWindow() {
  const { language, t } = useLanguage();
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t.chat.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [safetyRisk, setSafetyRisk] = useState<"none" | "low" | "medium" | "high">("none");
  const history = useMemo(() => messages.slice(-8), [messages]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setLoading(true);
    setSafetyRisk("none");
    setMessages((current) => [...current, { role: "user", content: message }]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId, language, history }),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.error ?? "I could not respond right now." },
      ]);
      return;
    }

    // Surface safety risk if flagged by the API
    if (payload.safetyRisk && payload.safetyRisk !== "none") {
      setSafetyRisk(payload.safetyRisk);
    }

    setSessionId(payload.sessionId);
    setMessages((current) => [
      ...current,
      { role: "assistant", content: payload.reply },
    ]);
  }

  function clearConversation() {
    setSessionId(crypto.randomUUID());
    setSafetyRisk("none");
    setMessages([{ role: "assistant", content: t.chat.fresh }]);
  }

  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col rounded-lg border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">{t.chat.title}</h1>
          <p className="text-sm text-muted-foreground">{t.chat.description}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={clearConversation}
          aria-label="Clear conversation"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Safety banner (shown inline when risk is medium/high) */}
      {(safetyRisk === "medium" || safetyRisk === "high") && (
        <div className="px-4 pt-4">
          <SafetySupportCard riskLevel={safetyRisk} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-muted/60 text-foreground",
              )}
            >
              {message.role === "assistant" && (
                <p className="mb-1 text-xs font-semibold text-secondary">Selam</p>
              )}
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Selam is thinking
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form className="border-t p-4" onSubmit={sendMessage}>
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.chat.placeholder}
            className="min-h-12 resize-none"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="mr-2 size-4" />
            {t.chat.send}
          </Button>
        </div>
      </form>
    </div>
  );
}
