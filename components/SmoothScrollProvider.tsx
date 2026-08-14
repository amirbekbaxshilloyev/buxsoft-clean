"use client";

/* NATIVE SCROLL — Lenis (JS smooth-scroll) OLIB TASHLANDI.
   Lenis har kadrda butun sahifani transform bilan suradi va scroll hodisalarini
   yuqori chastotada yuboradi — effektli sahifada bu qotishga sabab bo'lardi.
   Brauzerning o'z native scroll'i GPU-tezlashtirilgan va hech qachon qotmaydi.
   GSAP ScrollTrigger reveal animatsiyalari native scroll bilan avtomatik ishlaydi. */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
