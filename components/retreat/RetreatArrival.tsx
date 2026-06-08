"use client";

import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TextilePattern } from "@/components/landing/TextilePattern";

export function RetreatArrival({
  language,
  mood,
  stress,
  energy,
  intention,
  loading,
  setMood,
  setStress,
  setEnergy,
  setIntention,
  onGenerate,
}: {
  language: "en" | "am";
  mood: number;
  stress: number;
  energy: number;
  intention: string;
  loading: boolean;
  setMood: (v: number) => void;
  setStress: (v: number) => void;
  setEnergy: (v: number) => void;
  setIntention: (v: string) => void;
  onGenerate: () => void;
}) {
  const am = language === "am";

  return (
    <section className="relative bg-[#FDFBF7] px-4 py-20 text-[#3D2C23]">
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-0 size-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(228,168,83,0.18),transparent_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-xl">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C17F2C]">
            {am ? "የመድረሻ ቅኝት" : "Arrival check-in"}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light sm:text-4xl">
            {am ? "ዛሬ እንዴት ደረሱ?" : "How are you arriving today?"}
          </h2>
          <div className="mx-auto mt-5 w-32 opacity-60">
            <TextilePattern patternId="retreat-arrival-band" className="h-5 text-[#C17F2C]" />
          </div>
        </div>

        <div className="mt-10 space-y-8 rounded-3xl border border-[#C17F2C]/15 bg-white/70 p-8 shadow-xl backdrop-blur">
          <ArrivalSlider
            label={am ? "ስሜት" : "Mood"}
            value={mood}
            max={10}
            onChange={setMood}
          />
          <ArrivalSlider
            label={am ? "ጭንቀት" : "Stress"}
            value={stress}
            max={5}
            onChange={setStress}
          />
          <ArrivalSlider
            label={am ? "ኃይል" : "Energy"}
            value={energy}
            max={5}
            onChange={setEnergy}
          />

          <div className="space-y-3">
            <Label className="text-[#3D2C23]">
              {am ? "ለዚህ ቆይታ ዓላማዎ ምንድን ነው?" : "What is your intention for this retreat?"}
            </Label>
            <Input
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder={
                am
                  ? "ለምሳሌ፦ ሙሉ ዕረፍት፣ ከስልክ መራቅ፣ ንባብ..."
                  : "e.g. Total disconnection, a digital detox, reading..."
              }
              className="rounded-none border-x-0 border-t-0 border-b-2 border-[#C17F2C]/40 bg-transparent px-0 font-serif text-base focus-visible:border-[#C17F2C] focus-visible:ring-0"
            />
          </div>

          <Button
            onClick={onGenerate}
            disabled={loading}
            className="mt-2 h-12 w-full rounded-full bg-[#3D2C23] text-base hover:bg-[#2A1E18]"
          >
            {loading ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-5" />
            )}
            {am ? "ሪትሪቴን ጀምር" : "Begin my retreat"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ArrivalSlider({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <Label className="text-[#3D2C23]">{label}</Label>
        <span className="font-serif text-lg text-[#C17F2C]">
          {value}
          <span className="text-sm text-[#3D2C23]/40"> / {max}</span>
        </span>
      </div>
      <Slider
        min={1}
        max={max}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}
