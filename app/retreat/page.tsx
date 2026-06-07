"use client";

import { useState } from "react";
import { Leaf, MapPin, Waves, Sunrise, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

export default function RetreatModePage() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(4);
  const [intention, setIntention] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{
    arrivalReset: string;
    activity: string;
    foodReminder: string;
    reflectionPrompt: string;
    eveningCheckIn: string;
  } | null>(null);

  const handleGeneratePlan = async () => {
    if (!intention) {
      toast.error("Please set an intention for your stay");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/retreat/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, stress, energy, intention, language }),
      });
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
        setStep(2);
      } else {
        toast.error(data.error ?? "Failed to generate plan");
      }
    } catch {
      toast.error("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D2C23]">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-[#E4A853]/20 text-[#C17F2C] hover:bg-[#E4A853]/30 border-none mb-2">
            Kuriftu Resort Partner
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-medium flex justify-center items-center gap-3">
            <Sunrise className="size-8 text-[#C17F2C]" />
            Selam Retreat
          </h1>
          <p className="text-lg opacity-80 max-w-xl mx-auto">
            {language === "am"
              ? "ወደ መዝናኛዎ እንኳን በደህና መጡ። ቆይታዎን በሰላም ይጀምሩ።"
              : "Welcome to your retreat. Let's design a calm rhythm for your stay."}
          </p>
        </div>

        {/* Step 1 — Arrival Check-in */}
        {step === 1 && (
          <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif">Arrival Check-in</CardTitle>
              <CardDescription>How are you arriving today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Mood</Label>
                  <span className="font-semibold">{mood} / 10</span>
                </div>
                <Slider min={1} max={10} value={[mood]} onValueChange={([v]) => setMood(v)} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Stress</Label>
                  <span className="font-semibold">{stress} / 5</span>
                </div>
                <Slider min={1} max={5} value={[stress]} onValueChange={([v]) => setStress(v)} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Energy</Label>
                  <span className="font-semibold">{energy} / 5</span>
                </div>
                <Slider min={1} max={5} value={[energy]} onValueChange={([v]) => setEnergy(v)} />
              </div>
              <div className="space-y-3">
                <Label>What is your intention for this retreat?</Label>
                <Input
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="e.g. Total disconnection, digital detox, reading..."
                  className="bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0"
                />
              </div>
              <Button
                onClick={handleGeneratePlan}
                disabled={loading}
                className="w-full bg-[#3D2C23] hover:bg-[#2A1E18] h-12 text-md rounded-full mt-4"
              >
                {loading ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-5" />
                )}
                Generate My Retreat Plan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Retreat Plan */}
        {step === 2 && plan && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-l-4 border-l-[#C17F2C] shadow-md bg-white/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="size-4 text-[#C17F2C]" /> Arrival Reset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{plan.arrivalReset}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#538271] shadow-md bg-white/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Waves className="size-4 text-[#538271]" /> Suggested Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{plan.activity}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#D97757] shadow-md bg-white/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="size-4 text-[#D97757]" /> Nourishment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{plan.foodReminder}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#3D2C23] shadow-md bg-white/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="size-4 text-[#3D2C23]" /> Evening Check-in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{plan.eveningCheckIn}</p>
                </CardContent>
              </Card>
            </div>

            {/* Reflection prompt */}
            <Card className="bg-[#3D2C23]/5 border-none shadow-inner">
              <CardHeader>
                <CardTitle className="text-center text-lg font-serif">Evening Reflection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground italic">&ldquo;{plan.reflectionPrompt}&rdquo;</p>
              </CardContent>
            </Card>

            <div className="text-center pt-4 border-t border-black/10">
              <p className="text-xs opacity-50">
                Designed for resort partners, wellness retreats, and hospitality experiences.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setStep(1)}
              >
                Start a new check-in
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
