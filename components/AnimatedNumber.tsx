"use client";

export function AnimatedNumber({ value }: { value: number }) {
  return <>{new Intl.NumberFormat("uz-UZ").format(Math.round(value || 0))}</>;
}
