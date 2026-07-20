import Image from "next/image";

/* BuxSoft logo — doiraviy monogram ("tanga": oltin halqa + krem yuza + ko'mir "B")
   har qanday fonda (qorong'i hero, light/dark) yaxshi ko'rinadi, chunki o'zi
   mustaqil emblema. Yonida "BUXSOFT" wordmark adaptiv matn sifatida —
   currentColor bilan header kontekstiga (hero ustida krem, scroll'da tema) moslashadi. */
export function Logo({ showWord = true }: { showWord?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
        <Image
          src="/images/logo-mark.png"
          alt="BuxSoft"
          fill
          sizes="36px"
          priority
          className="scale-[1.04] object-cover"
        />
      </span>
      {showWord && (
        <span className="hidden text-[1.15rem] font-extrabold uppercase leading-none tracking-[0.12em] sm:inline-flex">
          BUX<span className="font-medium opacity-90">SOFT</span>
        </span>
      )}
    </span>
  );
}
