import { Sparkles } from "lucide-react";

export function InsightCard({ insight }: { insight?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Latest insight
        </p>
      </div>
      <p className="mt-4 font-serif text-lg leading-7 text-foreground">
        {insight ||
          "Complete your first check-in to receive a personalised Selam insight."}
      </p>
    </div>
  );
}
