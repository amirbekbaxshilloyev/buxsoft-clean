import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { GrainOverlay }         from "@/components/GrainOverlay";
import { GoldenThread }         from "@/components/GoldenThread";
import { TelegramFloat }        from "@/components/TelegramFloat";
import { LangProvider }         from "@/lib/i18n";
import "./globals.css";

/* Sarlavha shrifti — Manrope (geometrik, kuchli), matn shrifti — Inter.
   Har ikkisi latin + cyrillic (ruscha UI uchun), CSS o'zgaruvchisi orqali ulanadi. */
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuxSoft — Buxgalteriya va soliq autsorsing",
  description: "Buxgalteriya, soliq hisobotlari va biznes jarayonlarini premium autsorsing orqali tartibga solamiz.",
};

/* Inline script — runs before React hydrates to set correct theme class
   and avoid flash of wrong color scheme. */
const themeScript = `(function(){
  var t=localStorage.getItem('bx-theme');
  var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;
  document.documentElement.classList.add(d?'dark':'light');
})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${manrope.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply theme before paint — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* CDN ulanishini oldindan ochish — tsParticles/Swiper tezroq yuklanadi */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      </head>
      <body>
        <LangProvider>
          <SmoothScrollProvider>
            <GrainOverlay />
            <GoldenThread />
            {/* Subtle animated background blobs — CSS only, no WebGL */}
            <div className="bg-blob bg-blob--1" aria-hidden />
            <div className="bg-blob bg-blob--2" aria-hidden />
            <div className="bg-blob bg-blob--3" aria-hidden />
            {children}
          </SmoothScrollProvider>
          <TelegramFloat />
        </LangProvider>

        <Script src="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
