"use client";

import { Flame } from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";
import type { FastingContext } from "@/lib/fasting-calendar";

type Props = {
  context: FastingContext;
};

export function FastingPill({ context }: Props) {
  const { language } = useLanguage();
  if (!context.isFasting) return null;
  const name = language === "am" ? context.fastNameAm : context.fastName;
  const guidance = language === "am" ? context.guidanceAm : context.guidance;

  return (
    <div
      className="group relative inline-flex max-w-xs items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 backdrop-blur"
      title={guidance}
    >
      <Flame className="size-3.5 text-secondary" strokeWidth={2} />
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-secondary">
        {name}
      </span>
      <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-64 -translate-x-1/2 rounded-lg border border-border/60 bg-card p-3 text-left text-xs text-muted-foreground shadow-lg group-hover:block">
        <p className="font-serif text-sm text-foreground">
          {language === "am" ? "ጾም ዛሬ" : "Fasting today"}
        </p>
        <p className="mt-1 leading-5">{guidance}</p>
      </div>
    </div>
  );
}
