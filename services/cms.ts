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

  /* PROBLEMS/PROCESS sheeti bo'sh yoki hali yaratilmagan bo'lsa — zaxira kontent */
  const rawProblems = (Array.isArray(data.problems) ? data.problems : []).filter(isActive);
  const problems = rawProblems.length ? sortBySort(rawProblems) : DEFAULT_PROBLEMS;
  const rawProcess = (Array.isArray(data.process) ? data.process : []).filter(isActive);
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
