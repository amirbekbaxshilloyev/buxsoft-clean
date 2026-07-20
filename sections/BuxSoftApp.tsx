"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShieldCheck, Sparkles, Star } from "lucide-react";
import type { CmsData, Stat } from "@/types/cms";
import { Wizard } from "@/sections/wizard/Wizard";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

declare global {
  interface Window {
    tsParticles?: { load: (id: string, opts: object) => void };
    Swiper?: new (el: Element, opts: object) => { destroy: () => void };
  }
}

/* ── Stat counter: raqam yuqoridan tushib, gold chiziq chiqadi ── */
function StatCounter({ stat }: { stat: Stat }) {
  const target  = parseFloat(String(stat.value).replace(/[^\d.-]/g, "")) || 0;
  const [count,   setCount]   = useState(0);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);
  const ref  = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setCount(target); setVisible(true); setSettled(true);
      return;
    }
    const el = ref.current;
    if (!el || done.current) return;

    function settle() {
      if (done.current) return;
      done.current = true;
      obs.disconnect();
      setCount(target);
      setVisible(true);
      setSettled(true);
    }

    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      done.current = true;
      obs.disconnect();
      setVisible(true);

      const dur = target > 100000 ? 900 : target > 1000 ? 650 : 450;
      const t0  = performance.now();
      function tick(now: number) {
        const p = Math.min((now - t0) / dur, 1);
        setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
        else setSettled(true);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.15 });

    obs.observe(el);
    /* IntersectionObserver ishlamasa yoki elementga hech qachon scroll qilinmasa
       ham raqamlar "0+" bo'lib qolmasligi uchun zaxira taymer. */
    const fallback = setTimeout(settle, 2000);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, [target]);

  return (
    <div ref={ref} className="relative pb-1">
      <div className={cn("text-2xl font-black stat-num", visible && "stat-num--visible")}>
        {new Intl.NumberFormat("uz-UZ").format(count)}{stat.suffix || ""}
      </div>
      <div className={cn("stat-gold-line", settled && "stat-gold-line--settled")} />
    </div>
  );
}

