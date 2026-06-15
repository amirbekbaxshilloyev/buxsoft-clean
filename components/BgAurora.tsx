"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BgAurora() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div className="bg-aurora" aria-hidden>
      <div className="bg-aurora__orb bg-aurora__orb--1" />
      <div className="bg-aurora__orb bg-aurora__orb--2" />
      <div className="bg-aurora__orb bg-aurora__orb--3" />
    </div>
  );
}
