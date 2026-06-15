"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function GoldenThread() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          el.style.setProperty("--sp", String(self.progress));
        },
      });
    })();
  }, [reduced]);

  if (reduced) return null;

  return <div ref={ref} className="golden-thread" aria-hidden />;
}