/* ══════════════════ MAIN ══════════════════ */
export function BuxSoftApp({ data }: { data: CmsData }) {
  const [scrolled, setScrolled] = useState(false);
  const [openProblem, setOpenProblem] = useState<number | null>(null);
  const { t, s, L } = useI18n();

  const heroTitle    = s(data, "hero_title", "Soliq tekshiruvlariga oldindan tayyorlaymiz");
  const typedRef     = useRef<HTMLSpanElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  /* navbar + scroll-progress (fon gradienti scroll bilan jonlanadi) */
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 60);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty(
        "--bx-scroll",
        String(max > 0 ? Math.min(window.scrollY / max, 1) : 0)
      );
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* hero title: oddiy fade-up */
  useEffect(() => {
    const el = typedRef.current;
    if (!el) return;
    el.textContent = heroTitle;

    (async () => {
      const { gsap } = await import("gsap");
      gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" });
    })();
  }, [heroTitle]);

  /* GSAP scroll reveals */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;
    (async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const dir   = el.dataset.reveal || "up";
          const delay = Number(el.dataset.revealDelay || 0) / 1000;
          const from  = dir === "down"  ? { y: -18 } :
                        dir === "left"  ? { x: -18 } :
                        dir === "right" ? { x:  18 } : { y: 18 };
          gsap.fromTo(el,
            { autoAlpha: 0, ...from },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.42, delay, ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true } }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          gsap.fromTo(group.querySelectorAll("[data-reveal-child]"),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.38, ease: "expo.out", stagger: 0.06,
              scrollTrigger: { trigger: group, start: "top 90%", once: true } }
          );
        });
      });
    })();
    return () => ctx?.revert();
  }, []);

  /* tsParticles */
  useEffect(() => {
    let cancel = false;
    function tryLoad() {
      if (cancel || !particlesRef.current) return;
      /* Faqat desktopda — mobilda ortiqcha animatsiyalarni kamaytirish uchun */
      if (window.innerWidth < 768) return;
      if (!window.tsParticles) { setTimeout(tryLoad, 200); return; }
      particlesRef.current.id = "tsparticles-hero";
      window.tsParticles.load("tsparticles-hero", {
        particles: {
          number: { value: 18, density: { enable: true } },
          color:  { value: ["#ffffff", "#5B8CFF", "#C9A54B"] },
          opacity: { value: 0.12, random: true },
          size:   { value: { min: 1, max: 3 }, random: true },
          move:   { enable: true, speed: 0.4, direction: "none", random: true, outModes: "bounce" },
          links:  { enable: false },
        },
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
        detectRetina: false,
        fpsLimit: 25,
      });
    }
    tryLoad();
    return () => { cancel = true; };
  }, []);

  /* Swiper */
  useEffect(() => {
    if (!data.testimonials.length) return;
    let swiper: { destroy: () => void } | null = null;
    function trySwiper() {
      if (!window.Swiper) { setTimeout(trySwiper, 200); return; }
      const el = document.querySelector(".testimonials-swiper");
      if (!el) return;
      swiper = new window.Swiper!(el, {
        loop: true,
        autoplay: { delay: 3200, disableOnInteraction: false },
        pagination: { clickable: true, el: ".swiper-pagination" },
        slidesPerView: 1, spaceBetween: 20,
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
      });
    }
    trySwiper();
    return () => { swiper?.destroy(); };
  }, [data.testimonials.length]);

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <main id="top" className="bg-premium min-h-screen overflow-hidden">
      <SiteHeader scrolled={scrolled} ctaText={s(data, "sticky_cta_text", "Hisob-kitob")} />
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-70" />

      {/* HERO */}
      <section className="hero-section relative overflow-hidden pb-40 sm:pb-56">
        <div className="hero-photo pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-photo-img object-cover"
          />
          <div className="hero-photo-scrim absolute inset-0" />
        </div>
        <div className="hero-gradient-overlay" />
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-[1]" />

        <div className="relative z-[2] mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div data-reveal="up" className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-white/5 px-4 py-2 text-sm text-brand-goldlight">
                <Sparkles size={16} />
                {s(data, "hero_badge", "Google Sheets CMS")}
              </div>
              <h1 className="max-w-5xl overflow-visible pb-3 text-balance text-[44px] font-bold leading-[1.12] tracking-[-0.035em] text-white sm:text-6xl lg:text-[76px]">
                <span ref={typedRef} />
                <span className="sr-only">{heroTitle}</span>
              </h1>
              <p data-reveal="up" data-reveal-delay="100" className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-xl">
                {s(data, "hero_subtitle", "Faoliyat turini tanlang, tarif va xizmatlarni ko'ring.")}
              </p>
              <div data-reveal="up" data-reveal-delay="180" className="mt-8 flex flex-wrap gap-3">
                <a href="#wizard" className="btn-glow rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
                  {s(data, "cta_text", "Bepul konsultatsiya olish")}
                </a>
                <a href="#wizard" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/90 transition hover:bg-white/10">
                  {s(data, "secondary_cta_text", "Tariflarni ko'rish")}
                </a>
              </div>
            </div>

            <div data-reveal="left" data-reveal-delay="80" className="glass relative rounded-[2rem] p-5 shadow-glow sm:p-6">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-indigo-500/40 blur-3xl" />
              <div className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
                <p className="text-sm text-slate-400">{t("hero_stats_label")}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {data.stats.slice(0, 4).map((stat) => (
                    <div key={stat.id} className="rounded-2xl bg-white/5 p-4">
                      <StatCounter stat={stat} />
                      <div className="mt-1 text-sm text-slate-400">{L(stat, "title")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MUAMMO → YECHIM */}
      <section id="problems" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div data-reveal="up">
          <p className="text-sm font-bold uppercase tracking-[.28em] text-brand-goldlight">{s(data, "problems_badge", "Muammo → yechim")}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{s(data, "problems_title", "Tanish muammolarmi?")}</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            {s(data, "problems_subtitle", "Har kuni tadbirkorlardan eshitadigan og‘riqlar — birini oching, yechimini ko‘ring.")}
          </p>
        </div>
        <div
          data-reveal-group
          className={cn(
            "mt-8 grid items-start gap-4",
            data.problems.length === 4 ? "sm:grid-cols-2 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {data.problems.map((p, i) => {
            const open = openProblem === i;
            return (
              <div
                key={p.id}
                data-reveal-child
                className={cn(
                  "glass-liquid relative flex min-h-[220px] flex-col overflow-hidden rounded-[2rem] p-8 pl-9 transition-transform duration-300",
                  open
                    ? "border-emerald-400/50 ring-1 ring-emerald-400/40"
                    : "prob-card"
                )}
              >
                {/* chap chiziq — yopiqda qizil (og'riq), ochiqda yashil (yechim) */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-7 left-0 w-1.5 rounded-r-full bg-gradient-to-b transition-colors",
                    open ? "from-emerald-400 via-emerald-400/70 to-emerald-400/10" : "from-rose-500 via-rose-500/70 to-rose-500/10"
                  )}
                />
                <h3 className="prob-pain relative flex-1 text-2xl font-black leading-snug sm:text-[28px]">
                  {L(p, "pain")}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenProblem(open ? null : i)}
                  className={cn(
                    "mt-6 inline-flex min-h-[48px] w-fit items-center gap-1.5 rounded-full border px-5 py-2.5 text-base font-bold transition",
                    open
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                      : "border-brand-blue/40 bg-brand-blue/10 text-brand-bluelight hover:bg-brand-blue/20 hover:text-white"
                  )}
                >
                  {open ? t("solution_close") : t("solution_see")}
                </button>
                {open && (
                  <div className="wizard-step-enter mt-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" strokeWidth={2} />
                      <p className="text-sm leading-6 text-emerald-50">{L(p, "solution")}</p>
                    </div>
                    <a
                      href="#wizard"
                      className="btn-glow ml-8 mt-3 inline-flex min-h-[40px] items-center rounded-full px-4 py-2 text-xs font-black"
                    >
                      {t("calc_price")}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* QANDAY ISHLAYMIZ + KAFOLAT */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div data-reveal="up">
          <p className="text-sm font-bold uppercase tracking-[.28em] text-brand-goldlight">{s(data, "process_badge", "3 qadam")}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{s(data, "process_title", "Qanday ishlaymiz?")}</h2>
        </div>
        <div data-reveal-group className="mt-8 grid gap-4 sm:grid-cols-3">
          {data.process.map((step, i) => (
            <div key={step.id} data-reveal-child className="glass rounded-3xl p-6">
              <div className="text-4xl font-black text-white/15">0{i + 1}</div>
              <h3 className="mt-3 text-lg font-black">{L(step, "title")}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{L(step, "text")}</p>
            </div>
          ))}
        </div>

        <div
          data-reveal="up"
          className="glass mt-8 flex flex-col items-start justify-between gap-5 rounded-[2rem] border-emerald-300/30 p-6 sm:flex-row sm:items-center sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">🛡️</div>
            <div>
              <h3 className="text-xl font-black sm:text-2xl">
                {s(data, "guarantee_title", "Bizning aybimiz bilan jarima chiqsa — zararni o‘zimiz qoplaymiz")}
              </h3>
              <p className="mt-2 text-slate-300">{s(data, "guarantee_text", "Bu og‘zaki va’da emas — shartnomada yozib beriladi.")}</p>
            </div>
          </div>
          <a
            href="#wizard"
            className="btn-glow shrink-0 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
          >
            {s(data, "guarantee_cta", "Bepul konsultatsiya")}
          </a>
        </div>
      </section>

      {/* WIZARD */}
      <section id="wizard" className="relative mx-auto max-w-4xl scroll-mt-8 px-4 py-12 sm:px-6 lg:px-8">
        <div data-reveal="up" className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[.28em] text-brand-goldlight">{s(data, "wizard_badge", "Bir daqiqada")}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{s(data, "wizard_title", "Bepul konsultatsiya oling")}</h2>
        </div>
        <Wizard data={data} />
      </section>

      {/* TESTIMONIALS */}
      {data.testimonials.length > 0 && (
        <section data-reveal="up" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-5xl">{t("testimonials_title")}</h2>
          <div className="testimonials-swiper swiper mt-8">
            <div className="swiper-wrapper">
              {data.testimonials.map((item) => (
                <div key={item.id} className="swiper-slide">
                  <div className="glass rounded-[2rem] p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 text-amber-300">
                        {Array.from({ length: Math.max(1, Math.min(5, item.rating)) }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                      </div>
                      <p className="mt-5 text-slate-200">"{L(item, "text")}"</p>
                    </div>
                    <div className="mt-5">
                      <b className="block">{item.name}</b>
                      <span className="text-sm text-slate-400">{L(item, "company")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination" />
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq.length > 0 && (
        <section data-reveal="up" className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-5xl">{t("faq_title")}</h2>
          <div data-reveal-group className="mt-6 divide-y divide-white/10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            {data.faq.map((item) => (
              <details key={item.id} data-reveal-child className="group p-5">
                <summary className="cursor-pointer font-bold">{L(item, "question")}</summary>
                <p className="mt-3 text-slate-300">{L(item, "answer")}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer data-reveal="up" className="relative mx-auto max-w-7xl px-4 py-12 text-sm text-slate-400 sm:px-6 lg:px-8">
        <div className="glass rounded-[2rem] p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <b className="text-white">{s(data, "site_title", "BuxSoft")}</b>
              <p className="mt-2 max-w-xl">{s(data, "footer_text", "Buxgalteriya xizmatlari")}</p>
            </div>
            <div className="space-y-1">
              <div>{s(data, "phone", "+998 90 000 00 00")}</div>
              <div>{s(data, "email", "hello@buxsoft.uz")}</div>
              <div>{s(data, "address", "Toshkent")}</div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
