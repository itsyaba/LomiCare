"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MoodHistoryChart({
  data,
}: {
  data: { date: string; mood: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood history</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis domain={[1, 10]} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
              Mood history appears after your first check-in.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
