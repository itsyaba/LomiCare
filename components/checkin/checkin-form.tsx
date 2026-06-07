"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { VoiceCheckInButton } from "./voice-checkin-button";
import { DailyRitualCard } from "@/components/ritual/DailyRitualCard";

type CreatedCheckIn = {
  insight: string;
  streak: number;
};

function ScaleSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="min-w-14 rounded-full bg-muted px-3 py-1 text-center text-sm font-semibold">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  );
}

export function CheckinForm() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(2);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<CreatedCheckIn | null>(null);
  const [ritual, setRitual] = useState<any>(null);
  const [ritualLoading, setRitualLoading] = useState(false);

  async function generateRitual() {
    setRitualLoading(true);
    try {
      const res = await fetch("/api/ritual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const data = await res.json();
      if (data.ritual) setRitual(data.ritual);
    } catch {
      toast.error("Could not generate ritual. Try from the dashboard.");
    } finally {
      setRitualLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood,
        energy,
        sleep,
        stress,
        note,
        language,
      }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not save check-in");
      return;
    }

    setCreated({ insight: payload.insight, streak: payload.streak });
    router.refresh();
    // Auto-generate today's ritual
    generateRitual();
  }

  if (created) {
    return (
      <Card>
        <CardHeader>
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <CheckCircle2 className="size-5" />
          </div>
          <CardTitle>Check-in saved</CardTitle>
          <CardDescription>
            Your current streak is {created.streak} day
            {created.streak === 1 ? "" : "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/60 p-4">
            <p className="text-sm font-semibold">Selam insight</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {created.insight}
            </p>
          </div>

          {ritualLoading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Generating your daily ritual…
            </div>
          )}

          {ritual && !ritualLoading && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Your Daily Ritual</p>
              <DailyRitualCard ritual={ritual} />
            </div>
          )}

          <Button className="mt-5" onClick={() => router.push("/dashboard")}>
            Return to dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
          <CardTitle>{t.checkin.title}</CardTitle>
          <CardDescription>
            {t.checkin.description}
          </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="rounded-lg border bg-muted/50 p-4">
            <ScaleSlider
              label="Mood"
              value={mood}
              min={1}
              max={10}
              onChange={setMood}
            />
            <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-red-400 via-accent to-secondary" />
          </div>

          <ScaleSlider
            label="Energy"
            value={energy}
            min={1}
            max={5}
            onChange={setEnergy}
          />
          <ScaleSlider
            label="Sleep"
            value={sleep}
            min={0}
            max={12}
            step={0.5}
            suffix="h"
            onChange={setSleep}
          />
          <ScaleSlider
            label="Stress"
            value={stress}
            min={1}
            max={5}
            onChange={setStress}
          />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="note">{t.checkin.note}</Label>
              <VoiceCheckInButton
                onExtract={(data) => {
                  if (data.mood) setMood(data.mood);
                  if (data.energy) setEnergy(data.energy);
                  if (data.stress) setStress(data.stress);
                  if (data.sleepHours !== undefined && data.sleepHours !== null) setSleep(data.sleepHours);
                  if (data.cleanedNote) setNote(data.cleanedNote);
                }}
              />
            </div>
            <Textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t.checkin.placeholder}
              maxLength={500}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t.checkin.saving}
              </>
            ) : (
              t.checkin.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
