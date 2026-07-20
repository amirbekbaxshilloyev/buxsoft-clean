"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CmsData } from "@/types/cms";

/* ══════════════════════════════════════════════════
   i18n — UZ (asosiy) / RU
   • CMS matni: Sheet'dagi `_ru` ustun/qatorlar orqali (loc/settingL)
   • Qat'iy UI matni: quyidagi UI lug'ati orqali (tr)
   • `_ru` bo'sh bo'lsa avtomatik UZ'ga qaytadi — orqaga to'liq mos
══════════════════════════════════════════════════ */
export type Lang = "uz" | "ru";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "uz",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  useEffect(() => {
    const saved = localStorage.getItem("bx-lang");
    if (saved === "ru" || saved === "uz") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("bx-lang", l);
    document.documentElement.setAttribute("lang", l === "ru" ? "ru" : "uz");
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

/* CMS obyektining lokal maydonini oladi: RU bo'lsa `<field>_ru`, bo'sh bo'lsa UZ */
export function loc(obj: unknown, field: string, lang: Lang): string {
  const o = (obj ?? {}) as Record<string, unknown>;
  if (lang === "ru") {
    const ru = o[`${field}_ru`];
    if (typeof ru === "string" && ru.trim() !== "") return ru;
    if (typeof ru === "number") return String(ru);
  }
  const base = o[field];
  return base === undefined || base === null ? "" : String(base);
}

/* SETTINGS lokal qiymati: RU bo'lsa `<key>_ru`, bo'lmasa UZ, bo'lmasa fallback */
export function settingL(data: CmsData, key: string, fallback: string, lang: Lang): string {
  if (lang === "ru") {
    const ru = data.settings[`${key}_ru`];
    if (ru !== undefined && ru !== null && String(ru).trim() !== "") return String(ru);
  }
  const v = data.settings[key];
  return v === undefined || v === null || v === "" ? fallback : String(v);
}

/* Pipe (|) bilan ajratilgan lokal ro'yxat (masalan tariff features) */
export function locList(obj: unknown, field: string, lang: Lang): string[] {
  const raw = loc(obj, field, lang);
  return raw ? raw.split("|").map((x) => x.trim()).filter(Boolean) : [];
}

/* ── Qat'iy UI matnlari ── */
const UI: Record<string, { uz: string; ru: string }> = {
  back:            { uz: "← Orqaga", ru: "← Назад" },
  continue:        { uz: "Davom etish", ru: "Продолжить" },
  sending:         { uz: "Yuborilmoqda...", ru: "Отправка..." },
  step_1:          { uz: "Kontakt", ru: "Контакт" },
  step_2:          { uz: "Faoliyat", ru: "Деятельность" },
  step_3:          { uz: "Tarif", ru: "Тариф" },
  step_4:          { uz: "Xizmatlar", ru: "Услуги" },
  step_5:          { uz: "Tasdiqlash", ru: "Подтверждение" },

  reg_title:       { uz: "Keling, tanishamiz", ru: "Давайте познакомимся" },
  reg_sub:         { uz: "Ism va telefon raqamingizni qoldiring — mutaxassisimiz siz bilan bog‘lanadi.", ru: "Оставьте имя и номер телефона — наш специалист свяжется с вами." },
  name_ph:         { uz: "Ismingiz", ru: "Ваше имя" },
  name_err:        { uz: "Ism kamida 2 ta belgidan iborat bo‘lishi kerak.", ru: "Имя должно содержать минимум 2 символа." },
  phone_err:       { uz: "To‘liq telefon raqamini kiriting (masalan: 90 123 45 67).", ru: "Введите полный номер телефона (например: 90 123 45 67)." },
  tg_continue:     { uz: "Telegram orqali davom etish →", ru: "Продолжить через Telegram →" },

  activity_title:  { uz: "Faoliyat turingizni tanlang", ru: "Выберите вид деятельности" },
  change:          { uz: "O‘zgartirish", ru: "Изменить" },

  tariff_pick:     { uz: "tarifni tanlang", ru: "выберите тариф" },
  no_tariffs:      { uz: "Bu faoliyat turi uchun tariflar hali kiritilmagan.", ru: "Тарифы для этого вида деятельности пока не добавлены." },

  services_title:  { uz: "Qo‘shimcha xizmatlar", ru: "Дополнительные услуги" },
  optional:        { uz: "(ixtiyoriy)", ru: "(необязательно)" },
  services_hint:   { uz: "Kerakli xizmatlarni belgilang yoki shunchaki davom eting.", ru: "Отметьте нужные услуги или просто продолжите." },

  summary_title:   { uz: "Buyurtmani tasdiqlang", ru: "Подтвердите заявку" },
  row_name:        { uz: "Ism", ru: "Имя" },
  row_phone:       { uz: "Telefon", ru: "Телефон" },
  row_activity:    { uz: "Faoliyat", ru: "Деятельность" },
  row_tariff:      { uz: "Tarif", ru: "Тариф" },
  row_services:    { uz: "Xizmatlar", ru: "Услуги" },
  total_price:     { uz: "Jami narx", ru: "Итоговая цена" },
  total:           { uz: "Jami", ru: "Итого" },
  per_month:       { uz: "/oy", ru: "/мес" },
  tg_discount:     { uz: "Telegram kanalimizga obuna bo‘lsangiz — 5% chegirmaga ega bo‘lasiz", ru: "Подпишитесь на наш Telegram-канал — получите скидку 5%" },
  tg_go:           { uz: "Kanalga o‘tish →", ru: "Перейти в канал →" },
  tg_subscribed:   { uz: "Obuna bo‘ldim — 5% chegirmani qo‘llash", ru: "Я подписался — применить скидку 5%" },
  comment_ph:      { uz: "Izoh (ixtiyoriy)", ru: "Комментарий (необязательно)" },
  confirm_order:   { uz: "Buyurtmani tasdiqlash", ru: "Подтвердить заявку" },
  tg_channel:      { uz: "Telegram kanal", ru: "Telegram-канал" },
  error_generic:   { uz: "Xatolik yuz berdi. Qayta urinib ko‘ring.", ru: "Произошла ошибка. Попробуйте ещё раз." },
  individual:      { uz: "Individual", ru: "Индивидуально" },

  hero_stats_label:{ uz: "BuxSoft raqamlarda", ru: "BuxSoft в цифрах" },
  solution_see:    { uz: "Yechimni ko‘rish ↓", ru: "Посмотреть решение ↓" },
  solution_close:  { uz: "Yopish ↑", ru: "Свернуть ↑" },
  calc_price:      { uz: "Narxni hisoblash →", ru: "Рассчитать цену →" },
  testimonials_title: { uz: "Mijozlar fikri", ru: "Отзывы клиентов" },
  faq_title:       { uz: "Ko‘p so‘raladigan savollar", ru: "Частые вопросы" },

  group_trade:      { uz: "Savdo va import-eksport", ru: "Торговля и импорт-экспорт" },
  group_production: { uz: "Ishlab chiqarish va qurilish", ru: "Производство и строительство" },
  group_services:   { uz: "Xizmatlar", ru: "Услуги" },
  group_yatt:       { uz: "YATT", ru: "ИП (ЯТТ)" },
};

export function tr(key: string, lang: Lang): string {
  const e = UI[key];
  return e ? e[lang] : key;
}

/* Komponentlar uchun qulay hook — lang'ga bog'langan helperlar */
export function useI18n() {
  const { lang, setLang } = useContext(LangContext);
  return useMemo(
    () => ({
      lang,
      setLang,
      t: (key: string) => tr(key, lang),
      s: (data: CmsData, key: string, fallback = "") => settingL(data, key, fallback, lang),
      L: (obj: unknown, field: string) => loc(obj, field, lang),
      LList: (obj: unknown, field: string) => locList(obj, field, lang),
    }),
    [lang, setLang]
  );
}
