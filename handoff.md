# BuxSoft — Handoff

## Joriy holat (2026-07-20)

Sayt: **buxsoft.uz** — Netlify'da EMAS, alohida serverda (nginx + Next.js, GitHub'dan deploy qilinadi).
Netlify sayti (`incandescent-faloodeh-fa4a72.netlify.app`) ham mavjud, lekin bu asosiy sayt emas — ikkinchi nusxa.

> ⚠️ **Shu sessiyadagi barcha o'zgarishlar hali COMMIT QILINMAGAN** — faqat lokal ish nusxasida.
> `git status`: o'zgargan/yangi fayllar ro'yxati quyida "Commitga tayyor fayllar" bo'limida.

---

## ✅ Shu sessiyada bajarilgan ishlar (dizayn qayta qurish 1–2 bosqich + i18n)

### 1. Palitra logoga moslandi (`app/globals.css`)
Eski Navy/Electric Blue tizimidan **logoning ko'mir-qora + oltin + krem** palitrasiga o'tildi.
- **Light rejim (asosiy):** `--c-bg: #FAF8F4` (krem), sarlavha `#1A1A1A`, matn `#3A3A3A`, oltin urg'u matni `#8A6D24`.
- **Dark rejim:** `--c-bg: #15161E` (ko'mir-navy), sarlavha `#F2EFE9`, matn `#D8D5CF`, oltin `#D9B45C`.
- CTA tugma **Electric Blue `#1E63FF`** saqlandi (foydalanuvchi tanlovi bilan).
- **Arxitektura:** JSX'dagi hardcode Tailwind rang klasslari (`text-white`, `bg-white/5`...) `globals.css`da **bitta token-xaritaga** bog'landi (`.text-white → var(--c-heading)`), token har rejimda o'zgargani uchun natija avtomatik light/dark bo'ladi. JSX'ga tegilmadi.
- **Hero "doim qorong'i" konteyner:** `.hero-section` ichida tokenlar qorong'i qiymatga qayta-belgilandi + `color: var(--c-text)` qo'shildi (rang klassi yo'q matn body rangini meros olmasligi uchun) — hero matni HAR IKKI rejimda ham foto ustida krem/o'qiladigan.
- WCAG AA (4.5:1) barcha juftliklarda tekshirildi (computed styles orqali).

### 2. Logo integratsiyasi
- **Foydalanuvchi 2 ta logo berdi** (chatga rasm): gorizontal wordmark va doiraviy monogram. Ular `public/images/`ga qo'yildi:
  - `IMG_4858.PNG` → **`public/images/logo-mark.png`** (doiraviy "tanga" monogram — oltin halqa + krem yuza + ko'mir "B"; har fonda ishlaydi).
  - `IMG_4857.PNG` → `public/images/logo-wordmark.png` (gorizontal, oq fonli — hozircha header'da ISHLATILMAYDI, chunki qorong'i fon ustida oq quti muammosi).
- **Header logosi:** `components/Logo.tsx` — `logo-mark.png` (doiraviy, `rounded-full`, `scale-[1.04]`) + "BUXSOFT" **adaptiv MATN** wordmark (`currentColor` bilan light/dark/hero fonga moslashadi). Sabab: bitta PNG ikkala fonga (qorong'i hero / krem sahifa) moslasha olmaydi.
- **Favicon:** `app/icon.svg` — dark disk + oltin halqa + krem "B" (Next.js App Router avtomatik favicon sifatida ishlatadi). Apple-touch-icon / og:image uchun haqiqiy PNG kerak — hali qilinmagan.

### 3. Sticky header (`components/SiteHeader.tsx`)
- Nav hero'dan chiqarilib, alohida **fixed sticky header** qilindi (BuxSoftApp ichida render, `position:fixed` — SmoothScroll transform ishlatmagani uchun ishlaydi).
- Tarkib: Logo + `LangSwitcher` + `ThemeToggle` + CTA tugma.
- Holatlar: hero foto ustida **shaffof** (krem matn), scroll'da **qattiq** (`--c-nav` fon + blur, tema rangi). `.site-header:not(.site-header--solid)` da yuza tokenlari och qilib qayta belgilangan (hero ustida ko'rinishi uchun).

### 4. Full-bleed hero + yumshoq o'tish (`sections/BuxSoftApp.tsx`, `globals.css`)
- Hero foto endi **to'liq ekran kengligi** (`max-w-7xl` section'dan olib ichki kontent o'ramiga ko'chirildi).
- Foto pastdan sahifa foniga **4 bosqichli silliq mask** bilan eriydi (`.hero-photo` `mask-image`) — light rejimda hero bilan keyingi bo'lim orasida qattiq chiziq yo'q. Desktop fade 74%dan, mobil/planshet (`≤1023px`) 88%dan boshlanadi (CTA'lar solid dark ustida qoladi). Buffer uchun hero pastki padding oshirildi (`pb-40 sm:pb-56`).

### 5. Ikki tillilik UZ/RU (i18n) — YANGI
**Frontend mexanizmi to'liq tayyor va ishlaydi.** Fayllar:
- **`lib/i18n.tsx`** — `LangProvider` (kontekst, `localStorage['bx-lang']`), `useI18n()` hook: `{ lang, setLang, t, s, L, LList }`.
  - `t(key)` — qat'iy UI matnlari (lug'at ichida, UZ/RU + guruh nomlari `group_*`).
  - `s(data, key, fallback)` — SETTINGS, RU bo'lsa `<key>_ru`.
  - `L(obj, field)` — CMS obyekt maydoni, RU bo'lsa `<field>_ru`.
  - `_ru` bo'sh bo'lsa avtomatik UZ'ga qaytadi (orqaga to'liq mos).
- **`app/layout.tsx`** — `LangProvider` bilan o'ralgan.
- **`components/LangSwitcher.tsx`** — UZ/RU segment, kontekstga ulangan.
- **`sections/BuxSoftApp.tsx` + barcha wizard qadamlari** — `setting()` → `s()`, CMS maydonlari → `L()`, qat'iy matnlar → `t()` ga o'tkazildi. `money(value, currency, lang)` — "Individual"/"Индивидуально".
- **`_ru` konvensiyasi:** o'zbekcha eski ustun/qiymatda qoladi, ruscha `_ru` qo'shimchali ustun (jadval) yoki qator (SETTINGS)da. **Apps Script (`readTable`) umumiy — barcha ustunlarni sarlavha bo'yicha o'qiydi, shuning uchun `_ru` qo'shilsa Apps Script'ni O'ZGARTIRISH/DEPLOY qilish SHART EMAS.**
- Tekshirildi: `tsc --noEmit` toza, til almashsa sayt darhol qayta render bo'ladi.

### 6. Ruscha tarjima to'plami (`BUXSOFT_RU_tarjima.xlsx`)
- Jonli CMS kontenti Apps Script'dan olinib (`no-store`), **hammasi ruschaga tarjima qilindi** va nusxa-joylashga tayyor `.xlsx` yaratildi (loyiha ildizida). 10 tab: YO'RIQNOMA + har CMS varag'i.
- **Foydalanuvchi Sheet'ni to'ldirdi.** Tekshiruv (2026-07-20):
  - ✅ SETTINGS (21 `_ru` qator), CATEGORIES, TARIFFS(badge_ru+description_ru), SERVICES, TESTIMONIALS, FAQ, STATS, PROBLEMS, PROCESS — **to'liq**, saytda RU uchida-uchigacha ishlayapti.
  - ❌ **`TARIFFS.features_ru` bo'sh (0/37)** — tarif xususiyatlari RU rejimida hali o'zbekcha ko'rinadi. Qiymatlar `.xlsx` → TARIFFS tab → `features_ru` ustunida (`|` bilan). Sheet'ga id bo'yicha ko'chirish kerak.
  - Eslatma: fetch orasida Sheet o'zgargan — hozir **37 tarif, 99 xizmat**.

---

## 🚧 KEYINGI ISHLAR — dizayn qayta qurish (brif bo'yicha, 3–7 bosqich)

Foydalanuvchi ketma-ketligi: 1) fon ✅ → 2) shriftlar 🔶 → 3) joylashuv → 4) animatsiyalar → 5) video/rasmlar → 6) yakun. **Har bosqich tasdiqsiz o'tkazilmaydi.**

