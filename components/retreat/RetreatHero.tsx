"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown, Sunrise } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TextilePattern } from "@/components/landing/TextilePattern";

export function RetreatHero({ language }: { language: "en" | "am" }) {
  const ref = useRef<HTMLElement>(null);
  const am = language === "am";

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const content = ref.current?.querySelector("[data-hero]");
      if (content && !reduce) {
        gsap.from(content.children, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.1,
        });
      }
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90svh] items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#E4A853] via-[#C17F2C] to-[#3D2C23]"
        style={{
          backgroundImage: `linear-gradient(rgba(36,26,20,0.30),rgba(36,26,20,0.55)), url(/retreat/hero.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-t from-[#15100c]/70 via-transparent to-transparent"
      />

      <TextilePattern
        patternId="retreat-hero-band"
        className="absolute inset-x-0 bottom-28 z-[2] h-7 text-[#E4A853]/40"
      />

      <div data-hero className="relative z-10 mx-auto max-w-2xl px-6 text-center text-[#FDFBF7]">
        <Badge className="mb-6 border-none bg-white/15 text-[#FDFBF7] backdrop-blur hover:bg-white/20">
          {am ? "የኩሪፍቱ ሪዞርት አጋር" : "Kuriftu Resort Partner"}
        </Badge>

        <h1 className="flex items-center justify-center gap-3 font-serif text-5xl font-light leading-[1.05] tracking-tight sm:text-7xl">
          <Sunrise className="size-9 text-[#E4A853] sm:size-12" strokeWidth={1.5} />
          {am ? "ሰላም ሪትሪት" : "Selam Retreat"}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#FDFBF7]/85 sm:text-lg">
          {am
            ? "ወደ መዝናኛዎ እንኳን በደህና መጡ። ቆይታዎን በሰላም ለመጀመር አንድ ቀላል ቅኝት እንስራ።"
            : "Welcome to your stay. Let's design a calm rhythm for your retreat — a curated day, shaped around how you arrive."}
        </p>

        <div className="mt-12 flex flex-col items-center gap-2 text-white/70">
          <span className="text-[11px] uppercase tracking-[0.3em]">
            {am ? "ወደ ታች ይሸብልሉ" : "Begin below"}
          </span>
          <ChevronDown className="size-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
