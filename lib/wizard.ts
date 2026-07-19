import type { CmsData, Category } from "@/types/cms";
import type { PersistedWizardState, WizardFormData } from "@/types/wizard";
import { sortBySort } from "@/lib/utils";

export const WIZARD_FLOW: "registration_first" | "activity_first" = "registration_first";

export const WIZARD_STORAGE_KEY = "buxsoft_wizard_state";

/** Telegram kanalga obuna bo'lgan mijoz uchun chegirma ulushi. */
export const TG_DISCOUNT = 0.05;

export type CategoryGroup = {
  id: string;
  emoji: string;
  name: string;
  categoryIds: string[];
};

const FALLBACK_GROUP_ID = "services";

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: "trade", emoji: "🛒", name: "Savdo va import-eksport", categoryIds: ["retail", "import_export"] },
  { id: "production", emoji: "🏭", name: "Ishlab chiqarish va qurilish", categoryIds: ["manufacturing", "construction"] },
  { id: FALLBACK_GROUP_ID, emoji: "🤝", name: "Xizmatlar", categoryIds: ["it", "restaurant", "education", "medical", "logistics", "rental", "services"] },
  { id: "yatt", emoji: "👤", name: "YATT", categoryIds: ["yatt"] },
];

export function groupForCategoryId(categoryId: string): CategoryGroup {
  const found = CATEGORY_GROUPS.find((g) => g.categoryIds.includes(categoryId));
  return found || CATEGORY_GROUPS.find((g) => g.id === FALLBACK_GROUP_ID)!;
}

/** Har bir guruh uchun unga tegishli CMS kategoriyalarini qaytaradi.
 *  Hech qaysi guruhga kirmagan yangi faoliyat "Xizmatlar" guruhiga tushadi. */
export function buildGroupedCategories(categories: Category[]) {
  const knownIds = new Set(CATEGORY_GROUPS.flatMap((g) => g.categoryIds));
  return CATEGORY_GROUPS.map((group) => {
    const matched = categories.filter((c) => group.categoryIds.includes(c.id));
    const orphans = group.id === FALLBACK_GROUP_ID ? categories.filter((c) => !knownIds.has(c.id)) : [];
    return { group, categories: sortBySort([...matched, ...orphans]) };
  });
}

/** Berilgan wizard formasiga mos kategoriya/tarif/xizmat va jami narxni hisoblaydi. */
export function deriveSelection(data: CmsData, form: WizardFormData) {
  const category = data.categories.find((c) => c.id === form.categoryId);
  const tariffs = category ? sortBySort(data.tariffs.filter((t) => t.category_id === category.id)) : [];
  const tariff = tariffs.find((t) => t.id === form.tariffId);
  const services = tariff ? sortBySort(data.services.filter((s) => s.tariff_id === tariff.id)) : [];
  const selectedServices = services.filter((s) => form.serviceIds.includes(s.id));
  const total = tariff
    ? Number(tariff.price || 0) + selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0)
    : 0;
  return { category, tariffs, tariff, services, selectedServices, total };
}

/** Input qiymatidan 9 xonali lokal raqamni ajratib oladi.
 *  Ko'rinishdagi "+998 " prefiksi raqam sifatida qayta o'qilmasligi kerak,
 *  foydalanuvchi o'zi 998 bilan boshlab yozsa (yoki 998 li raqamni paste qilsa)
 *  bu prefiks ham avtomatik tashlab yuboriladi. */
export function phoneDigitsOnly(input: string): string {
  const withoutPrefix = input.replace(/^\+998\s?/, "");
  let digits = withoutPrefix.replace(/\D/g, "");
  if (digits.length > 9 && digits.startsWith("998")) digits = digits.slice(3);
  return digits.slice(0, 9);
}

export function formatPhoneDisplay(digits: string): string {
  let out = "+998";
  if (digits.length > 0) out += " " + digits.slice(0, 2);
  if (digits.length > 2) out += " " + digits.slice(2, 5);
  if (digits.length > 5) out += " " + digits.slice(5, 7);
  if (digits.length > 7) out += " " + digits.slice(7, 9);
  return out;
}

export function isPhoneValid(digits: string): boolean {
  return /^\d{9}$/.test(digits);
}

export function toE164(digits: string): string {
  return `+998${digits}`;
}

export function withStepMarker(marker: string, comment: string): string {
  const trimmed = comment.trim();
  return trimmed ? `${marker} ${trimmed}` : marker;
}

const UTM_STORAGE_KEY = "buxsoft_utm";

/** Reklama manbasini (utm_* yoki referrer) birinchi kirishda eslab qoladi —
 *  mijoz keyin boshqa sahifaga o'tsa yoki sahifani yangilasa ham yo'qolmaydi. */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const parts = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => params.get(k))
      .filter(Boolean) as string[];
    if (parts.length) {
      window.localStorage.setItem(UTM_STORAGE_KEY, parts.join("/"));
      return;
    }
    if (!window.localStorage.getItem(UTM_STORAGE_KEY) && document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) {
        window.localStorage.setItem(UTM_STORAGE_KEY, host);
      }
    }
  } catch {
    // localStorage yo'q bo'lsa manba yozilmaydi, xolos
  }
}

export function getUtmMarker(): string {
  if (typeof window === "undefined") return "";
  try {
    const v = window.localStorage.getItem(UTM_STORAGE_KEY);
    return v ? `[manba: ${v}]` : "";
  } catch {
    return "";
  }
}

export function loadWizardState(): PersistedWizardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedWizardState;
  } catch {
    return null;
  }
}

export function saveWizardState(state: PersistedWizardState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage to'liq yoki bloklangan bo'lishi mumkin — sessiya davomida davom etaveradi
  }
}

export function clearWizardState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(WIZARD_STORAGE_KEY);
  } catch {
    // ignore
  }
}
