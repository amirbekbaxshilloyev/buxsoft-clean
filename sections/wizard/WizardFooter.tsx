"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useI18n } from "@/lib/i18n";

type Props = {
  total: number;
  currency: string;
  disabled?: boolean;
  onNext: () => void;
  label?: string;
};

export function WizardFooter({ total, currency, disabled, onNext, label }: Props) {
  const { t } = useI18n();
  return (
    <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3 pl-4">
      <div className="min-w-0">
        <span className="text-xs text-slate-400">{t("total")}</span>
        <div className="truncate text-lg font-black leading-tight">
          <AnimatedNumber value={total} /> <span className="text-xs font-bold text-slate-400">{currency}{t("per_month")}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="btn-glow inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {label ?? t("continue")}
      </button>
    </div>
  );
}
