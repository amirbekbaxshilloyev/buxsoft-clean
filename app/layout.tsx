import type { Metadata } from "next";
import Script from "next/script";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Preloader }            from "@/components/Preloader";
import { GrainOverlay }         from "@/components/GrainOverlay";
import { GoldenThread }         from "@/components/GoldenThread";
import { TelegramFloat }        from "@/components/TelegramFloat";
import "./globals.css";

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
    <html lang="uz" suppressHydrationWarning>
      <head>
        {/* Apply theme before paint — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      </head>
      <body>
        <SmoothScrollProvider>
          <Preloader />
          <GrainOverlay />
          <GoldenThread />
          {/* Subtle animated background blobs — CSS only, no WebGL */}
          <div className="bg-blob bg-blob--1" aria-hidden />
          <div className="bg-blob bg-blob--2" aria-hidden />
          {children}
          <TelegramFloat />
        </SmoothScrollProvider>

        <Script src="https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/lib/vanilla-tilt.min.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
