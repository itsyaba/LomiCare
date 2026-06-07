"use client";

import { useState } from "react";
import { Check, Clock, Coffee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

export function DailyRitualCard({
  ritual,
  onComplete,
}: {
  ritual: any;
  onComplete?: () => void;
}) {
  const { t } = useLanguage();
  const [completed, setCompleted] = useState(ritual?.completed || false);
  const [loading, setLoading] = useState(false);

  if (!ritual) return null;

  const handleComplete = async () => {
    if (completed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ritual/${ritual._id || ritual.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      if (!res.ok) throw new Error("Failed to mark completed");
      setCompleted(true);
      toast.success("Ritual completed! Great job taking a moment for yourself.");
      if (onComplete) onComplete();
    } catch (err) {
      toast.error("Failed to mark ritual as completed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${completed ? "bg-muted/30" : "bg-card"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant={completed ? "secondary" : "default"} className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
            {ritual.culturalTag}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <Clock className="size-3.5 mr-1" />
            {ritual.durationMinutes} min
          </div>
        </div>
        <CardTitle className="flex items-center gap-2 mt-2">
          {completed ? <Check className="size-5 text-green-500" /> : <Coffee className="size-5 text-primary" />}
          {ritual.title}
        </CardTitle>
        <CardDescription>{ritual.explanation}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mt-1">
          {ritual.steps.map((step: string, idx: number) => (
            <li key={idx} className="flex gap-3 text-sm text-foreground/80">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {idx + 1}
              </span>
              <span className={completed ? "opacity-70 line-through" : ""}>{step}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant={completed ? "secondary" : "default"} 
          className="w-full"
          disabled={completed || loading}
          onClick={handleComplete}
        >
          {loading ? "Marking..." : completed ? "Completed" : "Mark as Completed"}
          {!completed && !loading && <Sparkles className="size-4 ml-2" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
