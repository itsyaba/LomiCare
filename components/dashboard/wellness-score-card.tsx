import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WellnessScoreCard({
  score,
  streak,
  checkedInToday,
}: {
  score: number;
  streak: number;
  checkedInToday: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.35),transparent_65%)] blur-2xl"
      />
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Wellness score
      </p>
      <div className="mt-4 flex items-end gap-2">
        <span className="font-serif text-7xl font-light leading-none text-foreground">
          {score}
        </span>
        <span className="mb-2 text-sm text-muted-foreground">/ 100</span>
      </div>
      <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
        A gentle reading of mood, energy, sleep, and stress from recent
        check-ins.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground">
        <Flame className="size-3.5 text-primary" />
        {streak}-day streak
      </div>

      {!checkedInToday && (
        <Button
          asChild
          size="lg"
          className="mt-6 h-11 w-full rounded-full"
        >
          <Link href="/checkin">
            Check in today <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
