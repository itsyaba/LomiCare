"use client";

import { forwardRef } from "react";

/**
 * Ethiopian textile-inspired SVG band. Repeated diamond + cross motifs
 * reminiscent of traditional shemma/tilf borders. Used as a subtle accent
 * across the landing.
 */

type Props = {
  className?: string;
  color?: string;
  orientation?: "horizontal" | "vertical";
  patternId?: string;
};

export const TextilePattern = forwardRef<SVGSVGElement, Props>(
  function TextilePattern(
    { className, color = "currentColor", orientation = "horizontal", patternId },
    ref,
  ) {
    const isV = orientation === "vertical";
    const id = patternId ?? `ethiopian-band-${isV ? "v" : "h"}`;
    return (
      <svg
        ref={ref}
        className={className}
        viewBox={isV ? "0 0 60 800" : "0 0 800 60"}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width={isV ? 60 : 80}
            height={isV ? 80 : 60}
            patternUnits="userSpaceOnUse"
          >
            {isV ? (
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="80"
                stroke={color}
                strokeWidth="0.6"
              />
            ) : (
              <line
                x1="0"
                y1="30"
                x2="80"
                y2="30"
                stroke={color}
                strokeWidth="0.6"
              />
            )}
            <polygon
              points={
                isV ? "30,32 38,40 30,48 22,40" : "40,22 48,30 40,38 32,30"
              }
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            <circle
              cx={isV ? 30 : 40}
              cy={isV ? 40 : 30}
              r="1.2"
              fill={color}
            />
            <circle
              cx={isV ? 30 : 10}
              cy={isV ? 10 : 30}
              r="0.8"
              fill={color}
            />
            <circle
              cx={isV ? 30 : 70}
              cy={isV ? 70 : 30}
              r="0.8"
              fill={color}
            />
            {isV ? (
              <>
                <polygon
                  points="20,4 30,12 40,4"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.6"
                />
                <polygon
                  points="20,76 30,68 40,76"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.6"
                />
              </>
            ) : (
              <>
                <polygon
                  points="4,20 12,30 4,40"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.6"
                />
                <polygon
                  points="76,20 68,30 76,40"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.6"
                />
              </>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  },
);
