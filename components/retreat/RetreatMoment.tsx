"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { RichText } from "@/components/ui/rich-text";
import { TextilePattern } from "@/components/landing/TextilePattern";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type Moment = {
  /** time-of-day eyebrow, e.g. "First light" */
  eyebrow: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  /** /retreat/<name>.jpg — degrades to the gradient if missing */
  image: string;
  /** Tailwind gradient classes used as the base (and fallback) backdrop */
  gradient: string;
  /** the closing reflection moment is centred + quieter */
  quiet?: boolean;
};

export function RetreatMoment({
  moment,
  index,
  total,
}: {
  moment: Moment;
  index: number;
  total: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      const content = sectionRef.current?.querySelector("[data-content]");
      if (content) {
        gsap.from(content.children, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        });
      }

      const bg = sectionRef.current?.querySelector<HTMLElement>("[data-bg]");
      if (bg) {
        gsap.fromTo(
          bg,
          { yPercent: -8, scale: 1.08 },
          {
            yPercent: 8,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[85svh] items-center justify-center overflow-hidden"
    >
      {/* Backdrop: gradient base (also the graceful fallback) + photo on top */}
      <div
        data-bg
        aria-hidden
        className={`absolute inset-0 z-0 bg-gradient-to-b ${moment.gradient}`}
        style={{
          backgroundImage: `linear-gradient(rgba(36,26,20,0.32),rgba(36,26,20,0.55)), url(${moment.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Extra warm scrim for legibility */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-t from-[#15100c]/80 via-transparent to-[#15100c]/30"
      />

      <div
        data-content
        className={`relative z-10 mx-auto w-full max-w-2xl px-6 py-24 text-[#FDFBF7] ${
          moment.quiet ? "text-center" : "text-left"
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            moment.quiet ? "justify-center" : ""
          }`}
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[#FDFBF7] backdrop-blur">
            {moment.icon}
          </span>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
            {moment.eyebrow}
          </p>
        </div>

        <h2 className="mt-5 font-serif text-3xl font-light leading-tight sm:text-4xl">
          {moment.quiet ? (
            <span className="italic">
              &ldquo;<RichText text={moment.body} />&rdquo;
            </span>
          ) : (
            moment.title
          )}
        </h2>

        {!moment.quiet && (
          <p className="mt-5 max-w-xl font-serif text-lg leading-8 text-[#FDFBF7]/90">
            <RichText text={moment.body} />
          </p>
        )}

        {moment.quiet && (
          <div className="mx-auto mt-8 w-40 opacity-60">
            <TextilePattern
              patternId={`retreat-moment-${index}`}
              className="h-6 text-[#E4A853]"
            />
          </div>
        )}

        <p
          className={`mt-8 text-[11px] uppercase tracking-[0.3em] text-white/40 ${
            moment.quiet ? "" : ""
          }`}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
