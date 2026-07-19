"use client";

import { Check } from "lucide-react";
import type { CmsData } from "@/types/cms";
import type { WizardFormData } from "@/types/wizard";
import { deriveSelection } from "@/lib/wizard";
import { cn, money, setting } from "@/lib/utils";
import { WizardFooter } from "./WizardFooter";

type Props = {
  data: CmsData;
  form: WizardFormData;
  update: (patch: Partial<WizardFormData>) => void;
  onNext: () => void;
};

export function StepTariff({ data, form, update, onNext }: Props) {
  const currency = setting(data, "currency", "so‘m");
  const { category, tariffs, tariff, total } = deriveSelection(data, form);

  return (
    <div>
      <h2 className="text-xl font-black sm:text-2xl">{category?.name}: tarifni tanlang</h2>

      <div className="mt-4 grid gap-3">
        {tariffs.length ? (
          tariffs.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => update({ tariffId: t.id, serviceIds: [] })}
              className={cn(
                "glass rounded-2xl p-4 text-left transition duration-150 hover:bg-white/10",
                form.tariffId === t.id && "border-brand-blue/70 ring-2 ring-brand-blue/70"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="text-base">{t.name}</b>
                    {t.badge && (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-950">{t.badge}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{t.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-base font-black">{money(t.price, currency)}</div>
                  {t.old_price ? <div className="text-xs text-slate-500 line-through">{money(t.old_price, currency)}</div> : null}
                </div>
              </div>
              {form.tariffId === t.id && t.features.length > 0 && (
                <ul className="mt-3 grid gap-1.5 border-t border-white/10 pt-3 sm:grid-cols-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-1.5 text-xs text-slate-200">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-goldlight" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </button>
          ))
        ) : (
          <div className="glass rounded-2xl p-5 text-sm text-slate-300">Bu faoliyat turi uchun tariflar hali kiritilmagan.</div>
        )}
      </div>

      <WizardFooter total={total} currency={currency} disabled={!tariff} onNext={onNext} />
    </div>
  );
}
