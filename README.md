# BuxSoft 

Bu paket Google Sheets orqali boshqariladigan BuxSoft sayti uchun clean final variant.

## Muhim environment variable

Vercel → Project → Settings → Environment Variables:

```txt
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## GitHubga yuklash

Zip ichidagi fayl va papkalarni repository root qismiga yuklang.

## Google Sheets CMS

Talab qilingan sheetlar:

- SETTINGS
- CATEGORIES
- TARIFFS
- SERVICES
- TESTIMONIALS
- FAQ
- STATS
- LEADS

`TARIFFS.features` ustunidagi featurelar `|` bilan ajratiladi:

```txt
Birlamchi hujjatlar|Soliq hisobotlari|Ish haqi hisoblash
```

## Eslatma

Sayt build paytida API ishlamasa ham deploy bo'ladi. Runtime paytida Google Sheetsdan ma'lumot oladi.
