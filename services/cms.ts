import type { CmsData, LeadPayload, Problem, ProcessStep, Tariff } from "@/types/cms";

const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

/* PROBLEMS/PROCESS sheetlari hali yaratilmagan bo'lsa ishlatiladigan zaxira kontent.
   Sheetga qator qo'shilsa, avtomatik shu o'rniga o'tadi. */
export const DEFAULT_PROBLEMS: Problem[] = [
  { id: "p1", pain: "Soliq tekshiruvi kelsa, hujjatlarim tayyormi — bilmayman", solution: "Tekshiruvdan oldin to‘liq audit o‘tkazamiz va kamchiliklarni oldindan yopamiz.", sort: 10 },
  { id: "p2", pain: "Buxgalterim ketib qoldi, hisobotlar to‘xtab qoldi", solution: "Ishni 24 soat ichida qabul qilib olamiz — birorta muddat o‘tib ketmaydi.", sort: 20 },
  { id: "p3", pain: "EHF, QQS, yangi qonunlar — boshim qotib qoldi", solution: "Qonun o‘zgarishlarini biz kuzatamiz, siz faqat biznesingiz bilan shug‘ullanasiz.", sort: 30 },
  { id: "p4", pain: "Jarima kelib qoladi, sababini ham bilmayman", solution: "Hisobotlar har oy muddatidan oldin topshiriladi — nazorat to‘liq bizda.", sort: 40 },
  { id: "p5", pain: "Shtatdagi buxgalter qimmat: oylik, soliqlar, ta’til...", solution: "Autsorsing shtat buxgalterdan sezilarli arzon — faqat xizmat uchun to‘laysiz.", sort: 50 },
  { id: "p6", pain: "Narxlar shaffof emas, oxirida qo‘shimcha to‘lovlar chiqadi", solution: "Narxni saytda o‘zingiz hisoblaysiz — shartnomadagi narx o‘zgarmaydi.", sort: 60 }
];

export const DEFAULT_PROCESS: ProcessStep[] = [
  { id: "pr1", title: "Bepul diagnostika", text: "Qo‘ng‘iroq qilamiz, holatingizni o‘rganamiz va aniq taklif beramiz.", sort: 10 },
  { id: "pr2", title: "Og‘riqsiz o‘tish", text: "Hujjatlar va bazani o‘zimiz qabul qilib olamiz — ishingiz bir kun ham to‘xtamaydi.", sort: 20 },
  { id: "pr3", title: "Doimiy yurituv", text: "Hisobotlar muddatida topshiriladi, har oy holat bo‘yicha hisobot berib boramiz.", sort: 30 }
];

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
    lead_success_text: "Mutaxassislarimiz tez orada siz bilan bog‘lanadi.",
    problems_badge: "Muammo → yechim",
    problems_title: "Tanish muammolarmi?",
    problems_subtitle: "Har kuni tadbirkorlardan eshitadigan og‘riqlar — birini oching, yechimini ko‘ring.",
    process_badge: "3 qadam",
    process_title: "Qanday ishlaymiz?",
    guarantee_title: "Bizning aybimiz bilan jarima chiqsa — zararni o‘zimiz qoplaymiz",
    guarantee_text: "Bu og‘zaki va’da emas — shartnomada yozib beriladi.",
    guarantee_cta: "Bepul konsultatsiya",
    wizard_badge: "Bir daqiqada",
    wizard_title: "Bepul konsultatsiya oling"
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
  ],
  problems: DEFAULT_PROBLEMS,
  process: DEFAULT_PROCESS
};

/* Sheet ustun sarlavhalarida ba'zan asosiy (o'zbekcha) ustunga " (UZ)" qo'shib qo'yiladi —
   RU tarjima ustunlaridan (`_ru`) ajratish uchun. Kod esa maydonlarni suffikssiz o'qiydi
   (masalan `title`, `pain`, `name`), shuning uchun har qatorda "field (UZ)" → "field" ga
   normallashtiramiz. Shu tufayli Sheet sarlavhalari qanday bo'lishidan qat'i nazar UZ rejimi ishlaydi. */
const UZ_SUFFIX = /\s*\(\s*uz\s*\)\s*$/i;
function stripUzSuffix<T extends Record<string, unknown>>(row: T): T {
  let changed = false;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const base = key.replace(UZ_SUFFIX, "");
    if (base !== key) changed = true;
    /* asosiy kalit hali bo'sh bo'lsa suffiksli ustun qiymatini yozamiz — mavjud toza qiymatni ustidan yozmaymiz */
    if (out[base] === undefined || out[base] === null || out[base] === "") out[base] = value;
  }
  return (changed ? out : row) as T;
}

function normalizeRows<T>(rows: unknown): T[] {
  return Array.isArray(rows) ? rows.map((r) => stripUzSuffix((r ?? {}) as Record<string, unknown>) as T) : [];
}

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
  /* "field (UZ)" → "field" — sozlama kalitlari uchun ham (garchi SETTINGS odatda toza bo'lsa-da) */
  const settings = { ...fallbackData.settings, ...(stripUzSuffix((data.settings || {}) as Record<string, unknown>) as CmsData["settings"]) };

  const srcCategories = data.categories ? normalizeRows<CmsData["categories"][number]>(data.categories) : fallbackData.categories;
  const categories = sortBySort(srcCategories.filter(isActive));

  const srcTariffs = data.tariffs ? normalizeRows<Tariff>(data.tariffs) : fallbackData.tariffs;
  const tariffs = sortBySort(srcTariffs.filter(isActive).map((tariff): Tariff => ({
    ...tariff,
    price: toNumber(tariff.price),
    old_price: tariff.old_price ? toNumber(tariff.old_price) : "",
    features: splitFeatures((tariff as unknown as { features: unknown }).features)
  })));

  const srcServices = data.services ? normalizeRows<CmsData["services"][number]>(data.services) : fallbackData.services;
  const services = sortBySort(srcServices.filter(isActive).map((service) => ({
    ...service,
    price: toNumber(service.price)
  })));

  const srcTestimonials = data.testimonials ? normalizeRows<CmsData["testimonials"][number]>(data.testimonials) : fallbackData.testimonials;
  const testimonials = sortBySort(srcTestimonials.filter(isActive).map((item) => ({
    ...item,
    rating: Number(item.rating || 5)
  })));

  const srcFaq = data.faq ? normalizeRows<CmsData["faq"][number]>(data.faq) : fallbackData.faq;
  const faq = sortBySort(srcFaq.filter(isActive));

  const srcStats = data.stats ? normalizeRows<CmsData["stats"][number]>(data.stats) : fallbackData.stats;
  const stats = sortBySort(srcStats.filter(isActive));

  /* PROBLEMS/PROCESS sheeti bo'sh yoki hali yaratilmagan bo'lsa — zaxira kontent */
  const rawProblems = normalizeRows<Problem>(data.problems).filter(isActive);
  const problems = rawProblems.length ? sortBySort(rawProblems) : DEFAULT_PROBLEMS;
  const rawProcess = normalizeRows<ProcessStep>(data.process).filter(isActive);
  const process = rawProcess.length ? sortBySort(rawProcess) : DEFAULT_PROCESS;

  return { settings, categories, tariffs, services, testimonials, faq, stats, problems, process };
}

export async function getCmsData(): Promise<CmsData> {
  if (!API_URL) return normalizeCmsData(fallbackData);

  try {
    const res = await fetch(API_URL, { cache: "no-store" });
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
