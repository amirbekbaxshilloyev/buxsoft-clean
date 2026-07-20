"use client";

import { useI18n, type Lang } from "@/lib/i18n";

/* Til selektori — UZ/RU. Tanlov LangProvider (kontekst) orqali butun saytga
   tarqaladi va localStorage'ga saqlanadi; matnlar darhol almashadi. */
const LANGS: Lang[] = ["uz", "ru"];

export function LangSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label="Til / Язык">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`lang-switch__btn ${lang === l ? "is-active" : ""}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
