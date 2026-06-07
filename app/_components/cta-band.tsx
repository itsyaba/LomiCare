import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CTABand() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-muted/40 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[repeating-linear-gradient(90deg,#c8622a_0_24px,#e8b84b_24px_48px,#4a7c59_48px_72px,#1a1208_72px_96px)] opacity-70"
      />
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-serif text-4xl font-light leading-tight text-foreground sm:text-5xl">
          Peace, in the language
          <br />
          <span className="italic text-primary">you actually think in.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-muted-foreground">
          Selam is free during our pilot. One quiet check-in is enough to
          start.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-full px-7">
            <Link href="/register">
              Create your account <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
