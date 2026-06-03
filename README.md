# Hustle Fitness - strona klubu

Statyczna strona internetowa butikowej siłowni **Hustle Fitness** (Łódź, ul. Piotrkowska 276 D).
Autorski kod (HTML / CSS / JS) - bez WordPressa, bez frameworka, bez kroku budowania.
Gotowa do wdrożenia na **Vercel** jako projekt statyczny.

## Stack

- **HTML / CSS / vanilla JS** - zero zależności runtime
- **GSAP + ScrollTrigger** - animacje sekcji (vendorowane lokalnie)
- **Lenis** - płynne przewijanie (vendorowane lokalnie)
- Czcionki self-hosted: **Anton**, **Archivo**, **Sora**, **JetBrains Mono** (woff2)

Wszystko jest hostowane lokalnie - strona działa w pełni offline.

## Struktura projektu

```
.
├── index.html                  # strona główna (one-page)
├── regulamin.html              # /regulamin
├── polityka-prywatnosci.html   # /polityka-prywatnosci
├── assets/
│   ├── css/style.css           # design system + wszystkie sekcje
│   ├── js/
│   │   ├── app.js              # Lenis, animacje, nawigacja, formularz
│   │   └── vendor/             # gsap, ScrollTrigger, ScrollToPlugin, lenis
│   ├── fonts/                  # @font-face + pliki .woff2
│   └── img/                    # zdjęcia klubu, logo
├── vercel.json                 # clean URLs + nagłówki (cache / security)
├── robots.txt
├── sitemap.xml
└── start.bat                   # lokalny podgląd (Windows)
```

## Uruchomienie lokalne

**Windows:** dwuklik `start.bat`.

**Dowolny system** (Node) - serwer z obsługą clean URLs, tak jak na Vercel:

```bash
npx serve
```

Strona: `http://localhost:3000`.

## Deployment na Vercel

Projekt jest statyczny (bez builda), więc wdrożenie jest zero-config.

**Wariant A - CLI:**

```bash
npm i -g vercel
vercel          # podgląd
vercel --prod   # produkcja
```

**Wariant B - Git:** podłącz repozytorium w panelu Vercel. Ustawienia:

| Pole | Wartość |
|---|---|
| Framework Preset | **Other** |
| Build Command | *(puste)* |
| Output Directory | *(puste - serwowany jest root)* |

`vercel.json` zapewnia:
- **clean URLs** (`/regulamin` zamiast `/regulamin.html`),
- długie cache'owanie `assets/*` (`max-age=31536000, immutable`),
- nagłówki bezpieczeństwa (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).

Po wdrożeniu zaktualizuj domenę w `robots.txt` i `sitemap.xml`, jeśli inna niż `hustlefitness.pl`.

## Uwagi

- **Formularz kontaktowy** działa po stronie przeglądarki (walidacja + komunikat o wysłaniu) - nie ma backendu. Do realnej wysyłki podłącz np. Vercel Form / Formspree / własny endpoint w `assets/js/app.js`.
- Przyciski "Kup karnet" prowadzą do zewnętrznego systemu rezerwacji **eFitness** (`hustlefitness-lodz.cms.efitness.com.pl`). Adresy edytujesz w `index.html`.
- Treść (cennik, kadra, FAQ, dokumenty) jest wpisana bezpośrednio w HTML i w pełni edytowalna.
