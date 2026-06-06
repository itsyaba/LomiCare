import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InsightCard({ insight }: { insight?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest insight</CardTitle>
        <Sparkles className="size-5 text-accent" />
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {insight ||
            "Complete your first check-in to receive a personalized Selam insight."}
        </p>
      </CardContent>
    </Card>
  );
}
