"use client";

import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { ThemeToggle } from "./ThemeToggle";

/* Sticky sayt header — hero foto ustida shaffof, scroll'da qattiq (blur + fon).
   BuxSoftApp ichida `fixed` sifatida render qilinadi (SmoothScroll transform
   ishlatmaydi, shu bois position:fixed to'g'ri ishlaydi). */
export function SiteHeader({
  scrolled,
  ctaText,
  ctaHref = "#wizard",
}: {
  scrolled: boolean;
  ctaText: string;
  ctaHref?: string;
}) {
  return (
    <header className={`site-header ${scrolled ? "site-header--solid" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" aria-label="BuxSoft — bosh sahifa" className="flex items-center">
          <Logo />
        </a>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <LangSwitcher />
          <ThemeToggle />
          <a
            href={ctaHref}
            className="btn-glow rounded-full px-4 py-2 text-xs font-bold sm:text-sm"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
