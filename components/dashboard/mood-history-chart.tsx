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

export function MoodHistoryChart({
  data,
}: {
  data: { date: string; mood: number }[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Mood history
          </p>
          <h3 className="mt-1 font-serif text-xl font-medium text-foreground">
            How you&apos;ve been moving
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">last 14 days</span>
      </div>
      <div className="mt-5 h-64">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={[1, 10]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/70 text-sm text-muted-foreground">
            Mood history appears after your first check-in.
          </div>
        )}
      </div>
    </div>
  );
}
