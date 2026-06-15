"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let px = 0, py = 0, rx = 0, ry = 0, rafId = 0;

    function onMove(e: MouseEvent) {
      px = e.clientX;
      py = e.clientY;
      dot!.style.transform = `translate(calc(${px}px - 50%), calc(${py}px - 50%))`;
    }

    function tick() {
      rx += (px - rx) * 0.11;
      ry += (py - ry) * 0.11;
      ring!.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      rafId = requestAnimationFrame(tick);
    }

    function onEnter() { ring!.setAttribute("data-hover", "1"); }
    function onLeave() { ring!.removeAttribute("data-hover"); }

    document.addEventListener("mousemove", onMove, { passive: true });

    function attachHovers() {
      document.querySelectorAll("a, button, input, textarea, label, [data-magnetic]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }
    attachHovers();

    dot.style.opacity  = "1";
    ring.style.opacity = "1";
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  style={{ opacity: 0 }} aria-hidden />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden />
    </>
  );
}
