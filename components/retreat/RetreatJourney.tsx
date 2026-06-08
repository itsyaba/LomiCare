"use client";

import { MapPin, Waves, Leaf, Moon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RetreatMoment, type Moment } from "./RetreatMoment";

export type RetreatPlan = {
  arrivalReset: string;
  activity: string;
  foodReminder: string;
  eveningCheckIn: string;
  reflectionPrompt: string;
};

export function RetreatJourney({
  plan,
  language,
  onRestart,
}: {
  plan: RetreatPlan;
  language: "en" | "am";
  onRestart: () => void;
}) {
  const am = language === "am";

  const moments: Moment[] = [
    {
      eyebrow: am ? "መድረሻ" : "First light",
      title: am ? "የመድረሻ እርጋታ" : "Arrival Reset",
      body: plan.arrivalReset,
      icon: <MapPin className="size-4" strokeWidth={1.75} />,
      image: "/retreat/morning.jpg",
      gradient: "from-[#E4A853] via-[#C17F2C] to-[#3D2C23]",
    },
    {
      eyebrow: am ? "ቀን" : "Midday",
      title: am ? "የተመከረ እንቅስቃሴ" : "Suggested Activity",
      body: plan.activity,
      icon: <Waves className="size-4" strokeWidth={1.75} />,
      image: "/retreat/activity.jpg",
      gradient: "from-[#538271] via-[#3a5f52] to-[#1f2e29]",
    },
    {
      eyebrow: am ? "ምግብ" : "Nourishment",
      title: am ? "ምግብና ውሃ" : "Nourishment",
      body: plan.foodReminder,
      icon: <Leaf className="size-4" strokeWidth={1.75} />,
      image: "/retreat/nourishment.jpg",
      gradient: "from-[#D97757] via-[#a8542f] to-[#3D2C23]",
    },
    {
      eyebrow: am ? "ምሽት" : "Evening",
      title: am ? "የምሽት ቅኝት" : "Evening Check-in",
      body: plan.eveningCheckIn,
      icon: <Moon className="size-4" strokeWidth={1.75} />,
      image: "/retreat/evening.jpg",
      gradient: "from-[#C17F2C] via-[#6b4a2a] to-[#241a14]",
    },
    {
      eyebrow: am ? "ነፀብራቅ" : "Before sleep",
      title: am ? "የምሽት ነፀብራቅ" : "Evening Reflection",
      body: plan.reflectionPrompt,
      icon: <Sparkles className="size-4" strokeWidth={1.75} />,
      image: "/retreat/reflection.jpg",
      gradient: "from-[#3D2C23] via-[#2a1e18] to-[#15100c]",
      quiet: true,
    },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {moments.map((moment, i) => (
        <RetreatMoment
          key={moment.title}
          moment={moment}
          index={i}
          total={moments.length}
        />
      ))}

      {/* Close */}
      <section className="bg-[#15100c] py-20 text-center text-[#FDFBF7]">
        <div className="mx-auto max-w-xl px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#E4A853]/80">
            {am ? "በኩሪፍቱ የተዘጋጀ" : "Crafted with Kuriftu"}
          </p>
          <p className="mt-4 font-serif text-2xl font-light leading-snug">
            {am
              ? "ይህ ሰላም ሪትሪት ለመዝናኛ እንግዶች የተሰራ ነው።"
              : "A guided wellness layer for resort guests and retreats."}
          </p>
          <Button
            variant="outline"
            onClick={onRestart}
            className="mt-8 rounded-full border-white/30 bg-transparent text-[#FDFBF7] hover:bg-white/10 hover:text-[#FDFBF7]"
          >
            {am ? "አዲስ ቅኝት ጀምር" : "Start a new check-in"}
          </Button>
        </div>
      </section>
    </div>
  );
}
