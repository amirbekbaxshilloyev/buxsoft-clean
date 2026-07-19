"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import type { CmsData } from "@/types/cms";
import type { WizardFormData } from "@/types/wizard";
import { deriveSelection, formatPhoneDisplay, getUtmMarker, TG_DISCOUNT, toE164, withStepMarker } from "@/lib/wizard";
import { money, setting } from "@/lib/utils";
import { submitLead } from "@/services/cms";

type Props = {
  data: CmsData;
  form: WizardFormData;
  update: (patch: Partial<WizardFormData>) => void;
  onCompleted: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="shrink-0 text-slate-400">{label}</span>
      <span className="text-right font-bold text-white">{value}</span>
    </div>
  );
}

export function StepSummary({ data, form, update, onCompleted }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  /* Obuna katagi faqat mijoz kanalga o'tib kelgach ochiladi */
  const [tgVisited, setTgVisited] = useState(false);

  const currency = setting(data, "currency", "so‘m");
  const { category, tariff, selectedServices, total } = deriveSelection(data, form);
  const telegramUrl = setting(data, "telegram_url", "https://t.me/BuxSoftuz");
  const phone = setting(data, "phone", "+998 50 705 06 23");

  const finalTotal = form.tgSubscribed ? Math.round(total * (1 - TG_DISCOUNT)) : total;

  async function handleConfirm() {
    setStatus("loading");
    try {
      const marker = ["[Wizard — tasdiqlandi]", form.tgSubscribed ? "[TG obuna -5%]" : "", getUtmMarker()]
        .filter(Boolean)
        .join(" ");
      await submitLead({
        name: form.name.trim(),
        company: "",
        phone: toE164(form.phoneDigits),
        telegram: "",
        industry: category?.name || "",
        tariff: tariff?.name || "",
        services: selectedServices.map((s) => s.name),
        total: finalTotal,
        comment: withStepMarker(marker, form.comment),
      });
      setStatus("success");
      onCompleted();
    } catch (err) {
      console.error("BuxSoft wizard: yakuniy buyurtma yuborilmadi", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-3xl">✅</div>
        <h2 className="mt-5 text-2xl font-black sm:text-3xl">
          {setting(data, "lead_success_title", "Rahmat! Mutaxassisimiz tez orada bog‘lanadi")}
        </h2>
        <p className="mt-2 text-slate-300">{setting(data, "lead_success_text", "So‘rovingiz qabul qilindi.")}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
          >
            Telegram kanal
          </a>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/90 transition hover:bg-white/10"
          >
            {phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-black sm:text-2xl">Buyurtmani tasdiqlang</h2>

      <div className="mt-4 space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <Row label="Ism" value={form.name} />
        <Row label="Telefon" value={formatPhoneDisplay(form.phoneDigits)} />
        <Row label="Faoliyat" value={category?.name || "-"} />
        <Row label="Tarif" value={tariff?.name || "-"} />
        {selectedServices.length > 0 && (
          <Row label="Xizmatlar" value={selectedServices.map((s) => s.name).join(", ")} />
        )}
        <div className="border-t border-white/10 pt-2.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-400">Jami narx</span>
            <span className="text-right">
              {form.tgSubscribed && (
                <span className="mr-2 text-sm text-slate-500 line-through">{money(total, currency)}</span>
              )}
              <b className="text-lg text-white">{money(finalTotal, currency)}</b>
              {form.tgSubscribed && <span className="ml-1.5 text-xs font-black text-brand-goldlight">-5%</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Telegram obuna — 5% chegirma */}
      <div className="mt-4 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 p-4">
        <p className="text-sm font-bold leading-snug">
          📣 Telegram kanalimizga obuna bo‘lsangiz — <span className="text-brand-goldlight">5% chegirmaga</span> ega bo‘lasiz
        </p>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setTgVisited(true)}
          className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-blue/40 bg-brand-blue/15 px-5 py-2.5 text-sm font-black text-brand-bluelight transition hover:bg-brand-blue/25 hover:text-white"
        >
          Kanalga o‘tish →
        </a>
        {(tgVisited || form.tgSubscribed) && (
          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <input
              type="checkbox"
              checked={form.tgSubscribed}
              onChange={(e) => update({ tgSubscribed: e.target.checked })}
              className="h-5 w-5 shrink-0 accent-brand-blue"
            />
            <span className="text-sm font-bold leading-snug">Obuna bo‘ldim — 5% chegirmani qo‘llash</span>
          </label>
        )}
      </div>

      <textarea
        className="input mt-4 min-h-20"
        placeholder="Izoh (ixtiyoriy)"
        value={form.comment}
        onChange={(e) => update({ comment: e.target.value })}
      />

      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === "loading"}
        className="btn-glow mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
        {status === "loading" ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
      </button>
      {status === "error" && (
        <div className="mt-4 rounded-2xl bg-red-400/10 p-4 text-sm text-red-200">Xatolik yuz berdi. Qayta urinib ko‘ring.</div>
      )}
    </div>
  );
}