- **3-bosqich — Shriftlar (QISMAN BAJARILDI):**
  - ✅ **Shrift yuklash TUZATILDI.** `app/layout.tsx`da `next/font/google` orqali **Manrope** (sarlavha, 600/700/800) + **Inter** (matn, 400/500/600/700), `subsets: ["latin","cyrillic"]`, `display:swap`. Self-hosted (`/_next/static/media`), CSS o'zgaruvchilari `--font-heading` / `--font-body`, `<html>`ga variable klasslar ulandi.
  - ✅ `globals.css`: `body` → `var(--font-body)`, `h1..h6` → `var(--font-heading)` + `letter-spacing:-0.02em` + `text-wrap:balance`, `-webkit-font-smoothing:antialiased`. `.tabular/.stat-num/.price-num` → `tabular-nums`.
  - ✅ Preview'da tasdiqlandi: `document.fonts` — Manrope 700/800, Inter 400/500/700 **loaded**; h1 computed `font-family: Manrope`, body `Inter`.
  - ⏳ **QOLDI (tasdiq kutilyapti):** fluid tipografiya shkalasi (`clamp()` tokenlari) va barcha bo'limlarning sarlavha/matn o'lchamlarini shu shkalaga o'tkazish. Bu JSX'dagi `text-[44px]`, `sm:text-6xl` kabi hardcode o'lchamlarga tegadi — invaziv, shu sabab alohida tasdiqdan keyin.
