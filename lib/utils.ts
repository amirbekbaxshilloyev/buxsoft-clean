import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(value: number | string | undefined, currency = "so‘m") {
  const n = Number(value || 0);
  if (!n) return "Individual";
  return `${new Intl.NumberFormat("uz-UZ").format(n)} ${currency}`;
}
