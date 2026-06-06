import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Tip = {
  category: string;
  title: string;
  body: string;
  emoji: string;
};

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Badge variant="secondary">{tip.category}</Badge>
          <span aria-hidden className="text-xl">
            {tip.emoji}
          </span>
        </div>
        <CardTitle className="text-lg">{tip.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{tip.body}</p>
      </CardContent>
    </Card>
  );
}
