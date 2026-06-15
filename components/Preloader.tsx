"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

declare global {
  interface Window { __bxReady?: boolean; }
}

function fire() {
  window.__bxReady = true;
  window.dispatchEvent(new CustomEvent("bx:ready"));
}

export function Preloader() {
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visited = sessionStorage.getItem("bx_v");

    if (visited || reduced) {
      setHidden(true);
      fire();
      return;
    }

    sessionStorage.setItem("bx_v", "1");

    (async () => {
      const { gsap } = await import("gsap");
      gsap
        .timeline({ onComplete: () => { setHidden(true); fire(); } })
        .fromTo(brandRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "expo.out" })
        .to(brandRef.current, { opacity: 0, y: -10, duration: 0.28, ease: "expo.in" }, "+=0.55")
        .to(overlayRef.current, { yPercent: -100, duration: 0.65, ease: "power4.inOut" }, "-=0.08");
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div ref={overlayRef} className="preloader" aria-hidden>
      <div ref={brandRef} className="preloader-brand">
        <b className="preloader-b">B</b>
        <span className="preloader-rest">uxSoft</span>
      </div>
    </div>
  );
}
