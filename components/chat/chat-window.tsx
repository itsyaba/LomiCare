"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Coffee,
  Leaf,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RichText } from "@/components/ui/rich-text";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { SafetySupportCard } from "@/components/safety/SafetySupportCard";
import { VoiceWaveform } from "@/components/chat/voice-waveform";

type Fasting = {
  isFasting: boolean;
  fastName: string | null;
  fastNameAm: string | null;
};

type Proverb = { am: string; en: string; meaning: string | null };

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Starter = {
  en: string;
  am: string;
  icon: "coffee" | "leaf" | "sparkles";
};

const STARTERS: Starter[] = [
  {
    en: "I've been feeling stretched thin this week.",
    am: "በዚህ ሳምንት በጣም ደክሞኛል።",
    icon: "leaf",
  },
  {
    en: "Today is a fasting day — what should I eat?",
    am: "ዛሬ ጾም ነው — ምን ብበላ ይሻላል?",
    icon: "coffee",
  },
  {
    en: "I can't sleep well. Any quiet ideas?",
    am: "ጥሩ መተኛት አልቻልኩም። የሚረዳኝ ጸጥ ያለ ሐሳብ አለ?",
    icon: "sparkles",
  },
  {
    en: "How do I take a real break during a busy day?",
    am: "በሥራ መካከል ትክክለኛ እረፍት እንዴት ላድርግ?",
    icon: "coffee",
  },
];

function IconFor({ name }: { name: Starter["icon"] }) {
  if (name === "coffee") return <Coffee className="size-3.5" />;
  if (name === "leaf") return <Leaf className="size-3.5" />;
  return <Sparkles className="size-3.5" />;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-secondary"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.18,
          }}
        />
      ))}
    </div>
  );
}

function SelamAvatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const reduce = useReducedMotion();
  const dim = size === "lg" ? "size-11" : "size-9";
  const leaf = size === "lg" ? "size-5" : "size-4";
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center", dim)}>
      {/* breathing glow halo */}
      <motion.span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.55),transparent_70%)] blur-md"
        animate={reduce ? undefined : { scale: [1, 1.35, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-[#e8b84b] via-[#c8622a] to-[#7a4525] shadow-md"
        animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className={cn("text-[#faf7f2]", leaf)} strokeWidth={2} />
      </motion.div>
      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-secondary" />
    </div>
  );
}

export function ChatWindow() {
  const { language, t, setLanguage } = useLanguage();
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t.chat.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [safetyRisk, setSafetyRisk] =
    useState<"none" | "low" | "medium" | "high">("none");
  const [fasting, setFasting] = useState<Fasting | null>(null);
  const [proverb, setProverb] = useState<Proverb | null>(null);
  const reduce = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<unknown>(null);
  const history = useMemo(() => messages.slice(-8), [messages]);

  // Cultural touches: today's fast + a proverb for the empty state
  useEffect(() => {
    fetch("/api/fasting/today")
      .then((r) => r.json())
      .then(setFasting)
      .catch(() => {});
    fetch("/api/proverbs/random")
      .then((r) => r.json())
      .then(setProverb)
      .catch(() => {});
  }, []);

  // Refresh greeting on language change (only if conversation untouched)
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([{ role: "assistant", content: t.chat.greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;

    setInput("");
    setLoading(true);
    setSafetyRisk("none");
    setMessages((current) => [...current, { role: "user", content: message }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId, language, history }),
        credentials: "include",
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: payload.error ?? "I could not respond right now.",
          },
        ]);
        return;
      }

      if (payload.safetyRisk && payload.safetyRisk !== "none") {
        setSafetyRisk(payload.safetyRisk);
      }
      setSessionId(payload.sessionId);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.reply },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  function clearConversation() {
    setSessionId(crypto.randomUUID());
    setSafetyRisk("none");
    setMessages([{ role: "assistant", content: t.chat.fresh }]);
  }

  function startListening() {
    type SRC = new () => {
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      onresult: ((event: {
        results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
        resultIndex: number;
      }) => void) | null;
      onerror: ((event: { error?: string }) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    const w = window as unknown as Record<string, SRC | undefined>;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;

    const r = new SR();
    r.lang = language === "am" ? "am-ET" : "en-US";
    r.interimResults = true;
    r.continuous = false;

    let collected = "";
    r.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) collected += result[0].transcript + " ";
        else interim += result[0].transcript;
      }
      setInput((collected + interim).trim());
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    setListening(true);
    recognitionRef.current = r;
  }

  function stopListening() {
    if (recognitionRef.current) {
      (recognitionRef.current as { stop: () => void }).stop();
    }
    setListening(false);
  }

  const supportsVoice =
    typeof window !== "undefined" &&
    Boolean(
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition,
    );

  return (
    <div className="relative flex min-h-[calc(100svh-10rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
      {/* Warm ambient backdrop inside the chat surface — slowly breathing */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.22),transparent_70%)] blur-2xl"
        animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgba(74,124,89,0.18),transparent_70%)] blur-2xl"
        animate={reduce ? undefined : { scale: [1, 1.22, 1], opacity: [0.6, 0.95, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <SelamAvatar size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-serif text-xl text-foreground">Selam</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-secondary">
                <span className="size-1.5 rounded-full bg-secondary" />
                online
              </span>
              {fasting?.isFasting && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {language === "am"
                    ? `${fasting.fastNameAm ?? "ጾም"} · ጾም`
                    : `${fasting.fastName ?? "Fasting"} · fasting day`}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "am"
                ? "በባህል የተመሠረተ የጤና ድጋፍ"
                : "Culturally grounded wellness — not medical care."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="hidden items-center gap-1 rounded-full border border-border/60 bg-background/60 p-1 sm:flex">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                language === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("am")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                language === "am"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              አማ
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={clearConversation}
            aria-label={language === "am" ? "ጨርስ" : "Clear conversation"}
            title={language === "am" ? "ጨርስ" : "Start fresh"}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Safety banner */}
      {(safetyRisk === "medium" || safetyRisk === "high") && (
        <div className="px-5 pt-4">
          <SafetySupportCard riskLevel={safetyRisk} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.role}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex items-start gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              {message.role === "assistant" && <SelamAvatar />}
              <div
                className={cn(
                  "group relative max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm",
                  message.role === "user"
                    ? "rounded-tr-md bg-primary text-primary-foreground"
                    : "rounded-tl-md border border-border/60 bg-background/80 text-foreground",
                )}
              >
                {message.role === "assistant" && (
                  <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-secondary">
                    Selam
                  </p>
                )}
                <p className="whitespace-pre-line font-serif text-[15px] leading-7">
                  <RichText text={message.content} />
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <SelamAvatar />
            <div className="rounded-2xl rounded-tl-md border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
              <TypingDots />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter prompts (only before user has sent anything) */}
      {messages.length <= 1 && !loading && (
        <div className="border-t border-border/60 bg-background/40 px-5 py-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {language === "am" ? "ለመጀመር" : "Try one of these"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s.en}
                type="button"
                onClick={() => send(language === "am" ? s.am : s.en)}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-foreground/80 transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                <span className="text-primary">
                  <IconFor name={s.icon} />
                </span>
                <span className="font-serif italic">
                  {language === "am" ? s.am : s.en}
                </span>
              </button>
            ))}
          </div>

          {proverb && (
            <div className="mt-4 flex items-start gap-2 border-t border-border/40 pt-3">
              <Sparkles className="mt-0.5 size-3 shrink-0 text-secondary" />
              <p className="font-serif text-sm italic leading-6 text-muted-foreground">
                {language === "am" ? proverb.am : proverb.en}
                {language === "en" && proverb.meaning && (
                  <span className="text-foreground/50"> — {proverb.meaning}</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form
        className="border-t border-border/60 bg-background/60 p-4"
        onSubmit={handleSubmit}
      >
        {listening && (
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2">
            <VoiceWaveform active={listening} />
            <span className="text-xs font-medium text-primary">
              {language === "am" ? "በማዳመጥ ላይ…" : "Listening…"}
            </span>
          </div>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              listening
                ? language === "am"
                  ? "በማዳመጥ ላይ…"
                  : "Listening…"
                : t.chat.placeholder
            }
            className="min-h-12 resize-none rounded-xl border-border/60 bg-card/80 font-serif text-[15px]"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          {supportsVoice && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={listening ? stopListening : startListening}
              className={cn(
                "shrink-0",
                listening &&
                  "border-red-500/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
              )}
              aria-label={listening ? "Stop voice" : "Voice input"}
            >
              {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 gap-2"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            <span className="hidden sm:inline">{t.chat.send}</span>
          </Button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {language === "am"
            ? "ሰላም ለግል ድጋፍ ነው። የአደጋ ስሜት ካለ የታመነ ሰው ያነጋግሩ።"
            : "Selam supports — it doesn't diagnose. If you're in danger, reach out to a trusted person."}
        </p>
      </form>
    </div>
  );
}
