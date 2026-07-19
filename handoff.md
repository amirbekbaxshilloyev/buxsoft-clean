# BuxSoft — Handoff

## Joriy holat (2026-07-19)

Sayt: **buxsoft.uz** — Netlify'da EMAS, alohida serverda (nginx + Next.js, GitHub'dan deploy qilinadi).
Netlify sayti (`incandescent-faloodeh-fa4a72.netlify.app`) ham mavjud, lekin bu asosiy sayt emas — ikkinchi nusxa.

## ⚠️ HAL QILINMAGAN — ustuvor vazifa

**Muammo:** buxsoft.uz'dagi "Tanish muammolarmi?" bo'limi Google Sheets'dagi PROBLEMS/PROCESS varag'ini o'qimayapti, kod ichidagi zaxira (fallback) 6 ta muammoni ko'rsatib turibdi.

**Sabab:** Sayt hisobdagi **eski Apps Script deploymentga** ulangan (`AKfycbw2fNjx...`), u yangilanmagan/eski kod ishlatadi. To'g'ri ishlaydigan yangi deployment topildi: **`AKfycbyAGf7hO9ZQ4vDTqy4lielR120E3jZe27o6zowkk3yzEnFoJ6GlS88Ag5avBwM1hjqDKw`** — bu tekshirildi, PROBLEMS/PROCESS to'g'ri qaytaryapti (4 muammo, 3 qadam).

**Kerakli harakat:** buxsoft.uz joylashgan **serverga** kirib, `.env` / `.env.local` faylidagi `NEXT_PUBLIC_APPS_SCRIPT_URL` ni yangi URL bilan almashtirish, so'ng serverda qayta build + restart qilish kerak:

```
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbyAGf7hO9ZQ4vDTqy4lielR120E3jZe27o6zowkk3yzEnFoJ6GlS88Ag5avBwM1hjqDKw/exec
```

```bash
npm run build
pm2 restart <app-nomi>   # yoki serverda ishlatilayotgan process manager
```

Bu qadam **serverga SSH kirish huquqi kerak bo'lgani uchun** Claude tomonidan bajarilmagan — foydalanuvchi o'zi yoki serverni boshqaruvchi kishi bajarishi kerak.

`.env.local` (lokal loyihada) allaqachon yangi URL bilan yangilangan — bu faqat lokal dev muhiti uchun, serverga ta'sir qilmaydi (`.gitignore`da).

### Muhim ogohlantirish
Hisobda **5 ta Apps Script loyihasi** bor edi (turli URL'lar bilan). Agar kelajakda яна shunga o'xshash muammo chiqsa — birinchi navbatda **qaysi loyiha saytga ulanganini** aniqlash kerak (URL'ning `AKfycb...` qismini solishtirib).

---

## Bajarilgan ishlar

### 1. Kalkulyator → 5 qadamli Wizard
`sections/wizard/` papkasida:
- `Wizard.tsx` — orkestrator, progress, localStorage (`buxsoft_wizard_state`) orqali holat saqlash/tiklash
- `StepRegistration.tsx` — ism+telefon, darhol qisman lead yozish (1 marta retry)
- `StepActivity.tsx` — 12 faoliyat 4 guruhga ixchamlangan (`lib/wizard.ts` dagi `CATEGORY_GROUPS`)
- `StepTariff.tsx` — tarif tanlash
- `StepServices.tsx` — qo'shimcha xizmatlar (ixtiyoriy)
- `StepSummary.tsx` — xulosa, Telegram obuna 5% chegirma, yakuniy submit

Telefon mask/validatsiya, guruh xaritasi, localStorage helperlari: `lib/wizard.ts`.

### 2. Konvertsiya bo'limlari (endi Sheets orqali boshqariladi)
- **"Tanish muammolarmi?"** — muammo/yechim kartalari, `PROBLEMS` sheet
- **"Qanday ishlaymiz?"** — 3 qadam, `PROCESS` sheet
- **Kafolat banneri** — SETTINGS orqali (`guarantee_title`, `guarantee_text`, `guarantee_cta`)

CMS integratsiyasi: `services/cms.ts` (`DEFAULT_PROBLEMS`/`DEFAULT_PROCESS` — sheet bo'sh bo'lsa zaxira), `types/cms.ts` (`Problem`, `ProcessStep` tiplari), `apps-script/Code.gs` (`readTableSafe` — sheet yo'q bo'lsa xato bermaydi).

### 3. Brend dizayni
Palitra: Navy `#0B1F4D` / Electric Blue `#1E63FF` / Oltin `#C9A54B` (`tailwind.config.ts` → `brand.*`, `app/globals.css` CSS o'zgaruvchilari). Scroll-reaktiv gradient fon (`--bx-scroll`), liquid-glass tugmalar (`.btn-glow`).

### 4. Performance
Preloader olib tashlandi, mobilda grain/golden-thread/blob effektlari o'chirilgan (`app/globals.css` — `@media (max-width:767px)`), tsParticles faqat desktopda.

### 5. UTM kuzatuvi
`lib/wizard.ts` → `captureUtm()`/`getUtmMarker()` — `?utm_source=...` localStorage'ga saqlanadi, har ikki lead (boshlandi/tasdiqlandi) commentiga `[manba: ...]` qo'shiladi.

---

## Ochiq qolgan ishlar (kelishilgan, hali qilinmagan)

1. **Telegram obunani haqiqiy tekshirish** — hozir mijoz o'zi belgilaydi (ishonch asosida). Haqiqiy tekshirish uchun: bot kanalga admin bo'lishi, Telegram Login widget + Netlify Function (`getChatMember` orqali) kerak.
2. **Animatsiyalar** — qaysi effekt qayerda ishlatilishi keyingi suhbatda kelishiladi.

## Muhim fayllar xaritasi
- `lib/wizard.ts` — wizard konfiguratsiyasi, guruh xaritasi, telefon/localStorage/UTM helperlari
- `types/wizard.ts`, `types/cms.ts` — tip ta'riflari
- `services/cms.ts` — Apps Script bilan aloqa, normalize, fallback kontent
- `apps-script/Code.gs` — Google Apps Script backend (Sheets ↔ JSON)
- `sections/BuxSoftApp.tsx` — asosiy sahifa (hero, muammolar, jarayon, wizard joylashuvi)
- `sections/wizard/*` — wizard komponentlari
- `app/globals.css` — dizayn tokenlari, ranglar, animatsiyalar
