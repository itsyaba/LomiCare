"use client";

import { Sparkles, Quote } from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";
import { RichText } from "@/components/ui/rich-text";

type Props = {
  insight?: string;
  proverbAm?: string;
  proverbEn?: string;
  proverbMeaning?: string;
};

export function InsightCard({
  insight,
  proverbAm,
  proverbEn,
  proverbMeaning,
}: Props) {
  const { language } = useLanguage();
  const proverb = language === "am" ? proverbAm : proverbEn;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.18),transparent_70%)] blur-2xl"
      />
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {language === "am" ? "የቅርብ ግንዛቤ" : "Latest insight"}
        </p>
      </div>
      <p className="mt-4 font-serif text-lg leading-7 text-foreground">
        {insight ? (
          <RichText text={insight} />
        ) : language === "am" ? (
          "የመጀመሪያውን ምዝገባ ካደረጉ በኋላ የሰላም ግንዛቤ እዚህ ይታያል።"
        ) : (
          "Complete your first check-in to receive a personalised Selam insight."
        )}
      </p>
      {proverb && (
        <div className="mt-5 border-t border-border/40 pt-4">
          <div className="flex items-center gap-2">
            <Quote className="size-3.5 text-secondary" />
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {language === "am" ? "ምሳሌ" : "Proverb"}
            </p>
          </div>
          <p className="mt-2 font-serif text-base italic leading-7 text-foreground/90">
            “<RichText text={proverb} />”
          </p>
          {language === "en" && proverbMeaning && (
            <p className="mt-1 text-xs text-muted-foreground">
              <RichText text={proverbMeaning} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}
