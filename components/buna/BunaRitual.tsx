"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Pause, Play, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { BunaIllustration } from "./BunaIllustration";

type StageKey = "incense" | "roast" | "grind" | "brew" | "pour" | "reflect";

type StageDef = {
  key: StageKey;
  durationSec: number;
  eyebrow: { en: string; am: string };
  title: { en: string; am: string };
  body: { en: string; am: string };
  /** Breathing pattern: in / hold / out / hold seconds */
  breath: [number, number, number, number];
};

const STAGES: StageDef[] = [
  {
    key: "incense",
    durationSec: 30,
    eyebrow: { en: "stage 1 of 6", am: "1 ከ 6" },
    title: {
      en: "Etan — set the room",
      am: "ኢታን — ቦታውን አዘጋጅ",
    },
    body: {
      en: "Light the incense. Let the smoke gather. Slow your breath in time with it.",
      am: "ኢታን አቅጥሉ። ጢሱ እንዲሰበሰብ ይፍቀዱ። ትንፋሽዎን ከእሱ ጋር ያረጋጉ።",
    },
    breath: [4, 2, 6, 2],
  },
  {
    key: "roast",
    durationSec: 45,
    eyebrow: { en: "stage 2 of 6", am: "2 ከ 6" },
    title: { en: "Roast", am: "መጥበሻ" },
    body: {
      en: "Green beans turn golden, then deep brown. Watch them shift without rushing the heat.",
      am: "አረንጓዴ ቡና ወደ ቡናማ ይለወጣል። እሳቱን ሳይቸኩሉ ያስተውሉ።",
    },
    breath: [4, 4, 6, 2],
  },
  {
    key: "grind",
    durationSec: 35,
    eyebrow: { en: "stage 3 of 6", am: "3 ከ 6" },
    title: { en: "Grind", am: "መፍጨት" },
    body: {
      en: "The pestle finds a rhythm. Let your shoulders drop. Let your jaw soften.",
      am: "ዝምጥ የራሱን ጊዜ ይይዛል። ትከሻዎችዎን ይተውዋቸው።",
    },
    breath: [4, 0, 6, 0],
  },
  {
    key: "brew",
    durationSec: 40,
    eyebrow: { en: "stage 4 of 6", am: "4 ከ 6" },
    title: { en: "Brew", am: "መፍላት" },
    body: {
      en: "Water meets the jebena. Steam rises. Nothing else has to happen right now.",
      am: "ውሃው ጀበናውን ይገናኛል። ጢስ ይነሣል። ሌላ ምንም መሆን አያስፈልግም።",
    },
    breath: [4, 4, 8, 0],
  },
  {
    key: "pour",
    durationSec: 30,
    eyebrow: { en: "stage 5 of 6", am: "5 ከ 6" },
    title: { en: "Abol — first pour", am: "አቦል — የመጀመሪያ ቅዳ" },
    body: {
      en: "Pour from high. The smell arrives before the taste. This is for you, before anyone else.",
      am: "ከከፍ ብለው ይክተቱ። መዓዛው ከጣዕም በፊት ይመጣል። ይህ ቡና ለእርስዎ ነው።",
    },
    breath: [4, 2, 6, 2],
  },
  {
    key: "reflect",
    durationSec: 35,
    eyebrow: { en: "stage 6 of 6", am: "6 ከ 6" },
    title: { en: "Sit", am: "ቆዩ" },
    body: {
      en: "Hold the cup. Let one quiet thought come — and let it pass. That's all this ritual is.",
      am: "ብርጭቆውን ይያዙ። አንድ ጸጥ ያለ ሐሳብ ይምጣና ይሂድ።",
    },
    breath: [6, 2, 8, 2],
  },
];

