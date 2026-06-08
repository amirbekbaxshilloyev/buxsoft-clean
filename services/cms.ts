import type { CmsData, LeadPayload, Tariff } from "@/types/cms";

const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

const fallbackData: CmsData = {
  settings: {
    site_title: "BuxSoft",
    hero_badge: "Google Sheets CMS bilan avtomatlashtirilgan accounting platforma",
    hero_title: "Buxgalteriya va soliq ishlaringizni premium darajada avtomatlashtiring",
    hero_subtitle: "Faoliyat turini tanlang, tarifni ko‘ring, xizmatlarni belgilang va narxni real vaqtda hisoblang.",
    cta_text: "Bepul konsultatsiya olish",
    secondary_cta_text: "Tariflarni ko‘rish",
    sticky_cta_text: "Hisob-kitob qilish",
    currency: "so‘m",
    phone: "+998 90 000 00 00",
    email: "hello@buxsoft.uz",
    address: "Toshkent, O‘zbekiston",
    footer_text: "BuxSoft — buxgalteriya, soliq va biznes autsorsing xizmatlari.",
    lead_success_title: "So‘rovingiz qabul qilindi",
    lead_success_text: "Mutaxassislarimiz tez orada siz bilan bog‘lanadi."
  },
  categories: [
    { id: "construction", name: "Qurilish", emoji: "🏗️", description: "Qurilish kompaniyalari uchun buxgalteriya va soliq hisobi.", active: true, sort: 10 },
    { id: "retail", name: "Savdo", emoji: "🛒", description: "Do‘kon, distribyutor va importchilar uchun hisob.", active: true, sort: 20 }
  ],
  tariffs: [
    { id: "construction_pro", category_id: "construction", name: "Pro", badge: "Tavsiya etiladi", price: 2900000, old_price: 3500000, description: "Murakkab qurilish hisoblari uchun.", features: ["Obyektlar bo‘yicha hisob", "QQS nazorati", "Haftalik hisobot"], popular: true, gradient: "from-violet-500 to-blue-500", active: true, sort: 10 },
    { id: "retail_pro", category_id: "retail", name: "Retail Pro", badge: "Ommabop", price: 2400000, description: "Savdo bizneslari uchun.", features: ["Filiallar kesimida hisob", "Ombor tahlili", "Soliq hisobotlari"], popular: true, gradient: "from-cyan-500 to-blue-500", active: true, sort: 10 }
  ],
  services: [
    { id: "svc_tax", tariff_id: "construction_pro", name: "Soliq risk auditi", description: "Soliq risklarini aniqlash.", price: 900000, active: true, sort: 10 },
    { id: "svc_inventory", tariff_id: "retail_pro", name: "Ombor inventarizatsiyasi", description: "Ombor qoldiqlarini tekshirish.", price: 700000, active: true, sort: 10 }
  ],
  testimonials: [],
  faq: [],
  stats: [
    { id: "s1", title: "Yillik tajriba", value: 7, suffix: "+", active: true, sort: 10 },
    { id: "s2", title: "Mijozlar", value: 120, suffix: "+", active: true, sort: 20 }
  ]
};

function isActive(item: { active?: boolean }) {
  return item.active !== false;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value.replace(/[^0-9.-]/g, "")) || 0;
  return 0;
}

function splitFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((x) => x.trim()).filter(Boolean);
  if (typeof value === "string") return value.split("|").map((x) => x.trim()).filter(Boolean);
  return [];
}

function sortBySort<T extends { sort?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
}

export function normalizeCmsData(raw: Partial<CmsData> | undefined | null): CmsData {
  const data = raw || fallbackData;
  const settings = { ...fallbackData.settings, ...(data.settings || {}) };

  const categories = sortBySort((Array.isArray(data.categories) ? data.categories : fallbackData.categories).filter(isActive));
  const tariffs = sortBySort((Array.isArray(data.tariffs) ? data.tariffs : fallbackData.tariffs).filter(isActive).map((tariff): Tariff => ({
    ...tariff,
    price: toNumber(tariff.price),
    old_price: tariff.old_price ? toNumber(tariff.old_price) : "",
    features: splitFeatures((tariff as unknown as { features: unknown }).features)
  })));
  const services = sortBySort((Array.isArray(data.services) ? data.services : fallbackData.services).filter(isActive).map((service) => ({
    ...service,
    price: toNumber(service.price)
  })));
  const testimonials = sortBySort((Array.isArray(data.testimonials) ? data.testimonials : fallbackData.testimonials).filter(isActive).map((item) => ({
    ...item,
    rating: Number(item.rating || 5)
  })));
  const faq = sortBySort((Array.isArray(data.faq) ? data.faq : fallbackData.faq).filter(isActive));
  const stats = sortBySort((Array.isArray(data.stats) ? data.stats : fallbackData.stats).filter(isActive));

  return { settings, categories, tariffs, services, testimonials, faq, stats };
}

export async function getCmsData(): Promise<CmsData> {
  if (!API_URL) return normalizeCmsData(fallbackData);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(API_URL, { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return normalizeCmsData(fallbackData);
    const json = await res.json();
    if (!json.success) return normalizeCmsData(fallbackData);
    return normalizeCmsData(json.data);
  } catch {
    return normalizeCmsData(fallbackData);
  }
}

export async function submitLead(payload: LeadPayload) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_APPS_SCRIPT_URL is missing");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Lead submit failed");
  return json;
}
