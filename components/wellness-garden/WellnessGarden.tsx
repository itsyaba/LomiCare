"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

import { useLanguage } from "@/hooks/useLanguage";

type Stage =
  | "soil"
  | "seed"
  | "sprout"
  | "young"
  | "leafed"
  | "flowering"
  | "cherries";

type Props = {
  streak: number;
  className?: string;
};

function stageForStreak(streak: number): Stage {
  if (streak <= 0) return "soil";
  if (streak < 2) return "seed";
  if (streak < 4) return "sprout";
  if (streak < 8) return "young";
  if (streak < 15) return "leafed";
  if (streak < 22) return "flowering";
  return "cherries";
}

const STAGE_LABELS_EN: Record<Stage, string> = {
  soil: "Soil tended",
  seed: "Seed planted",
  sprout: "Sprout",
  young: "Young plant",
  leafed: "Full leaves",
  flowering: "In flower",
  cherries: "Coffee cherries",
};
const STAGE_LABELS_AM: Record<Stage, string> = {
  soil: "አፈር",
  seed: "ዘር",
  sprout: "ቡቃያ",
  young: "ወጣት ተክል",
  leafed: "ቅጠል የበዛ",
  flowering: "አበባ ይዟል",
  cherries: "ቡና ፍሬ",
};

const MILESTONES = [
  { stage: "seed" as Stage, days: 1 },
  { stage: "sprout" as Stage, days: 2 },
  { stage: "young" as Stage, days: 4 },
  { stage: "leafed" as Stage, days: 8 },
  { stage: "flowering" as Stage, days: 15 },
  { stage: "cherries" as Stage, days: 22 },
];

