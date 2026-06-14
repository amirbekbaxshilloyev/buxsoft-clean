"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Send, Sparkles, Star } from "lucide-react";
import type { Category, CmsData, Service, Stat, Tariff } from "@/types/cms";
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

function StatCounter({ stat }: { stat: Stat }) {
  const raw = String(stat.value);
  const target = parseFloat(raw.replace(/[^\d.-]/g, "")) || 0;
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setCount(target);
      return;
    }
    const el = ref.current;
    if (!el || done.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        done.current = true;
        obs.disconnect();
        const dur = target > 100000 ? 900 : target > 1000 ? 650 : 450;
        const t0 = performance.now();
        function tick(now: number) {
          const p = Math.min((now - t0) / dur, 1);
          setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-2xl font-black">
      {new Intl.NumberFormat("uz-UZ").format(count)}
      {stat.suffix || ""}
    </div>
  );
}

function waitFor(key: string, timeout = 8000): Promise<any> {
  return new Promise((res, rej) => {
    function check(remaining: number) {
      if ((window as any)[key]) return res((window as any)[key]);
      if (remaining <= 0) return rej(new Error(`${key} not loaded`));
      setTimeout(check, 50, remaining - 50);
    }
    check(timeout);
  });
}

export function BuxSoftApp({ data }: { data: CmsData }) {
  const currency = setting(data, "currency", "so‘m");
  const categories = useMemo(() => sortItems(data.categories), [data.categories]);
  const [categoryId, setCategoryId] = useState("");
  const [tariffId, setTariffId] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", company: "", phone: "", telegram: "", comment: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const heroTitle = setting(data, "hero_title", "Soliq tekshiruvlariga oldindan tayyorlaymiz");
  const [scrolled, setScrolled] = useState(false);
  const [totalPulse, setTotalPulse] = useState(false);
  const typedRef = useRef<HTMLSpanElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((item) => item.id === categoryId);

  const categoryTariffs = useMemo(() => {
    const id = selectedCategory?.id || "";
    if (!id) return [];
    return sortItems(data.tariffs.filter((tariff) => tariff.category_id === id));
  }, [data.tariffs, selectedCategory?.id]);

  const selectedTariff = categoryTariffs.find((tariff) => tariff.id === tariffId);

  const availableServices = useMemo(() => {
    if (!selectedTariff) return [];
    return sortItems(data.services.filter((service) => service.tariff_id === selectedTariff.id));
  }, [data.services, selectedTariff]);

  const extraTotal = availableServices
    .filter((service) => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + Number(service.price || 0), 0);

  const total = selectedTariff ? Number(selectedTariff.price || 0) + extraTotal : 0;

  function chooseCategory(category: Category) {
    setCategoryId(category.id);
    setTariffId("");
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

  function goBackToCategories() {
    setCategoryId("");
    setTariffId("");
    setSelectedServices([]);
    window.setTimeout(() => {
      document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function toggleService(service: Service) {
    setSelectedServices((current) =>
      current.includes(service.id) ? current.filter((id) => id !== service.id) : [...current, service.id]
    );
  }

  // Pulse animation when total changes
  useEffect(() => {
    setTotalPulse(true);
    const t = setTimeout(() => setTotalPulse(false), 400);
    return () => clearTimeout(t);
  }, [total]);

  // Navbar scroll effect
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 60); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // AOS init
  useEffect(() => {
    let cancel = false;
    waitFor("AOS").then((AOS: any) => {
      if (!cancel) AOS.init({ duration: 700, once: true });
    }).catch(() => {});
    return () => { cancel = true; };
  }, []);

  // Typewriter on hero title (desktop only)
  useEffect(() => {
    if (!typedRef.current) return;
    const el = typedRef.current;
    if (window.innerWidth < 640) { el.textContent = heroTitle; return; }
    let cancel = false;
    waitFor("Typed").then((Typed: any) => {
      if (cancel || !el) return;
      const typed = new Typed(el, {
        strings: [heroTitle],
        typeSpeed: 35,
        startDelay: 400,
        showCursor: true,
        cursorChar: "|",
        loop: false,
      });
      return () => typed.destroy();
    }).catch(() => { if (el) el.textContent = heroTitle; });
    return () => { cancel = true; };
  }, [heroTitle]);

  // tsParticles background
  useEffect(() => {
    let cancel = false;
    waitFor("tsParticles").then((tsP: any) => {
      if (cancel || !particlesRef.current) return;
      particlesRef.current.id = "tsparticles-hero";
      const isMobile = window.innerWidth < 640;
      tsP.load("tsparticles-hero", {
        particles: {
          number: { value: isMobile ? 8 : 18, density: { enable: true } },
          color: { value: ["#ffffff", "#a78bfa", "#22d3ee"] },
          opacity: { value: 0.12, random: true },
          size: { value: { min: 1, max: 3 }, random: true },
          move: { enable: true, speed: 0.4, direction: "none", random: true, outModes: "bounce" },
          links: { enable: false },
        },
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
        detectRetina: false,
        fpsLimit: isMobile ? 15 : 25,
      });
    }).catch(() => {});
    return () => { cancel = true; };
  }, []);

  // VanillaTilt on category cards (desktop only)
  useEffect(() => {
    if (window.innerWidth < 768) return;
    let tiltInstances: any[] = [];
    waitFor("VanillaTilt").then((VT: any) => {
      const cards = document.querySelectorAll(".tilt-card");
      if (cards.length) {
        VT.init(cards, { max: 15, speed: 400, glare: true, "max-glare": 0.2 });
        tiltInstances = Array.from(cards);
      }
    }).catch(() => {});
    return () => {
      tiltInstances.forEach((el: any) => { if (el.vanillaTilt) el.vanillaTilt.destroy(); });
    };
  }, [categories]);

  // Swiper for testimonials
  useEffect(() => {
    if (!data.testimonials.length) return;
    let swiper: any = null;
    waitFor("Swiper").then((S: any) => {
      const el = document.querySelector(".testimonials-swiper");
      if (!el) return;
      swiper = new S(el, {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { clickable: true, el: ".swiper-pagination" },
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
      });
    }).catch(() => {});
    return () => { if (swiper) swiper.destroy(); };
  }, [data.testimonials.length]);

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

      <section className="hero-section relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="hero-gradient-overlay" />
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-[1]" />
        <div className="relative z-[2]">
        <nav
          data-aos="fade-down"
          className={`mb-12 flex items-center justify-between rounded-full px-4 py-3 sm:px-5 transition-all duration-300 ${
            scrolled
              ? "bg-slate-950/80 border border-white/15 shadow-lg backdrop-blur-xl"
              : "glass"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">B</div>
            <span className="font-semibold tracking-tight">{setting(data, "site_title", "BuxSoft")}</span>
          </div>
          <a href="#calculator" className="btn-glow rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-100 sm:text-sm">
            {setting(data, "sticky_cta_text", "Hisob-kitob")}
          </a>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div data-aos="fade-right">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-100">
              <Sparkles size={16} />
              {setting(data, "hero_badge", "Google Sheets CMS")}
            </div>
            <h1 className="max-w-5xl overflow-visible pb-3 text-balance text-[44px] font-bold leading-[1.12] tracking-[-0.035em] text-white drop-shadow-[0_24px_70px_rgba(255,255,255,0.08)] sm:text-6xl lg:text-[76px]">
              <span ref={typedRef} />
              <span className="sr-only">{heroTitle}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-xl">
              {setting(data, "hero_subtitle", "Faoliyat turini tanlang, tarif va xizmatlarni ko‘ring.")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#calculator" className="btn-glow rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
                {setting(data, "cta_text", "Bepul konsultatsiya olish")}
              </a>
              <a href="#tariffs" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/90 transition hover:bg-white/10">
                {setting(data, "secondary_cta_text", "Tariflarni ko‘rish")}
              </a>
            </div>
          </div>

          <div data-aos="fade-left" className="glass relative rounded-[2rem] p-5 shadow-glow sm:p-6">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-indigo-500/40 blur-3xl" />
            <div className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
              <p className="text-sm text-slate-400">Live quote</p>
              <div className="mt-3 text-3xl font-black sm:text-4xl">
                {selectedTariff ? (
                  <>
                    <AnimatedNumber value={total} /> <span className="text-lg text-slate-400">{currency}</span>
                  </>
                ) : (
                  <span>Tarifni tanlang</span>
                )}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {data.stats.slice(0, 4).map((stat) => (
                  <div key={stat.id} className="rounded-2xl bg-white/5 p-4">
                    <StatCounter stat={stat} />
                    <div className="mt-1 text-sm text-slate-400">{stat.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section id="calculator" data-aos="fade-up" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-6 lg:px-8">
        <div data-aos="fade-right">
          <p className="text-sm font-bold uppercase tracking-[.28em] text-cyan-300">CMS calculator</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Faoliyat turini tanlang</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, idx) => (
            <button
              type="button"
              key={category.id}
              onClick={() => chooseCategory(category)}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className={cn(
                "tilt-card glass rounded-3xl p-5 text-left transition duration-200 hover:-translate-y-1 hover:bg-white/10",
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

      <section id="tariffs" data-aos="fade-up" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div data-aos="fade-right">
            <p className="text-sm font-bold uppercase tracking-[.28em] text-violet-300">Dynamic pricing</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Dinamik tariflar</h2>
          </div>

          {selectedCategory ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm text-slate-400">
                Tanlangan: <b className="text-white">{selectedCategory.name}</b>
              </div>
              <button
                type="button"
                onClick={goBackToCategories}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/90 transition hover:bg-white/10"
              >
                ← Orqaga qaytish
              </button>
            </div>
          ) : null}
        </div>

        {!selectedCategory ? (
          <div className="mt-8 glass rounded-[2rem] p-8 text-center">
            <div className="mx-auto max-w-2xl">
              <h3 className="text-2xl font-black text-white">Avval faoliyatingizni tanlang</h3>
              <p className="mt-3 text-slate-300">
                Tariflarni ko‘rish uchun yuqoridagi “Faoliyat turini tanlang” bo‘limidan o‘zingizga mos yo‘nalishni tanlang.
              </p>
              <a
                href="#calculator"
                className="btn-glow mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
              >
                Faoliyatni tanlash
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {categoryTariffs.length ? categoryTariffs.map((tariff, idx) => (
              <button
                type="button"
                key={tariff.id}
                onClick={() => chooseTariff(tariff)}
                data-aos="fade-up"
                data-aos-delay={idx * 120}
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
        )}
      </section>

      <section id="services" data-aos="fade-up" className="relative mx-auto grid max-w-7xl scroll-mt-8 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div data-aos="fade-right" className="glass rounded-[2rem] p-6">
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

        <form data-aos="fade-left" onSubmit={onSubmit} className="glass rounded-[2rem] p-6">
          <h2 className="text-3xl font-black">So‘rov yuborish</h2>
            <div className={`mt-5 rounded-2xl bg-white/5 p-4 ${totalPulse ? "price-pulse" : ""}`} style={{ transition: "transform 0.3s" }}>
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
            disabled={status === "loading" || !selectedCategory || !selectedTariff || (!form.phone && !form.telegram)}
            className="btn-glow mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
            {status === "loading" ? "Yuborilmoqda..." : setting(data, "cta_text", "Yuborish")}
          </button>
          {status === "success" && <div className="mt-4 rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-200">{setting(data, "lead_success_title", "Qabul qilindi")}. {setting(data, "lead_success_text", "Tez orada bog‘lanamiz.")}</div>}
          {status === "error" && <div className="mt-4 rounded-2xl bg-red-400/10 p-4 text-sm text-red-200">Xatolik yuz berdi. Telefon yoki Telegramni tekshirib qayta urinib ko‘ring.</div>}
        </form>
      </section>

      {data.testimonials.length > 0 && (
        <section data-aos="fade-up" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-5xl">Mijozlar fikri</h2>
          <div className="testimonials-swiper swiper mt-8">
            <div className="swiper-wrapper">
              {data.testimonials.map((item) => (
                <div key={item.id} className="swiper-slide">
                  <div className="glass rounded-[2rem] p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 text-amber-300">{Array.from({ length: Math.max(1, Math.min(5, item.rating)) }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
                      <p className="mt-5 text-slate-200">“{item.text}”</p>
                    </div>
                    <div className="mt-5">
                      <b className="block">{item.name}</b>
                      <span className="text-sm text-slate-400">{item.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination" />
          </div>
        </section>
      )}

      {data.faq.length > 0 && (
        <section data-aos="fade-up" className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-5xl">FAQ</h2>
          <div className="mt-6 divide-y divide-white/10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            {data.faq.map((item, idx) => (
              <details key={item.id} data-aos="fade-up" data-aos-delay={idx * 80} className="group p-5">
                <summary className="cursor-pointer font-bold">{item.question}</summary>
                <p className="mt-3 text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <footer data-aos="fade-up" className="relative mx-auto max-w-7xl px-4 py-12 text-sm text-slate-400 sm:px-6 lg:px-8">
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
