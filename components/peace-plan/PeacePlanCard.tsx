"use client";

import { useState, useEffect } from "react";
import { CalendarDays, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/ui/rich-text";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

export function PeacePlanCard() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await fetch("/api/peace-plan");
      const data = await res.json();
      if (data.peacePlan) setPlan(data.peacePlan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/peace-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const data = await res.json();
      if (data.peacePlan) setPlan(data.peacePlan);
    } catch (err) {
      toast.error("Failed to generate plan");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <Card className="flex h-32 items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></Card>;
  }

  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            {language === "am" ? "የሰላም እቅድ" : "Peace Plan"}
          </CardTitle>
          <CardDescription>
            {language === "am" 
              ? "ለ7 ቀናት የሚቆይ ቀላል የሰላም እቅድ ያዘጋጁ።"
              : "Generate a personalized 7-day wellness plan based on your recent check-ins."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generatePlan} disabled={generating} className="w-full">
            {generating ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {language === "am" ? "አዲስ እቅድ አዘጋጅ" : "Generate Peace Plan"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const todayIndex = plan.days.findIndex((d: any) => !d.completed);
  const currentDayIndex = todayIndex === -1 ? 6 : todayIndex;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          <RichText text={plan.title} />
        </CardTitle>
        <CardDescription>
          {language === "am" ? "ቀላል እርምጃዎችን በየቀኑ ያድርጉ።" : "Small steps every day."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan.days.map((day: any, idx: number) => {
          const isCurrent = idx === currentDayIndex;
          const isPast = idx < currentDayIndex || day.completed;
          return (
            <div key={idx} className={`flex items-start gap-3 ${isPast ? "opacity-60" : ""} ${isCurrent ? "bg-muted/50 p-3 rounded-lg border" : ""}`}>
              {day.completed ? <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" /> : <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" />}
              <div>
                <p className={`font-medium text-sm ${isCurrent ? "text-foreground" : "text-foreground/80"}`}>
                  Day {day.dayNumber}: {day.theme}
                </p>
                <p className="text-xs text-muted-foreground mt-1"><RichText text={day.action} /></p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
