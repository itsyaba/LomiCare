import { Flame } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-medium tracking-wide text-foreground backdrop-blur">
      <Flame className="size-3.5 text-primary" />
      {streak}-day streak
    </div>
  );
}
