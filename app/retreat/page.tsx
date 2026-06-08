"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useLanguage } from "@/hooks/useLanguage";
import { RetreatHero } from "@/components/retreat/RetreatHero";
import { RetreatArrival } from "@/components/retreat/RetreatArrival";
import { RetreatJourney, type RetreatPlan } from "@/components/retreat/RetreatJourney";

export default function RetreatModePage() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(4);
  const [intention, setIntention] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<RetreatPlan | null>(null);

  const handleGeneratePlan = async () => {
    if (!intention) {
      toast.error(
        language === "am"
          ? "እባክዎ ለቆይታዎ ዓላማ ያስቀምጡ"
          : "Please set an intention for your stay",
      );
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(data.error ?? "Failed to generate plan");
      }
    } catch {
      toast.error("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setPlan(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === 2 && plan) {
    return (
      <main className="bg-[#15100c]">
        <RetreatJourney plan={plan} language={language} onRestart={handleRestart} />
      </main>
    );
  }

  return (
    <main className="bg-[#FDFBF7]">
      <RetreatHero language={language} />
      <RetreatArrival
        language={language}
        mood={mood}
        stress={stress}
        energy={energy}
        intention={intention}
        loading={loading}
        setMood={setMood}
        setStress={setStress}
        setEnergy={setEnergy}
        setIntention={setIntention}
        onGenerate={handleGeneratePlan}
      />
    </main>
  );
}
