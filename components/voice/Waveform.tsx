"use client";

import { useEffect, useRef } from "react";

type Props = {
  isActive: boolean;
  className?: string;
};

/**
 * Live audio waveform. Pulses gently with the user's voice via Web Audio API
 * AnalyserNode → canvas. When inactive, shows a soft idle pulse so the
 * component never looks "dead".
 */
export function Waveform({ isActive, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      // Idle animation — soft sine pulse so the surface never feels frozen.
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let t = 0;
      const idle = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(200, 98, 42, 0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = h / 2 + Math.sin(x * 0.04 + t) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        t += 0.05;
        rafRef.current = requestAnimationFrame(idle);
      };
      idle();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

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
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasCtx = canvas.getContext("2d");
        if (!canvasCtx) return;

        const draw = () => {
          analyser.getByteTimeDomainData(data);
          const w = canvas.width;
          const h = canvas.height;
          canvasCtx.clearRect(0, 0, w, h);
          // primary line
          canvasCtx.strokeStyle = "rgba(200, 98, 42, 0.85)";
          canvasCtx.lineWidth = 2.5;
          canvasCtx.beginPath();
          const sliceWidth = w / data.length;
          let x = 0;
          for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128;
            const y = (v * h) / 2;
            if (i === 0) canvasCtx.moveTo(x, y);
            else canvasCtx.lineTo(x, y);
            x += sliceWidth;
          }
          canvasCtx.stroke();

          // soft echo line for depth
          canvasCtx.strokeStyle = "rgba(74, 124, 89, 0.35)";
          canvasCtx.lineWidth = 1.5;
          canvasCtx.beginPath();
          x = 0;
          for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128;
            const y = (v * h) / 2 + 4;
            if (i === 0) canvasCtx.moveTo(x, y);
            else canvasCtx.lineTo(x, y);
            x += sliceWidth;
          }
          canvasCtx.stroke();

          rafRef.current = requestAnimationFrame(draw);
        };
        draw();
      } catch (err) {
        // mic permission denied or unsupported — caller already shows error
        console.warn("Waveform: mic stream unavailable", err);
      }
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={120}
      className={className}
      style={{ width: "100%", height: 120 }}
      aria-hidden
    />
  );
}
