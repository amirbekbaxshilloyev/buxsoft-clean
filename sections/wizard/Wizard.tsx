"use client";

import { useEffect, useRef, useState } from "react";
import type { CmsData } from "@/types/cms";
import type { WizardFormData, WizardStep } from "@/types/wizard";
import { captureUtm, clearWizardState, deriveSelection, loadWizardState, saveWizardState } from "@/lib/wizard";
import { StepRegistration } from "./StepRegistration";
import { StepActivity } from "./StepActivity";
import { StepTariff } from "./StepTariff";
import { StepServices } from "./StepServices";
import { StepSummary } from "./StepSummary";

const EMPTY_FORM: WizardFormData = {
  name: "",
  phoneDigits: "",
  groupId: "",
  categoryId: "",
  tariffId: "",
  serviceIds: [],
  comment: "",
  tgSubscribed: false,
};

const STEP_LABELS: Record<WizardStep, string> = {
  1: "Kontakt",
  2: "Faoliyat",
  3: "Tarif",
  4: "Xizmatlar",
  5: "Tasdiqlash",
};

export function Wizard({ data }: { data: CmsData }) {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<WizardFormData>(EMPTY_FORM);
  const [leadStarted, setLeadStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const hydrated = useRef(false);

  /* Tanlangan tarifda qo'shimcha xizmat bo'lmasa, 4-bosqich o'tkazib yuboriladi */
  const hasServices = deriveSelection(data, form).services.length > 0;

  useEffect(() => {
    captureUtm();
    const saved = loadWizardState();
    if (saved) {
      const step = Math.min(Math.max(1, Number(saved.step) || 1), 5) as WizardStep;
      setStep(step);
      setForm({ ...EMPTY_FORM, ...saved.form });
      setLeadStarted(Boolean(saved.leadStarted));
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current || completed) return;
    saveWizardState({ step, form, leadStarted });
  }, [step, form, leadStarted, completed]);

  function update(patch: Partial<WizardFormData>) {
    setForm((cur) => ({ ...cur, ...patch }));
  }

  function goNext() {
    setStep((cur) => {
      if (cur === 3 && !hasServices) return 5;
      return cur < 5 ? ((cur + 1) as WizardStep) : cur;
    });
  }

  function goBack() {
    setStep((cur) => {
      if (cur === 5 && !hasServices) return 3;
      return cur > 1 ? ((cur - 1) as WizardStep) : cur;
    });
  }

  function handleCompleted() {
    setCompleted(true);
    clearWizardState();
  }

  return (
    <div className="glass rounded-[2rem] p-5 sm:p-7">
      {!completed && (
        <div className="mb-6">
          <div className="flex min-h-[44px] items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {step}/5 — {STEP_LABELS[step]}
            </span>
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-black text-white transition hover:bg-white/15"
              >
                ← Orqaga
              </button>
            )}
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-gold transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div key={step} className="wizard-step-enter">
        {step === 1 && (
          <StepRegistration
            data={data}
            form={form}
            update={update}
            leadStarted={leadStarted}
            markLeadStarted={() => setLeadStarted(true)}
            onNext={goNext}
          />
        )}
        {step === 2 && <StepActivity data={data} form={form} update={update} onNext={goNext} />}
        {step === 3 && <StepTariff data={data} form={form} update={update} onNext={goNext} />}
        {step === 4 && <StepServices data={data} form={form} update={update} onNext={goNext} />}
        {step === 5 && <StepSummary data={data} form={form} update={update} onCompleted={handleCompleted} />}
      </div>
    </div>
  );
}
