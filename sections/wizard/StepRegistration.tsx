"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import type { CmsData } from "@/types/cms";
import type { WizardFormData } from "@/types/wizard";
import { formatPhoneDisplay, getUtmMarker, isPhoneValid, phoneDigitsOnly, toE164, withStepMarker } from "@/lib/wizard";
import { setting } from "@/lib/utils";
import { submitLead } from "@/services/cms";

type Props = {
  data: CmsData;
  form: WizardFormData;
  update: (patch: Partial<WizardFormData>) => void;
  leadStarted: boolean;
  markLeadStarted: () => void;
  onNext: () => void;
};

export function StepRegistration({ data, form, update, leadStarted, markLeadStarted, onNext }: Props) {
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const telegramUrl = setting(data, "telegram_url", "https://t.me/BuxSoftuz");
  const nameValid = form.name.trim().length >= 2;
  const phoneValid = isPhoneValid(form.phoneDigits);

  async function sendPartialLead() {
    const payload = {
      name: form.name.trim(),
      company: "",
      phone: toE164(form.phoneDigits),
      telegram: "",
      industry: "",
      tariff: "",
      services: [],
      total: 0,
      comment: withStepMarker(["[Wizard — boshlandi]", getUtmMarker()].filter(Boolean).join(" "), ""),
    };
    try {
      await submitLead(payload);
    } catch (err) {
      console.error("BuxSoft wizard: 1-qadam lead yozilmadi, qayta urinilmoqda", err);
      try {
        await submitLead(payload);
      } catch (retryErr) {
        console.error("BuxSoft wizard: 1-qadam lead qayta urinishda ham muvaffaqiyatsiz tugadi", retryErr);
      }
    }
  }

  async function handleContinue() {
    setNameTouched(true);
    setPhoneTouched(true);
    if (!nameValid || !phoneValid || submitting) return;

    setSubmitting(true);
    if (!leadStarted) {
      await sendPartialLead();
      markLeadStarted();
    }
    setSubmitting(false);
    onNext();
  }

  return (
    <div>
      <h2 className="text-xl font-black sm:text-2xl">Keling, tanishamiz</h2>
      <p className="mt-1 text-sm text-slate-400">Ism va telefon raqamingizni qoldiring — mutaxassisimiz siz bilan bog‘lanadi.</p>

      <div className="mt-5 space-y-4">
        <div>
          <input
            className="input"
            placeholder="Ismingiz"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            onBlur={() => setNameTouched(true)}
          />
          {nameTouched && !nameValid && (
            <p className="mt-1.5 text-xs text-red-300">Ism kamida 2 ta belgidan iborat bo‘lishi kerak.</p>
          )}
        </div>
        <div>
          <input
            className="input"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="+998 XX XXX XX XX"
            value={form.phoneDigits ? formatPhoneDisplay(form.phoneDigits) : ""}
            onChange={(e) => update({ phoneDigits: phoneDigitsOnly(e.target.value) })}
            onBlur={() => setPhoneTouched(true)}
          />
          {phoneTouched && !phoneValid && (
            <p className="mt-1.5 text-xs text-red-300">To‘liq telefon raqamini kiriting (masalan: 90 123 45 67).</p>
          )}
        </div>
      </div>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-brand-bluelight transition hover:text-white"
      >
        Telegram orqali davom etish →
      </a>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!nameValid || !phoneValid || submitting}
        className="btn-glow mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
        {submitting ? "Yuborilmoqda..." : "Davom etish"}
      </button>
    </div>
  );
}
