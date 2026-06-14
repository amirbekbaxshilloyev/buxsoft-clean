import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuxSoft — Google Sheets CMS Accounting Platform",
  description: "Premium accounting SaaS website powered by Google Sheets CMS."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      </head>
      <body>
        {children}
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/lib/vanilla-tilt.min.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
