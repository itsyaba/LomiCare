"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2, Sparkles, X, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Waveform } from "./Waveform";

type Extracted = {
  mood?: number;
  energy?: number;
  stress?: number;
  sleepHours?: number | null;
  cleanedNote?: string;
  summary?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtract: (data: Extracted) => void;
};

type Stage = "idle" | "listening" | "transcribed" | "processing" | "done";

const PHRASES_EN = [
  "I'm a bit tired but managed an afternoon walk.",
  "Stressed about a deadline. Slept around six hours.",
  "Felt grounded after coffee with my family.",
];
const PHRASES_AM = [
  "ዛሬ ትንሽ ድካም አለኝ፣ ግን ከሰዓት በኋላ ተራመድኩ።",
  "ለቀነ-ጊዜ ጭንቀት አለኝ፣ ስድስት ሰዓት ብቻ ተኝቻለሁ።",
  "ከቤተሰብ ጋር ቡና ከጠጣን በኋላ ተረጋጋሁ።",
];

export function VoiceCheckinDialog({ open, onOpenChange, onExtract }: Props) {
  const { language } = useLanguage();
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [textFallback, setTextFallback] = useState("");
  const recognitionRef = useRef<unknown>(null);
  const supported =
    typeof window !== "undefined" &&
    Boolean(
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition,
    );

  useEffect(() => {
    if (!open) {
      setStage("idle");
      setTranscript("");
      setTextFallback("");
    }
  }, [open]);

  function close() {
    onOpenChange(false);
  }

  function startListening() {
    type SRConstructor = new () => {
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      maxAlternatives: number;
      onstart: (() => void) | null;
      onerror: ((event: { error?: string }) => void) | null;
      onresult: ((event: {
        results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
        resultIndex: number;
      }) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    const w = window as unknown as Record<string, SRConstructor | undefined>;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!SR) {
      toast.error(
        language === "am"
          ? "ይህ መሣሪያ ድምፅን አይደግፍም። ጽሁፍ ይተይቡ።"
          : "Voice not supported in this browser. Type your note instead.",
      );
      return;
    }

    const recognition = new SR();
    recognition.lang = language === "am" ? "am-ET" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    let collected = "";

    recognition.onstart = () => setStage("listening");
    recognition.onerror = (event: { error?: string }) => {
      setStage("idle");
      toast.error(
        (language === "am" ? "ስህተት: " : "Voice error: ") +
          (event?.error ?? "unknown"),
      );
    };
    recognition.onresult = (event: {
      results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
      resultIndex: number;
    }) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          collected += r[0].transcript + " ";
        } else {
          interim += r[0].transcript;
        }
      }
      setTranscript((collected + interim).trim());
    };
    recognition.onend = () => {
      setTranscript(collected.trim());
      if (collected.trim().length > 0) {
        setStage("transcribed");
      } else {
        setStage("idle");
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  function stopListening() {
    if (recognitionRef.current) {
      (recognitionRef.current as { stop: () => void }).stop();
    }
  }

  async function processTranscript(text: string) {
    if (!text.trim()) {
      toast.error(
        language === "am"
          ? "ምንም ጽሁፍ የለም።"
          : "Nothing to process.",
      );
      return;
    }
    setStage("processing");
    try {
      const res = await fetch("/api/checkin/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, language }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Extraction failed");
      onExtract({
        mood: data.extracted?.mood,
        energy: data.extracted?.energy,
        stress: data.extracted?.stress,
        sleepHours: data.extracted?.sleepHours,
        cleanedNote: data.extracted?.cleanedNote ?? text,
        summary: data.extracted?.summary,
      });
      setStage("done");
      toast.success(
        language === "am" ? "ምዝገባው ተዘጋጅቷል።" : "Reading filled in for you.",
      );
      setTimeout(close, 800);
    } catch (err) {
      console.error(err);
      setStage("transcribed");
      toast.error(
        language === "am"
          ? "ማውጣት አልተሳካም።"
          : "Could not understand. Try again or type instead.",
      );
      // Still pass note through as fallback
      onExtract({ cleanedNote: text });
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <Sparkles className="size-3 text-primary" />
          {language === "am" ? "በድምፅ ምዝገባ" : "Voice check-in"}
        </div>
        <h2 className="mt-2 font-serif text-2xl text-foreground">
          {language === "am" ? "ስለ ቀንዎ" : "Tell me about your day"}
          <span className="ml-1 italic text-primary">
            {language === "am" ? "ይናገሩ።" : "out loud."}
          </span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {language === "am"
            ? "ስለ እንቅልፍ፣ ስሜት እና ጭንቀት ይናገሩ። ሰላም ይሰማል እና ምዝገባዎን ያሟላል።"
            : "Speak naturally about sleep, mood, and stress. Selam listens and fills in your check-in."}
        </p>

        {/* Waveform */}
        <div className="mt-5 overflow-hidden rounded-xl border border-border/60 bg-background/60">
          <Waveform isActive={stage === "listening"} />
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mt-4 rounded-xl border border-border/60 bg-background/60 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {language === "am" ? "የተተረጎመ" : "Transcript"}
            </p>
            <p className="mt-2 font-serif text-base leading-7 text-foreground">
              {transcript}
            </p>
          </div>
        )}

        {/* Text fallback when no Speech Recognition */}
        {!supported && stage === "idle" && (
          <div className="mt-4 rounded-xl border border-dashed border-border/60 bg-background/60 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {language === "am"
                ? "ድምፅ አይሰራም — ይተይቡ"
                : "Voice not supported — type instead"}
            </p>
            <textarea
              value={textFallback}
              onChange={(e) => setTextFallback(e.target.value)}
              placeholder={
                language === "am"
                  ? "ስለ ቀንዎ ይተይቡ…"
                  : "Type a sentence or two about your day…"
              }
              className="mt-2 h-24 w-full resize-none rounded-lg border border-border/60 bg-card p-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        )}

        {/* Example phrases */}
        {stage === "idle" && (
          <div className="mt-4 space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {language === "am" ? "ምሳሌዎች" : "Example phrases"}
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {(language === "am" ? PHRASES_AM : PHRASES_EN).map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
                  <span className="italic">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {stage === "idle" && supported && (
            <Button onClick={startListening} className="gap-2">
              <Mic className="size-4" />
              {language === "am" ? "ማዳመጥ ጀምር" : "Start speaking"}
            </Button>
          )}
          {stage === "idle" && !supported && (
            <Button
              onClick={() => processTranscript(textFallback)}
              className="gap-2"
              disabled={!textFallback.trim()}
            >
              <Wand2 className="size-4" />
              {language === "am" ? "ምዝገባ አውጣ" : "Extract check-in"}
            </Button>
          )}
          {stage === "listening" && (
            <Button
              onClick={stopListening}
              variant="outline"
              className="gap-2 border-red-500/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <MicOff className="size-4" />
              {language === "am" ? "ማቆም" : "Stop"}
            </Button>
          )}
          {stage === "transcribed" && (
            <>
              <Button
                onClick={() => processTranscript(transcript)}
                className="gap-2"
              >
                <Wand2 className="size-4" />
                {language === "am" ? "ምዝገባ አውጣ" : "Use this"}
              </Button>
              <Button onClick={startListening} variant="outline" className="gap-2">
                <Mic className="size-4" />
                {language === "am" ? "እንደገና" : "Try again"}
              </Button>
            </>
          )}
          {stage === "processing" && (
            <Button disabled className="gap-2">
              <Loader2 className="size-4 animate-spin" />
              {language === "am" ? "በመተንተን ላይ…" : "Reading what you said…"}
            </Button>
          )}
          {stage === "done" && (
            <p className="font-serif text-sm italic text-secondary">
              {language === "am" ? "ተጠናቋል።" : "Filled in. Closing…"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
