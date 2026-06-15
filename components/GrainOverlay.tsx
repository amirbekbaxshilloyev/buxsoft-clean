"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function GrainOverlay() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div className="grain-wrap" aria-hidden>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="bx-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="200%" height="200%" filter="url(#bx-grain)" />
      </svg>
    </div>
  );
}
