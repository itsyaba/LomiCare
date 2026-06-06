import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wellness score</CardTitle>
        <Activity className="size-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className="font-display text-6xl font-bold">{score}</span>
          <span className="mb-2 text-sm text-muted-foreground">/100</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Based on recent mood, energy, sleep, and stress check-ins.
        </p>
        <div className="mt-5 rounded-lg bg-muted p-4">
          <p className="text-sm font-medium">{streak} day streak</p>
        </div>
        {!checkedInToday && (
          <Button asChild className="mt-5 w-full">
            <Link href="/checkin">
              Check in today
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
