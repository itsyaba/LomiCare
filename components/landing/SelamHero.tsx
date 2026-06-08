"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Mic, Coffee, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TextilePattern } from "./TextilePattern";
import { TryDemoButton } from "@/components/demo/TryDemoButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SelamHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const amharicRef = useRef<HTMLSpanElement>(null);
  const englishRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const textileTopRef = useRef<SVGSVGElement>(null);
  const textileBottomRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Typewrite ሰላም
      const amharic = amharicRef.current;
      if (amharic) {
        const text = "ሰላም";
        amharic.textContent = "";
        const chars = text.split("");
        const spans = chars.map((c) => {
          const s = document.createElement("span");
          s.textContent = c;
          s.style.opacity = "0";
          s.style.display = "inline-block";
          amharic.appendChild(s);
          return s;
        });
        if (!reduce) {
          gsap.to(spans, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.25,
            ease: "power2.out",
            delay: 0.2,
          });
        } else {
          spans.forEach((s) => (s.style.opacity = "1"));
        }
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: reduce ? 0 : 1.4,
      });
      tl.from(englishRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
      })
        .from(
          subRef.current,
          { opacity: 0, y: 20, duration: 0.7 },
          "-=0.5",
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 20, duration: 0.7 },
          "-=0.4",
        )
        .from(
          chipsRef.current?.children ?? [],
          { opacity: 0, y: 14, duration: 0.5, stagger: 0.1 },
          "-=0.3",
        );

      if (!reduce) {
        // Animated textile bands — draw on as they enter
        if (textileTopRef.current) {
          gsap.from(textileTopRef.current, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.6,
            delay: 0.4,
            ease: "power3.inOut",
          });
        }
        if (textileBottomRef.current) {
          gsap.from(textileBottomRef.current, {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 1.6,
            delay: 0.6,
            ease: "power3.inOut",
          });
        }

        // Parallax on the warm radial glow
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const glow = containerRef.current?.querySelector<HTMLElement>(
              "[data-hero-glow]",
            );
            if (glow) {
              glow.style.transform = `translateY(${self.progress * 80}px) scale(${1 + self.progress * 0.15})`;
            }
          },
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden"
    >
      {/* Warm glow */}
      <div
        aria-hidden
        data-hero-glow
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.32),rgba(200,98,42,0.12),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 -z-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(74,124,89,0.22),transparent_65%)] blur-3xl"
      />

      {/* Top textile band */}
      <TextilePattern
        ref={textileTopRef}
        patternId="hero-textile-top"
        className="absolute inset-x-0 top-20 h-8 text-primary/40"
      />

      <div className="container mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-secondary" />
          <span ref={amharicRef} className="font-serif text-base text-foreground">
            ሰላም
          </span>
          <span className="opacity-60">·</span>
          built for Ethiopia, by Ethiopians
        </div>

        <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          <span ref={englishRef} className="inline-block">
            Wellness,{" "}
            <span className="italic text-primary">in your mother tongue.</span>
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
        >
          Selam is a quiet, culturally aware companion. Speak in Amharic. Drink
          buna. Honour the fasts. Let an AI that finally understands your world
          walk with you through the week.
        </p>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <TryDemoButton size="lg" className="h-12 rounded-full px-7" />
          <Link
            href="/register"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
          >
            Create an account
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Differentiator chips */}
        <div
          ref={chipsRef}
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 text-left sm:grid-cols-3"
        >
          <Chip
            icon={<Mic className="size-4" strokeWidth={1.75} />}
            eyebrow="voice"
            title="Speak, don't slide"
            sub="Journal in Amharic or English — the AI fills in the rest."
          />
          <Chip
            icon={<Coffee className="size-4" strokeWidth={1.75} />}
            eyebrow="ritual"
            title="The Buna ceremony"
            sub="Six guided stages, the way your grandmother poured it."
          />
          <Chip
            icon={<Sparkles className="size-4" strokeWidth={1.75} />}
            eyebrow="culture"
            title="ጾም-aware AI"
            sub="Knows your fasts, your foods, your proverbs."
          />
        </div>
      </div>

      {/* Bottom textile band */}
      <TextilePattern
        ref={textileBottomRef}
        patternId="hero-textile-bottom"
        className="absolute inset-x-0 bottom-16 h-8 text-secondary/40"
      />
    </section>
  );
}

function Chip({
  icon,
  eyebrow,
  title,
  sub,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="bg-background/80 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      </div>
      <p className="mt-2 font-serif text-lg text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{sub}</p>
    </div>
  );
}
