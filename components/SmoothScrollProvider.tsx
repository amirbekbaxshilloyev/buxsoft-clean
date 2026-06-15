"use client";
import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;

    (async () => {
      const Lenis = (await import("lenis")).default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t: number) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    })();

    return () => { lenis?.destroy(); };
  }, [reduced]);

  return <>{children}</>;
}
