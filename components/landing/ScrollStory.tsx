"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Coffee, Heart, Mic, Leaf, Quote } from "lucide-react";

import { TextilePattern } from "./TextilePattern";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CHAPTERS = [
  {
    eyebrow: "the problem",
    title: "Every wellness app",
    accent: "was built for someone else.",
    body: "They speak English. They suggest yoga at 6am and salmon for dinner. They have no place for fasting on Wednesday, for coffee with mother, for the quiet weight of community.",
    icon: <Heart className="size-5" />,
  },
  {
    eyebrow: "the response",
    title: "Selam speaks",
    accent: "in your mother tongue.",
    body: "Voice journaling in Amharic. Daily insights that know it's ጾመ ድህነት today. Rituals shaped around the buna table, not a treadmill. Proverbs your grandmother might have said.",
    icon: <Mic className="size-5" />,
  },
  {
    eyebrow: "the ritual",
    title: "Six stages of",
    accent: "the buna ceremony.",
    body: "Light incense. Roast the beans. Grind, brew, pour the first cup — abol. Then sit. Breathing rhythms guide each stage. The animation does what your body remembers.",
    icon: <Coffee className="size-5" />,
  },
  {
    eyebrow: "the garden",
    title: "Your streak is",
    accent: "a coffee plant.",
    body: "Check in daily and the plant grows from soil to seed to sprout, to a young coffee plant, to leaves, to flowers, to ripe cherries. The plant that built Ethiopian culture, growing inside an app that finally honours it.",
    icon: <Leaf className="size-5" />,
  },
  {
    eyebrow: "the wisdom",
    title: "ድር ቢያብር አንበሳ ያስር።",
    accent: "When spiders unite, they tie a lion.",
    body: "Forty curated Amharic proverbs run through every insight. Not as decoration — as anchors. This is wellness without the Western script.",
    icon: <Quote className="size-5" />,
  },
];

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const chapters = gsap.utils.toArray<HTMLElement>(
        ".scroll-story-chapter",
      );

      chapters.forEach((chapter) => {
        const eyebrow = chapter.querySelector(".chapter-eyebrow");
        const title = chapter.querySelector(".chapter-title");
        const body = chapter.querySelector(".chapter-body");
        const icon = chapter.querySelector(".chapter-icon");

        gsap.from([icon, eyebrow, title, body], {
          opacity: 0,
          y: 40,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: chapter,
            start: "top 75%",
          },
        });
      });

      // Vertical line draw between chapters
      const line = containerRef.current?.querySelector<HTMLElement>(
        ".scroll-story-line",
      );
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top center",
              end: "bottom center",
              scrub: 1,
            },
          },
        );
      }
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-gradient-to-b from-background via-[#f5ead0]/30 to-background py-32"
    >
      {/* Side textile band */}
      <TextilePattern
        orientation="vertical"
        patternId="story-side"
        className="absolute right-4 top-0 hidden h-full w-6 text-primary/30 md:block"
      />

      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            the story behind selam
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-foreground sm:text-5xl">
            Why this is{" "}
            <span className="italic text-primary">different.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Vertical drawing line */}
          <div
            aria-hidden
            className="scroll-story-line absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-primary/40 via-secondary/40 to-accent/40 md:block"
          />

          <div className="space-y-32">
            {CHAPTERS.map((c, idx) => (
              <div
                key={idx}
                className="scroll-story-chapter relative md:pl-20"
              >
                <div className="chapter-icon absolute left-0 top-1 hidden size-12 items-center justify-center rounded-full border border-border/60 bg-card text-primary shadow-sm backdrop-blur md:flex">
                  {c.icon}
                </div>
                <p className="chapter-eyebrow text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  {c.eyebrow}
                </p>
                <h3 className="chapter-title mt-3 font-serif text-3xl font-light leading-tight text-foreground sm:text-4xl">
                  {c.title}{" "}
                  <span className="italic text-primary">{c.accent}</span>
                </h3>
                <p className="chapter-body mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