- **4-bosqich — Joylashuv:** buxgalter.com.uz patterniga tayanib section ritmi, hero ierarxiyasi, wizard markaziy aktsent.
- **5-bosqich — Animatsiyalar:** mavjud GSAP, yengil fade+siljish, hover mikro-effektlar, mobilda soddalashtirilgan, CLS yo'q, `prefers-reduced-motion`.
- **6-bosqich — Rasm/video:** `next/image` placeholder ("Qanday ishlaymiz?", testimonials).
- **7-bosqich — Yakun:** Lighthouse (Perf 90+, CLS<0.1, LCP<2.5s mobil), `npm run build`, mantiqiy commitlar, handoff yangilash.

---

### 7. KRITIK BUG TUZATILDI — CMS ustun sarlavhalari `" (UZ)"` (2026-07-20)
**Simptom:** UZ rejimida process/problems/faq/stats kartalari BO'SH ko'rindi ("Qanday ishlaymiz?" ostidagi 3 oq karta bo'm-bo'sh), tariff badge/description/features ham.
**Sabab:** RU tarjima varag'ini to'ldirishda o'zbekcha ustun sarlavhalariga `" (UZ)"` qo'shilib qolgan (`title (UZ)`, `pain (UZ)`, `name (UZ)`, `features (UZ)`, `question (UZ)`, `answer (UZ)`, `description (UZ)`, `badge (UZ)`). Kod esa maydonlarni suffikssiz o'qiydi (`L(obj,"title")`), shuning uchun UZ bo'sh (RU ishlagan, chunki `_ru` toza qolgan).
**Yechim (kod, Sheet'ga tegilmadi):** `services/cms.ts` — `stripUzSuffix()` + `normalizeRows()` qo'shildi; `normalizeCmsData` har jadval qatoridan `"field (UZ)"` → `"field"` ga normallashtiradi (case-insensitive `/\s*\(\s*uz\s*\)\s*$/i`). Toza maydon mavjud bo'lsa ustidan yozilmaydi. Sheet sarlavhalari qanday bo'lishidan qat'i nazar ishlaydi. Preview'da UZ+RU, light+dark tasdiqlandi, `tsc` toza.

### 8. Rang tuzatishi — `text-white/15` xaritalandi (`globals.css`)
Process raqamlari (`01/02/03`, klass `text-white/15`) token-xaritada yo'q edi → yorug' kartada oq-ustiga-oq, ko'rinmas. `.text-white\/5..\/20` → dark'da `rgba(242,239,233,.16)` (nozik krem), light'da `rgba(201,165,75,.38)` (nozik oltin suv belgisi). To'liq WCAG sweep o'tkazildi — qolgan "fail"lar soxta-musbat (gradient CTA tugmalari = oq matn ko'k ustida; foto-fonli header). Overlap tekshiruvi (desktop/tablet/mobil) — listlar/gridlar toza, gorizontal overflow yo'q.

