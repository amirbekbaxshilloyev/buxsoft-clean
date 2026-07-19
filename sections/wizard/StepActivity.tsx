"use client";

import type { CmsData } from "@/types/cms";
import type { WizardFormData } from "@/types/wizard";
import { buildGroupedCategories } from "@/lib/wizard";
import { cn } from "@/lib/utils";

type Props = {
  data: CmsData;
  form: WizardFormData;
  update: (patch: Partial<WizardFormData>) => void;
  onNext: () => void;
};

export function StepActivity({ data, form, update, onNext }: Props) {
  const grouped = buildGroupedCategories(data.categories);
  const activeGroup = grouped.find((g) => g.group.id === form.groupId);

  function chooseGroup(groupId: string) {
    const entry = grouped.find((g) => g.group.id === groupId);
    if (!entry || !entry.categories.length) return;
    /* Bitta yo'nalishli guruh (YATT) — yo'nalish avtomatik belgilanadi */
    const single = entry.categories.length === 1 ? entry.categories[0].id : "";
    update({ groupId, categoryId: single, tariffId: "", serviceIds: [] });
  }

  function chooseCategory(categoryId: string) {
    update({ categoryId, tariffId: "", serviceIds: [] });
  }

  if (!activeGroup) {
    return (
      <div>
        <h2 className="text-xl font-black sm:text-2xl">Faoliyat turingizni tanlang</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {grouped.map(({ group, categories }) => (
            <button
              type="button"
              key={group.id}
              onClick={() => chooseGroup(group.id)}
              disabled={!categories.length}
              className="glass min-h-[96px] rounded-2xl p-4 text-left transition duration-150 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="text-2xl">{group.emoji}</div>
              <div className="mt-2 text-sm font-black leading-snug">{group.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black sm:text-2xl">
          {activeGroup.group.emoji} {activeGroup.group.name}
        </h2>
        <button
          type="button"
          onClick={() => update({ groupId: "", categoryId: "" })}
          className="shrink-0 text-xs font-bold text-slate-300 underline-offset-2 transition hover:text-white hover:underline"
        >
          O‘zgartirish
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {activeGroup.categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => chooseCategory(category.id)}
            className={cn(
              "glass flex min-h-[64px] items-center gap-3 rounded-2xl px-5 py-4 text-left transition duration-150 hover:bg-white/10",
              form.categoryId === category.id && "border-brand-blue/70 ring-2 ring-brand-blue/70"
            )}
          >
            <span className="text-2xl">{category.emoji}</span>
            <span className="text-lg font-black">{category.name}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!form.categoryId}
        className="btn-glow mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Davom etish
      </button>
    </div>
  );
}
