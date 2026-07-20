import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CmsData } from "@/types/cms";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setting(data: CmsData, key: string, fallback = ""): string {
  const v = data.settings[key];
  return v === undefined || v === null || v === "" ? fallback : String(v);
}

export function money(value: number | string | undefined, currency = "so‘m", lang: "uz" | "ru" = "uz") {
  const n = Number(value || 0);
  if (!n) return lang === "ru" ? "Индивидуально" : "Individual";
  return `${new Intl.NumberFormat("uz-UZ").format(n)} ${currency}`;
}

export function sortBySort<T extends { sort?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
}
