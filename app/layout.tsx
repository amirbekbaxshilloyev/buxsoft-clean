import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuxSoft — Google Sheets CMS Accounting Platform",
  description: "Premium accounting SaaS website powered by Google Sheets CMS."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body>{children}</body>
    </html>
  );
}