export function BunaRitual() {
  const router = useRouter();
  const { language } = useLanguage();
  const [stageIdx, setStageIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  const stage = STAGES[stageIdx];
  const totalDuration = useMemo(
    () => STAGES.reduce((acc, s) => acc + s.durationSec, 0),
    [],
  );
  const stageProgress = Math.min(1, elapsed / stage.durationSec);
  const overallElapsed = useMemo(
    () => STAGES.slice(0, stageIdx).reduce((a, s) => a + s.durationSec, 0) + elapsed,
    [stageIdx, elapsed],
  );

  // Stage timer
  useEffect(() => {
    if (paused || finished) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= stage.durationSec) {
          if (stageIdx === STAGES.length - 1) {
            setFinished(true);
            return stage.durationSec;
          }
          setStageIdx((s) => Math.min(STAGES.length - 1, s + 1));
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [paused, stage.durationSec, stageIdx, finished]);

  // Audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    if (muted || paused || finished) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [muted, paused, finished]);

  // Mark complete in DB once finished
  useEffect(() => {
    if (!finished) return;
    fetch("/api/ritual/buna/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        durationSec: Math.round((Date.now() - startTimeRef.current) / 1000),
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        toast.success(
          language === "am" ? "የቡና ሥነ ሥርዓቱ ተጠናቅቋል።" : "Buna ritual complete.",
        );
      })
      .catch(() => {});
  }, [finished, language]);

  const breathTotalSec = stage.breath.reduce((a, b) => a + b, 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1a1208] text-[#faf7f2]">
      <audio ref={audioRef} loop preload="auto" src="/audio/buna-ambient.mp3" />

      {/* Warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,98,42,0.25) 0%, rgba(26,18,8,0) 60%)",
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#faf7f2]/70 transition hover:text-[#faf7f2]"
        >
          <ChevronLeft className="size-4" />
          {language === "am" ? "ይውጡ" : "Leave"}
        </button>
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#faf7f2]/50">
          {language === "am" ? "የቡና ሥነ ሥርዓት" : "Buna ceremony"}
        </div>
        <button
          onClick={() => setMuted((m) => !m)}
          className="rounded-full p-2 text-[#faf7f2]/70 transition hover:bg-white/5 hover:text-[#faf7f2]"
          aria-label="toggle audio"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>

      {/* Overall progress */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <div className="h-px w-full bg-white/10">
          <div
            className="h-px bg-[#e8b84b] transition-[width] duration-300"
            style={{ width: `${(overallElapsed / totalDuration) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-4xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
        {/* Illustration + breath ring */}
        <div className="relative">
          <BunaIllustration stage={stage.key} />

          {/* Breath ring overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="size-32 rounded-full border border-[#e8b84b]/50"
              style={{
                animation: `bunaBreath ${breathTotalSec}s ease-in-out infinite`,
              }}
            />
          </div>
          <style>{`
            @keyframes bunaBreath {
              0% { transform: scale(0.6); opacity: 0.4; }
              ${(stage.breath[0] / breathTotalSec) * 100}% { transform: scale(1.1); opacity: 0.8; }
              ${((stage.breath[0] + stage.breath[1]) / breathTotalSec) * 100}% { transform: scale(1.1); opacity: 0.8; }
              ${((stage.breath[0] + stage.breath[1] + stage.breath[2]) / breathTotalSec) * 100}% { transform: scale(0.6); opacity: 0.4; }
              100% { transform: scale(0.6); opacity: 0.4; }
            }
          `}</style>
        </div>

        {/* Narration */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#e8b84b]">
            {stage.eyebrow[language]}
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#faf7f2]">
            {stage.title[language]}
          </h2>
          <p className="mt-5 font-serif text-lg leading-8 text-[#faf7f2]/80">
            {stage.body[language]}
          </p>

          <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-[#faf7f2]/40">
            {language === "am" ? "ትንፋሽ" : "Breath"} ·{" "}
            {stage.breath[0]}-{stage.breath[1]}-{stage.breath[2]}-{stage.breath[3]}
          </p>

          {/* Stage progress */}
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-[#c8622a] transition-[width] duration-100"
              style={{ width: `${stageProgress * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setPaused((p) => !p)}
              variant="outline"
              className="gap-2 border-white/20 bg-transparent text-[#faf7f2] hover:bg-white/10 hover:text-[#faf7f2]"
              disabled={finished}
            >
              {paused ? (
                <>
                  <Play className="size-4" />
                  {language === "am" ? "ቀጥል" : "Resume"}
                </>
              ) : (
                <>
                  <Pause className="size-4" />
                  {language === "am" ? "አቁም" : "Pause"}
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                if (stageIdx < STAGES.length - 1) {
                  setStageIdx((s) => s + 1);
                  setElapsed(0);
                }
              }}
              variant="ghost"
              className="text-[#faf7f2]/60 hover:bg-white/5 hover:text-[#faf7f2]"
              disabled={finished || stageIdx === STAGES.length - 1}
            >
              {language === "am" ? "ቀጣይ ደረጃ" : "Next stage →"}
            </Button>
          </div>

          {finished && (
            <div className="mt-10 rounded-2xl border border-[#e8b84b]/40 bg-[#e8b84b]/10 p-6 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#e8b84b]">
                {language === "am" ? "ተጠናቋል" : "Complete"}
              </p>
              <p className="mt-3 font-serif text-2xl text-[#faf7f2]">
                {language === "am"
                  ? "ሰላም ይሁንልዎ።"
                  : "Peace be with you."}
              </p>
              <p className="mt-2 text-sm text-[#faf7f2]/70">
                {language === "am"
                  ? "ይህ ጊዜ ለእርስዎ ነበር።"
                  : "This time was yours alone."}
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="mt-5 bg-[#c8622a] text-[#faf7f2] hover:bg-[#c8622a]/90"
              >
                {language === "am" ? "ወደ ዳሽቦርድ" : "Back to dashboard"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
