"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Send, Sparkles, Star } from "lucide-react";
import type { Category, CmsData, Service, Tariff } from "@/types/cms";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { cn, money } from "@/lib/utils";
import { submitLead } from "@/services/cms";

function setting(data: CmsData, key: string, fallback = "") {
  const value = data.settings[key];
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function sortItems<T extends { sort?: number }>(items: T[]) {
  return [...items].sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
}

export function BuxSoftApp({ data }: { data: CmsData }) {
  const currency = setting(data, "currency", "so‘m");
  const categories = useMemo(() => sortItems(data.categories), [data.categories]);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [tariffId, setTariffId] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", company: "", phone: "", telegram: "", comment: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const selectedCategory = categories.find((item) => item.id === categoryId) || categories[0];

  const categoryTariffs = useMemo(() => {
    const id = selectedCategory?.id || "";
    return sortItems(data.tariffs.filter((tariff) => tariff.category_id === id));
  }, [data.tariffs, selectedCategory?.id]);

  useEffect(() => {
    if (!categoryId && categories[0]) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  useEffect(() => {
    if (!categoryTariffs.length) {
      setTariffId("");
      setSelectedServices([]);
      return;
    }
    if (!categoryTariffs.some((tariff) => tariff.id === tariffId)) {
      setTariffId(categoryTariffs[0].id);
      setSelectedServices([]);
    }
  }, [categoryTariffs, tariffId]);

  const selectedTariff = categoryTariffs.find((tariff) => tariff.id === tariffId) || categoryTariffs[0];

  const availableServices = useMemo(() => {
    if (!selectedTariff) return [];
    return sortItems(data.services.filter((service) => service.tariff_id === selectedTariff.id));
  }, [data.services, selectedTariff]);

  const extraTotal = availableServices
    .filter((service) => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + Number(service.price || 0), 0);

  const total = Number(selectedTariff?.price || 0) + extraTotal;

  function chooseCategory(category: Category) {
    setCategoryId(category.id);
    const nextTariff = sortItems(data.tariffs.filter((tariff) => tariff.category_id === category.id))[0];
    setTariffId(nextTariff?.id || "");
    setSelectedServices([]);
    window.setTimeout(() => {
      document.getElementById("tariffs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function chooseTariff(tariff: Tariff) {
    setTariffId(tariff.id);
    setSelectedServices([]);
    window.setTimeout(() => {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function toggleService(service: Service) {
    setSelectedServices((current) =>
      current.includes(service.id) ? current.filter((id) => id !== service.id) : [...current, service.id]
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCategory || !selectedTariff) return;
    setStatus("loading");
    try {
      await submitLead({
        ...form,
        industry: selectedCategory.name,
        tariff: selectedTariff.name,
        services: availableServices.filter((service) => selectedServices.includes(service.id)).map((service) => service.name),
        total
      });
      setStatus("success");
      setForm({ name: "", company: "", phone: "", telegram: "", comment: "" });
      setSelectedServices([]);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="bg-premium min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-70" />

      <section className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <nav className="glass mb-12 flex items-center justify-between rounded-full px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">B</div>
            <span className="font-semibold tracking-tight">{setting(data, "site_title", "BuxSoft")}</span>
          </div>
          <a href="#calculator" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-100 sm:text-sm">
            {setting(data, "sticky_cta_text", "Hisob-kitob")}
          </a>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-100">
              <Sparkles size={16} />
              {setting(data, "hero_badge", "Google Sheets CMS")}
            </div>
            <h1 className="max-w-5xl text-balance bg-gradient-to-br from-white via-blue-50 to-violet-200 bg-clip-text text-[46px] font-bold leading-[1.02] tracking-[-0.05em] text-transparent drop-shadow-[0_20px_60px_rgba(255,255,255,0.08)] sm:text-6xl lg:text-[84px]">
              {setting(data, "hero_title", "Buxgalteriya va soliq ishlaringizni avtomatlashtiring")}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-xl">
              {setting(data, "hero_subtitle", "Faoliyat turini tanlang, tarif va xizmatlarni ko‘ring.")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#calculator" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
                {setting(data, "cta_text", "Bepul konsultatsiya olish")}
              </a>
              <a href="#tariffs" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/90 transition hover:bg-white/10">
                {setting(data, "secondary_cta_text", "Tariflarni ko‘rish")}
              </a>
            </div>
          </div>

          <div className="glass relative rounded-[2rem] p-5 shadow-glow sm:p-6">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-indigo-500/40 blur-3xl" />
            <div className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
              <p className="text-sm text-slate-400">Live quote</p>
              <div className="mt-3 text-3xl font-black sm:text-4xl">
                <AnimatedNumber value={total} /> <span className="text-lg text-slate-400">{currency}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {data.stats.slice(0, 4).map((stat) => (
                  <div key={stat.id} className="rounded-2xl bg-white/5 p-4">
                    <div className="text-2xl font-black">{stat.value}{stat.suffix}</div>
                    <div className="mt-1 text-sm text-slate-400">{stat.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[.28em] text-cyan-300">CMS calculator</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Faoliyat turini tanlang</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => chooseCategory(category)}
              className={cn(
                "glass rounded-3xl p-5 text-left transition duration-200 hover:-translate-y-1 hover:bg-white/10",
                selectedCategory?.id === category.id && "border-cyan-300/70 ring-2 ring-cyan-300/70"
              )}
            >
              <div className="text-3xl">{category.emoji}</div>
              <h3 className="mt-4 text-lg font-black">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{category.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section id="tariffs" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.28em] text-violet-300">Dynamic pricing</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Dinamik tariflar</h2>
          </div>
          {selectedCategory && <div className="text-sm text-slate-400">Tanlangan: <b className="text-white">{selectedCategory.name}</b></div>}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {categoryTariffs.length ? categoryTariffs.map((tariff) => (
            <button
              type="button"
              key={tariff.id}
              onClick={() => chooseTariff(tariff)}
              className={cn(
                "glass relative rounded-[2rem] p-6 text-left transition duration-200 hover:-translate-y-1 hover:bg-white/10",
                selectedTariff?.id === tariff.id && "border-violet-300/70 ring-2 ring-violet-300/70"
              )}
            >
              {tariff.badge && (
                <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">
                  {tariff.badge}
                </div>
              )}
              <div className={cn("mb-6 h-2 w-24 rounded-full bg-gradient-to-r", tariff.gradient || "from-cyan-400 to-violet-500")} />
              <h3 className="text-2xl font-black">{tariff.name}</h3>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-300">{tariff.description}</p>
              <div className="mt-5 text-3xl font-black">{money(tariff.price, currency)}</div>
              {tariff.old_price ? <div className="mt-1 text-sm text-slate-500 line-through">{money(tariff.old_price, currency)}</div> : null}
              <ul className="mt-6 space-y-3">
                {tariff.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          )) : (
            <div className="glass rounded-[2rem] p-6 text-slate-300 lg:col-span-3">Bu faoliyat turi uchun tariflar hali Google Sheetsga kiritilmagan.</div>
          )}
        </div>
      </section>

      <section id="services" className="relative mx-auto grid max-w-7xl scroll-mt-8 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="glass rounded-[2rem] p-6">
          <h2 className="text-3xl font-black">Qo‘shimcha xizmatlar</h2>
          <p className="mt-2 text-sm text-slate-400">Xizmat tanlang — narx avtomatik yangilanadi.</p>
          <div className="mt-6 grid gap-3">
            {availableServices.length ? availableServices.map((service) => (
              <label key={service.id} className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => toggleService(service)}
                  className="mt-1 h-5 w-5 accent-cyan-300"
                />
                <div className="flex-1">
                  <div className="font-bold">{service.name}</div>
                  <div className="mt-1 text-sm text-slate-400">{service.description}</div>
                </div>
                <b className="text-sm sm:text-base">{money(service.price, currency)}</b>
              </label>
            )) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">Bu tarif uchun qo‘shimcha xizmatlar hali kiritilmagan.</div>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-[2rem] p-6">
          <h2 className="text-3xl font-black">So‘rov yuborish</h2>
          <div className="mt-5 rounded-2xl bg-white/5 p-4">
            <span className="text-sm text-slate-400">Jami taxminiy narx</span>
            <div className="mt-1 text-3xl font-black"><AnimatedNumber value={total} /> <span className="text-lg text-slate-400">{currency}</span></div>
          </div>
          <div className="mt-5 space-y-3">
            <input className="input" required placeholder="Ismingiz" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <input className="input" placeholder="Kompaniya" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
            <input className="input" placeholder="Telefon" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <input className="input" placeholder="Telegram" value={form.telegram} onChange={(event) => setForm({ ...form, telegram: event.target.value })} />
            <textarea className="input min-h-28" placeholder="Izoh" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || (!form.phone && !form.telegram)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
            {status === "loading" ? "Yuborilmoqda..." : setting(data, "cta_text", "Yuborish")}
          </button>
          {status === "success" && <div className="mt-4 rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-200">{setting(data, "lead_success_title", "Qabul qilindi")}. {setting(data, "lead_success_text", "Tez orada bog‘lanamiz.")}</div>}
          {status === "error" && <div className="mt-4 rounded-2xl bg-red-400/10 p-4 text-sm text-red-200">Xatolik yuz berdi. Telefon yoki Telegramni tekshirib qayta urinib ko‘ring.</div>}
        </form>
      </section>

      {data.testimonials.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-5xl">Mijozlar fikri</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {data.testimonials.map((item) => (
              <div key={item.id} className="glass rounded-[2rem] p-6">
                <div className="flex gap-1 text-amber-300">{Array.from({ length: Math.max(1, Math.min(5, item.rating)) }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
                <p className="mt-5 text-slate-200">“{item.text}”</p>
                <b className="mt-5 block">{item.name}</b>
                <span className="text-sm text-slate-400">{item.company}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.faq.length > 0 && (
        <section className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-5xl">FAQ</h2>
          <div className="mt-6 divide-y divide-white/10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            {data.faq.map((item) => (
              <details key={item.id} className="group p-5">
                <summary className="cursor-pointer font-bold">{item.question}</summary>
                <p className="mt-3 text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <footer className="relative mx-auto max-w-7xl px-4 py-12 text-sm text-slate-400 sm:px-6 lg:px-8">
        <div className="glass rounded-[2rem] p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <b className="text-white">{setting(data, "site_title", "BuxSoft")}</b>
              <p className="mt-2 max-w-xl">{setting(data, "footer_text", "Buxgalteriya xizmatlari")}</p>
            </div>
            <div className="space-y-1">
              <div>{setting(data, "phone", "+998 90 000 00 00")}</div>
              <div>{setting(data, "email", "hello@buxsoft.uz")}</div>
              <div>{setting(data, "address", "Toshkent")}</div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
