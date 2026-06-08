"use client";

import { motion } from "motion/react";

type Stage =
  | "incense"
  | "roast"
  | "grind"
  | "brew"
  | "pour"
  | "reflect";

type Props = {
  stage: Stage;
  className?: string;
};

/**
 * Inline SVG buna ceremony illustrations. Stages animate with framer-motion-
 * style transitions but we use plain CSS animations to avoid a hard runtime
 * dep — framer-motion is already in stack via shadcn but optional, so we
 * fallback to keyframes defined inline.
 */
export function BunaIllustration({ stage, className }: Props) {
  return (
    <div className={`relative aspect-square w-full ${className ?? ""}`}>
      <svg
        viewBox="0 0 400 400"
        className="size-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft warm radial backdrop */}
        <defs>
          <radialGradient id="bunaBg" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="#fbeed4" />
            <stop offset="100%" stopColor="#f5e6c8" />
          </radialGradient>
          <radialGradient id="ember" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff8a3d" />
            <stop offset="50%" stopColor="#c8622a" />
            <stop offset="100%" stopColor="rgba(200,98,42,0)" />
          </radialGradient>
        </defs>

        <rect width="400" height="400" fill="url(#bunaBg)" rx="200" />

        {/* The jebena (clay pot) — always visible */}
        <g transform="translate(200 240)">
          <motion.g
            animate={
              stage === "brew" || stage === "pour"
                ? { rotate: stage === "pour" ? -28 : 0 }
                : { rotate: 0 }
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ transformOrigin: "0px 30px" }}
          >
            {/* Jebena body */}
            <ellipse cx="0" cy="40" rx="60" ry="55" fill="#3d2817" />
            <ellipse cx="0" cy="35" rx="55" ry="50" fill="#5a3c22" />
            {/* Neck */}
            <path
              d="M -22 -10 Q -22 -45 -10 -55 Q 0 -62 10 -55 Q 22 -45 22 -10 Z"
              fill="#3d2817"
            />
            <path
              d="M -16 -10 Q -16 -42 -8 -50 Q 0 -56 8 -50 Q 16 -42 16 -10 Z"
              fill="#5a3c22"
            />
            {/* Spout */}
            <path
              d="M -45 -5 Q -55 -10 -60 0 Q -55 5 -40 5 Z"
              fill="#3d2817"
            />
            {/* Handle */}
            <path
              d="M 40 10 Q 70 10 70 40 Q 70 70 40 70"
              fill="none"
              stroke="#3d2817"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Rim highlight */}
            <ellipse cx="0" cy="-50" rx="9" ry="3" fill="#2a1b10" />
          </motion.g>
        </g>

        {/* Stage 1: Incense / heating — smoke rising */}
        {stage === "incense" && (
          <g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={200 + (i - 1) * 20}
                cy={150}
                r={6}
                fill="rgba(255,255,255,0.7)"
                animate={{
                  cy: [180, 60],
                  opacity: [0.7, 0],
                  r: [4, 14],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeOut",
                }}
              />
            ))}
            {/* Small bowl with incense */}
            <ellipse cx="200" cy="195" rx="32" ry="8" fill="#3d2817" />
            <ellipse cx="200" cy="190" rx="28" ry="6" fill="#5a3c22" />
          </g>
        )}

        {/* Stage 2: Roasting — beans on a pan, color shifting */}
        {stage === "roast" && (
          <g transform="translate(200 200)">
            {/* Roasting pan (mitad) */}
            <ellipse cx="0" cy="20" rx="80" ry="14" fill="#2a1b10" />
            <ellipse cx="0" cy="15" rx="75" ry="10" fill="#3d2817" />
            {/* Beans (start light, darken) */}
            {[
              [-30, 12],
              [-10, 14],
              [10, 11],
              [28, 13],
              [-22, 18],
              [4, 17],
              [22, 18],
              [-40, 17],
            ].map(([x, y], i) => (
              <motion.ellipse
                key={i}
                cx={x}
                cy={y}
                rx={5}
                ry={3.5}
                animate={{ fill: ["#c8924a", "#7a4525", "#3d2817"] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.15,
                }}
              />
            ))}
            {/* Ember glow underneath */}
            <ellipse
              cx="0"
              cy="35"
              rx="60"
              ry="8"
              fill="url(#ember)"
              opacity="0.7"
            />
            {/* Crackle smoke */}
            {[0, 1].map((i) => (
              <motion.circle
                key={i}
                cx={-20 + i * 40}
                cy={-10}
                r={4}
                fill="rgba(255,255,255,0.5)"
                animate={{ cy: [0, -80], opacity: [0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </g>
        )}

        {/* Stage 3: Grinding — mortar & pestle */}
        {stage === "grind" && (
          <g transform="translate(200 200)">
            {/* Mortar */}
            <path
              d="M -55 10 Q -55 50 0 55 Q 55 50 55 10 Z"
              fill="#3d2817"
            />
            <path
              d="M -48 10 Q -48 45 0 50 Q 48 45 48 10 Z"
              fill="#5a3c22"
            />
            <ellipse cx="0" cy="10" rx="48" ry="8" fill="#2a1b10" />
            {/* Pestle being raised + lowered */}
            <motion.g
              animate={{ y: [-50, 0, -50] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect x="-6" y="-100" width="12" height="100" fill="#3d2817" rx="3" />
              <ellipse cx="0" cy="0" rx="14" ry="6" fill="#2a1b10" />
            </motion.g>
            {/* Ground powder puff */}
            {[0, 1].map((i) => (
              <motion.circle
                key={i}
                cx={-15 + i * 30}
                cy={5}
                r={3}
                fill="rgba(60,40,23,0.4)"
                animate={{ cy: [10, -30], opacity: [0.4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </g>
        )}

        {/* Stage 4: Brewing — steam from jebena */}
        {stage === "brew" && (
          <g>
            {[0, 1, 2, 3].map((i) => (
              <motion.path
                key={i}
                d="M 200 180 Q 195 150 210 130 Q 225 110 200 80"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                animate={{
                  d: [
                    "M 200 180 Q 195 150 210 130 Q 225 110 200 80",
                    "M 200 180 Q 210 150 195 130 Q 175 110 200 80",
                    "M 200 180 Q 195 150 210 130 Q 225 110 200 80",
                  ],
                  opacity: [0.6, 0.2, 0.6],
                }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
            {/* Ember below */}
            <ellipse
              cx="200"
              cy="305"
              rx="80"
              ry="14"
              fill="url(#ember)"
              opacity="0.6"
            />
          </g>
        )}

        {/* Stage 5: Pour — buna stream into cup */}
        {stage === "pour" && (
          <g>
            {/* Cini (small cup) */}
            <g transform="translate(115 290)">
              <path
                d="M -22 0 Q -22 30 -16 35 L 16 35 Q 22 30 22 0 Z"
                fill="#f4e4c4"
              />
              <ellipse cx="0" cy="0" rx="22" ry="6" fill="#3d2817" />
              <ellipse cx="0" cy="3" rx="18" ry="3" fill="#1a0f08" />
            </g>
            {/* Coffee stream */}
            <motion.path
              d="M 152 215 Q 140 250 122 285"
              stroke="#3d2817"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            {/* Drop splash */}
            <motion.circle
              cx={120}
              cy={290}
              r={3}
              fill="#3d2817"
              animate={{ r: [3, 6, 3], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </g>
        )}

        {/* Stage 6: Reflect — quiet, warm glow, dimmed jebena */}
        {stage === "reflect" && (
          <g>
            <motion.circle
              cx={200}
              cy={200}
              r={140}
              fill="url(#ember)"
              opacity={0.4}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Small cup left on table with one bean */}
            <g transform="translate(280 310)">
              <path
                d="M -16 0 Q -16 20 -12 25 L 12 25 Q 16 20 16 0 Z"
                fill="#f4e4c4"
              />
              <ellipse cx="0" cy="0" rx="16" ry="4" fill="#3d2817" />
            </g>
            {/* Soft floating thought wisps */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={200 + (i - 1) * 14}
                cy={100}
                r={3}
                fill="rgba(74,124,89,0.6)"
                animate={{ cy: [100, 50], opacity: [0.6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
