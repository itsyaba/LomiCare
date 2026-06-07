import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.35),transparent_60%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(74,124,89,0.22),transparent_65%)] blur-3xl"
      />

      <div className="container mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-secondary" />
          ሰላም &middot; built for Ethiopia, by Ethiopians
        </div>

        <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Your daily check-in,
          <br />
          <span className="italic text-primary">in your mother tongue.</span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Selam is a quiet, culturally aware wellness companion. Speak in
          Amharic or English, get gentle daily rituals, and stay close to the
          people who keep you well.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-full px-7">
            <Link href="/register">
              Begin <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 text-left">
          {[
            { k: "voice", v: "Amharic-first" },
            { k: "ai", v: "Culturally aware" },
            { k: "circle", v: "Family-rooted" },
          ].map((item) => (
            <div key={item.k} className="bg-background/80 p-5 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {item.k}
              </p>
              <p className="mt-1 font-serif text-lg text-foreground">
                {item.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
