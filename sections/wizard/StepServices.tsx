"use client";

import type { CmsData } from "@/types/cms";
import type { WizardFormData } from "@/types/wizard";
import { deriveSelection } from "@/lib/wizard";
import { money, setting } from "@/lib/utils";
import { WizardFooter } from "./WizardFooter";

type Props = {
  data: CmsData;
  form: WizardFormData;
  update: (patch: Partial<WizardFormData>) => void;
  onNext: () => void;
};

export function StepServices({ data, form, update, onNext }: Props) {
  const currency = setting(data, "currency", "so‘m");
  const { services, total } = deriveSelection(data, form);

  function toggleService(id: string) {
    update({
      serviceIds: form.serviceIds.includes(id) ? form.serviceIds.filter((s) => s !== id) : [...form.serviceIds, id],
    });
  }

  return (
    <div>
      <h2 className="text-xl font-black sm:text-2xl">
        Qo‘shimcha xizmatlar <span className="text-sm font-bold text-slate-400">(ixtiyoriy)</span>
      </h2>
      <p className="mt-1 text-xs text-slate-400">Kerakli xizmatlarni belgilang yoki shunchaki davom eting.</p>

      <div className="mt-4 grid gap-2.5">
        {services.map((s) => (
          <label
            key={s.id}
            className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
          >
            <input
              type="checkbox"
              checked={form.serviceIds.includes(s.id)}
              onChange={() => toggleService(s.id)}
              className="h-5 w-5 shrink-0 accent-brand-blue"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold leading-snug">{s.name}</div>
              {s.description && <div className="mt-0.5 truncate text-xs text-slate-400">{s.description}</div>}
            </div>
            <b className="shrink-0 text-sm">{money(s.price, currency)}</b>
          </label>
        ))}
      </div>

      <WizardFooter total={total} currency={currency} onNext={onNext} />
    </div>
  );
}
