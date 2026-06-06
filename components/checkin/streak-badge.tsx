import { Flame } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
      <Flame className="size-4" />
      {streak} day streak
    </div>
  );
}