### 9. PERFORMANS — "sekin/qotib qolish" tuzatildi (2026-07-20)
**Simptom:** sayt sekin ishlagan, scroll'da qotib qolgan. Skrinshot vositasi ham shu sabab timeout beradi.
**O'lchov (`preview_eval`):** uskuna aybdor emas (8 yadro, DPR 1, atigi 279 DOM). Aybdor — vizual effektlar yuki:
- `grain-wrap`: `grain-drift 0.26s` CHEKSIZ + SVG `filter:url(#bx-grain)` (feTurbulence) → butun ekran sekundiga ~4 marta qayta chizilardi.
- **17 ta** element `backdrop-filter: blur(14–24px)` (glass kartalar) → Lenis smooth-scroll bilan har kadrda hammasi qayta blur.
- `hero-gradient-overlay`: animated `background-position` + `mix-blend-mode:screen` (opacity 0.05 da ko'rinmasdi ham).
**Yechim (`globals.css`):**
- Grain → **STATIK** (animatsiya olib tashlandi; ko'rinish deyarli bir xil).
- `.glass`/`.glass-liquid` dan `backdrop-filter` **olib tashlandi**; o'rniga opaque `--c-card` asos (dark `#1D1F29`, light `#FFFFFF`). Yorug'da ko'rinishga ta'sir yo'q (allaqachon opaque oq); qorong'ida kartalar endi `#1D1F29` opaque, krem matn o'qiladi. Faqat **header**da backdrop-blur qoldi (1 ta element).
- `btn-glow` backdrop-filter olib tashlandi (foni ko'k gradient — blur ko'rinmasdi).
- `hero-gradient-overlay` animatsiyasi statik qilindi.
**Natija:** `backdrop-filter` 17→1, cheksiz full-screen animatsiyalar yo'q. `PerformanceObserver`: **longTasks=0** (main-thread bloklanmaydi). *Eslatma: headless preview RAF'ni sekinlashtiradi, shuning uchun bu muhitdagi FPS raqami haqiqiy qurilmani aks ettirmaydi — ishonchli signal long-task yo'qligi.* `hero-kenburns` (24s transform-only, GPU) va bloblar (composited) qoldirildi — arzon.

## Ochiq qolgan ishlar (kelishilgan, hali qilinmagan)
1. **`TARIFFS.features_ru` to'ldirish** (Sheet) — yuqorida.
2. **Til: yangi kontent qo'shilsa `_ru`ni ham to'ldirish** (foydalanuvchi zimmasida).
3. **Favicon to'plami** — apple-touch-icon.png, og:image (haqiqiy PNG kerak).
4. **Telegram obunani haqiqiy tekshirish** — hozir mijoz o'zi belgilaydi (ishonch asosida).
5. **Dizayn qayta qurish 3–7 bosqichlari** — yuqorida.
6. **Barcha lokal o'zgarishlarni commit qilish.**

---

## Muhim eslatmalar / tuzoqlar
- **Apps Script deployment muammosi (avvalgi sessiyadan):** hisobda bir nechta Apps Script loyihasi bor. Agar CMS eski kontent ko'rsatsa — Sheets → Extensions → Apps Script → Manage deployments'da qaysi versiya ulanganini tekshiring va kerak bo'lsa "New version" bilan qayta joylang (URL saqlanadi). `.env.local`dagi `NEXT_PUBLIC_APPS_SCRIPT_URL` — lokal dev uchun.
- **`_ru` uchun Apps Script'ni tegish shart emas** — generik `readTable` yangi ustunlarni avtomatik oladi.
- **Screenshot vositasi bu muhitda timeout beradi** (sahifadagi cheksiz animatsiyalar + tsParticles). Tekshiruvni `preview_eval` (computed styles / geometriya) va `preview_snapshot` orqali qiling.
- **Til tekshiruvi:** `preview_click` hidratsiya tugashidan oldin ishlamasligi mumkin — reload'dan keyin biroz kuting yoki JS `.click()` ishlating.
- **`money()` endi `lang` parametri oladi** (`lib/utils.ts`).

## Commitga tayyor fayllar (uncommitted)
O'zgargan: `app/globals.css`, `app/layout.tsx`, `lib/utils.ts`, `sections/BuxSoftApp.tsx`, barcha `sections/wizard/*.tsx`.
Yangi: `app/icon.svg`, `components/{Logo,SiteHeader,LangSwitcher}.tsx`, `lib/i18n.tsx`, `public/images/{logo-mark.png,logo-wordmark.png,IMG_4857.PNG,IMG_4858.PNG,hero-bg.jpg}`.
Repo'ga kiritmaslik mumkin: `BUXSOFT_RU_tarjima.xlsx` (tarjima yordamchisi, import qilingach o'chirish mumkin).

## Muhim fayllar xaritasi
- `lib/i18n.tsx` — **i18n (til) tizimi: provider, useI18n, loc/settingL/tr**
- `lib/wizard.ts` — wizard konfiguratsiyasi, guruh xaritasi (`CATEGORY_GROUPS`), telefon/localStorage/UTM helperlari
- `lib/utils.ts` — `cn`, `setting`, `money(v,cur,lang)`, `sortBySort`
- `types/cms.ts`, `types/wizard.ts` — tip ta'riflari (`_ru` maydonlar dinamik o'qiladi, tipda e'lon qilinmagan)
- `services/cms.ts` — Apps Script bilan aloqa, normalize, fallback kontent
- `apps-script/Code.gs` — Google Apps Script backend (haqiqiysi muharrirda alohida, qo'lda sinxronlanadi)
- `sections/BuxSoftApp.tsx` — asosiy sahifa (hero, muammolar, jarayon, wizard, testimonials, FAQ, footer)
- `sections/wizard/*` — wizard komponentlari (hammasi i18n'ga ulangan)
- `components/SiteHeader.tsx` / `Logo.tsx` / `LangSwitcher.tsx` / `ThemeToggle.tsx` — header
- `app/globals.css` — dizayn tokenlari, ranglar, animatsiyalar, header/lang stillari
- `app/icon.svg` — favicon
- `public/images/` — hero-bg.jpg, logo-mark.png, logo-wordmark.png
- `BUXSOFT_RU_tarjima.xlsx` — RU tarjima to'plami (Sheet'ni to'ldirish uchun)
