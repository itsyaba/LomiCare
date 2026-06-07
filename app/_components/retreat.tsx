import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { retreatImage } from "./retreat-image";

const highlights = [
  "Guided in-resort check-ins, morning and evening",
  "Buna ceremony, lake walks, and silent hours, scheduled gently",
  "Private wellness journal that travels home with you",
];

export default function RetreatShowcase() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-foreground text-background py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.18),transparent_60%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(200,98,42,0.22),transparent_60%)] blur-3xl"
      />

      <div className="container mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-background/70 backdrop-blur">
            <MapPin className="size-3" /> Kuriftu retreat
          </div>
          <h2 className="font-serif text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
            Slow down at the lake.
            <br />
            <span className="italic text-accent">Carry the peace home.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-background/70">
            Selam Retreat is a guided wellness layer built with Kuriftu Resorts.
            Designed for guests who want stillness without losing what makes a
            stay here feel like Ethiopia.
          </p>

          <ul className="mt-8 space-y-4 border-l border-background/20 pl-6">
            {highlights.map((h) => (
              <li key={h} className="text-sm leading-6 text-background/80">
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-background/30 bg-transparent px-7 text-background hover:bg-background hover:text-foreground"
            >
              <Link href="/retreat">
                Explore retreat mode <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-background/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={retreatImage}
            alt="Kuriftu retreat — lakeside calm"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(26,18,8,0.15)_45%,rgba(26,18,8,0.85)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-background/60">
              Day 02 &middot; Bishoftu
            </p>
            <p className="font-serif text-2xl leading-snug text-background">
              "Sit with the lake for ten minutes. Notice what gets quieter."
            </p>
          </div>
          <div className="absolute right-6 top-6 rounded-full bg-background/10 px-3 py-1 text-xs text-background/80 backdrop-blur">
            ሰላም
          </div>
        </div>
      </div>
    </section>
  );
}