export function WellnessGarden({ streak, className }: Props) {
  const { language } = useLanguage();
  const stage = stageForStreak(streak);
  const labels = language === "am" ? STAGE_LABELS_AM : STAGE_LABELS_EN;

  // Decide growth proportions
  const stemHeight = useMemo(() => {
    switch (stage) {
      case "soil":
        return 0;
      case "seed":
        return 8;
      case "sprout":
        return 30;
      case "young":
        return 70;
      case "leafed":
        return 110;
      case "flowering":
        return 130;
      case "cherries":
        return 140;
      default:
        return 0;
    }
  }, [stage]);

  const showLeaves = stage === "young" || stage === "leafed" || stage === "flowering" || stage === "cherries";
  const showMoreLeaves = stage === "leafed" || stage === "flowering" || stage === "cherries";
  const showFlowers = stage === "flowering";
  const showCherries = stage === "cherries";

  const nextMilestone = MILESTONES.find((m) => streak < m.days);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-[#fbf6e8] via-[#f5ead0] to-[#e8c890] p-6 backdrop-blur dark:from-[#2a1f0f] dark:via-[#3a2a17] dark:to-[#4a3520] ${className ?? ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {language === "am" ? "የጤና ጓሮ" : "Wellness garden"}
          </p>
          <p className="mt-1 font-serif text-2xl text-foreground">
            {labels[stage]}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {language === "am"
              ? `${streak} ቀን ተከታታይ`
              : `${streak} day${streak === 1 ? "" : "s"} streak`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {language === "am" ? "ቀጣይ" : "Next"}
          </p>
          <p className="mt-1 font-serif text-base text-foreground">
            {nextMilestone
              ? language === "am"
                ? `${STAGE_LABELS_AM[nextMilestone.stage]} · ${nextMilestone.days - streak}d`
                : `${STAGE_LABELS_EN[nextMilestone.stage]} · ${nextMilestone.days - streak}d`
              : "✨"}
          </p>
        </div>
      </div>

      {/* SVG plant */}
      <div className="mt-4 flex justify-center">
        <svg
          viewBox="0 0 260 220"
          className="h-44 w-full max-w-[260px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sun glow */}
          <defs>
            <radialGradient id="sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(232,184,75,0.55)" />
              <stop offset="100%" stopColor="rgba(232,184,75,0)" />
            </radialGradient>
            <linearGradient id="stem" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7ba47a" />
              <stop offset="100%" stopColor="#4a7c59" />
            </linearGradient>
            <radialGradient id="leaf" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#88b585" />
              <stop offset="100%" stopColor="#4a7c59" />
            </radialGradient>
            <radialGradient id="cherry" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e85a3d" />
              <stop offset="100%" stopColor="#a02a18" />
            </radialGradient>
          </defs>

          <circle cx="50" cy="40" r="38" fill="url(#sun)" />

          {/* Soil pot */}
          <path
            d="M 80 200 L 90 175 L 170 175 L 180 200 Z"
            fill="#7a4525"
          />
          <ellipse cx="130" cy="175" rx="40" ry="6" fill="#5a3018" />

          {/* Seed (visible for early stages) */}
          {stage === "seed" && (
            <ellipse cx="130" cy="172" rx="5" ry="3" fill="#3d2817" />
          )}

          {/* Stem — animated growth */}
          {stemHeight > 0 && (
            <motion.path
              d={`M 130 175 Q 132 ${175 - stemHeight / 2} 130 ${175 - stemHeight}`}
              stroke="url(#stem)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          )}

          {/* Tiny sprout leaves */}
          {stage === "sprout" && (
            <>
              <motion.ellipse
                cx="124"
                cy={175 - stemHeight + 5}
                rx="6"
                ry="3"
                fill="url(#leaf)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                style={{ transformOrigin: "130px 175px" }}
              />
              <motion.ellipse
                cx="136"
                cy={175 - stemHeight + 5}
                rx="6"
                ry="3"
                fill="url(#leaf)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: 1.3 }}
                style={{ transformOrigin: "130px 175px" }}
              />
            </>
          )}

          {/* Leaves */}
          {showLeaves && (
            <>
              {[
                { x: 110, y: 175 - stemHeight * 0.55, rx: 14, ry: 8, rot: -30 },
                { x: 150, y: 175 - stemHeight * 0.45, rx: 14, ry: 8, rot: 30 },
              ].map((leaf, i) => (
                <motion.ellipse
                  key={i}
                  cx={leaf.x}
                  cy={leaf.y}
                  rx={leaf.rx}
                  ry={leaf.ry}
                  fill="url(#leaf)"
                  transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [leaf.rot - 2, leaf.rot + 2, leaf.rot - 2],
                  }}
                  transition={{
                    scale: { duration: 1.6, delay: 0.4 + i * 0.2 },
                    rotate: {
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                  }}
                  style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
                />
              ))}
            </>
          )}

          {/* More leaves at higher stages */}
          {showMoreLeaves && (
            <>
              {[
                { x: 100, y: 175 - stemHeight * 0.8, rx: 16, ry: 9, rot: -40 },
                { x: 160, y: 175 - stemHeight * 0.75, rx: 16, ry: 9, rot: 40 },
                { x: 130, y: 175 - stemHeight + 4, rx: 12, ry: 7, rot: 0 },
              ].map((leaf, i) => (
                <motion.ellipse
                  key={i}
                  cx={leaf.x}
                  cy={leaf.y}
                  rx={leaf.rx}
                  ry={leaf.ry}
                  fill="url(#leaf)"
                  transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [leaf.rot - 2, leaf.rot + 2, leaf.rot - 2],
                  }}
                  transition={{
                    scale: { duration: 1.6, delay: 0.8 + i * 0.2 },
                    rotate: {
                      duration: 6 + i,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                  }}
                  style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
                />
              ))}
            </>
          )}

          {/* Flowers */}
          {showFlowers &&
            [
              { x: 115, y: 175 - stemHeight + 18 },
              { x: 145, y: 175 - stemHeight + 18 },
            ].map((flower, i) => (
              <motion.g
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.4, delay: 1.4 + i * 0.3 }}
                style={{
                  transformOrigin: `${flower.x}px ${flower.y}px`,
                }}
              >
                {[0, 1, 2, 3, 4].map((p) => {
                  const angle = (p / 5) * Math.PI * 2;
                  return (
                    <circle
                      key={p}
                      cx={flower.x + Math.cos(angle) * 4}
                      cy={flower.y + Math.sin(angle) * 4}
                      r={3.5}
                      fill="#fdf5e6"
                    />
                  );
                })}
                <circle cx={flower.x} cy={flower.y} r={2.5} fill="#e8b84b" />
              </motion.g>
            ))}

          {/* Coffee cherries */}
          {showCherries &&
            [
              { x: 112, y: 175 - stemHeight + 25 },
              { x: 148, y: 175 - stemHeight + 25 },
              { x: 130, y: 175 - stemHeight + 8 },
              { x: 122, y: 175 - stemHeight + 40 },
              { x: 138, y: 175 - stemHeight + 40 },
            ].map((c, i) => (
              <motion.circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={4.5}
                fill="url(#cherry)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, delay: 1.5 + i * 0.15 }}
              />
            ))}

          {/* Soft floating particle (life) */}
          <motion.circle
            cx={170}
            cy={140}
            r={2}
            fill="rgba(74,124,89,0.5)"
            animate={{ cy: [140, 50], opacity: [0.5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.circle
            cx={92}
            cy={120}
            r={1.5}
            fill="rgba(74,124,89,0.4)"
            animate={{ cy: [120, 40], opacity: [0.4, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </svg>
      </div>

      {/* Cultural blurb */}
      <p className="mt-3 text-center font-serif text-xs italic text-muted-foreground">
        {language === "am"
          ? "ቡና ከኢትዮጵያ ተጀመረ። ጓሮዎ ከእርስዎ ጋር ይጠናከራል።"
          : "Coffee was born in Ethiopia. Your garden grows with you."}
      </p>
    </div>
  );
}
