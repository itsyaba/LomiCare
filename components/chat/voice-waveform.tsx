"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const BARS = 20;

/**
 * Live voice waveform. While `active`, taps the mic via getUserMedia +
 * AnalyserNode and drives the bars from real input volume. If mic access
 * isn't available, falls back to a gentle looping animation so the listening
 * state always feels alive.
 */
export function VoiceWaveform({ active }: { active: boolean }) {
  const [mode, setMode] = useState<"loop" | "real">("loop");
  const [levels, setLevels] = useState<number[]>(() =>
    Array(BARS).fill(0.25),
  );
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AC();
        ctxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        setMode("real");

        const tick = () => {
          analyser.getByteFrequencyData(data);
          const next: number[] = [];
          for (let i = 0; i < BARS; i++) {
            const v = data[i % data.length] / 255;
            next.push(Math.max(0.18, Math.min(1, v * 1.4)));
          }
          setLevels(next);
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setMode("loop");
      }
    }
    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      ctxRef.current?.close().catch(() => {});
      streamRef.current = null;
      ctxRef.current = null;
      setMode("loop");
    };
  }, [active]);

  return (
    <div className="flex h-6 items-center gap-[3px]">
      {Array.from({ length: BARS }).map((_, i) =>
        mode === "real" ? (
          <span
            key={i}
            className="w-[3px] rounded-full bg-primary"
            style={{ height: `${Math.round(levels[i] * 100)}%` }}
          />
        ) : (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-primary"
            animate={{ height: ["20%", "90%", "20%"] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: (i % 6) * 0.09,
              ease: "easeInOut",
            }}
          />
        ),
      )}
    </div>
  );
}
