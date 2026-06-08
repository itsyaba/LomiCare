import { Activity, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import { RichText } from "@/components/ui/rich-text";

export function WellnessTrendCard({ trends }: { trends: any }) {
  if (!trends) return null;

  const isHigh = trends.risk === "high";

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 backdrop-blur",
        isHigh
          ? "border-destructive/30 bg-destructive/5"
          : "border-border/60 bg-card/70",
      )}
    >
      <div className="flex items-center gap-2">
        {isHigh ? (
          <AlertTriangle className="size-4 text-destructive" />
        ) : (
          <Activity className="size-4 text-primary" />
        )}
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Wellness trend
        </p>
      </div>
      <p className="mt-4 font-serif text-lg leading-7 text-foreground">
        <RichText text={trends.explanation} />
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Recommended focus:{" "}
        <span className="font-medium text-foreground">
          <RichText text={trends.recommendedFocus} />
        </span>
      </p>
    </div>
  );
}
