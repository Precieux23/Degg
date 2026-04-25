# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**DÉGG** is a real-time translation PWA for the Jeux Olympiques de la Jeunesse (JOJ) Dakar 2026. It supports 13 languages (French, Wolof, English, Russian, German, Arabic, Spanish, Portuguese, Chinese, Japanese, Korean, Swahili, Hindi) and is designed for volunteers and visitors at the games.

## Commands

```bash
npm run dev       # start dev server (also accessible at 192.168.0.105:3000 for mobile)
npm run build     # production build
npm run start     # start production server
npm run lint      # eslint (Next.js core-web-vitals + TypeScript rules)
```

No test framework is configured.

## Environment

Copy `.env.local` (already present) — it must contain:
```
DEEPL_API_KEY=<your-deepl-free-api-key>
```

The translation API route (`src/app/api/translate/route.ts`) calls `https://api-free.deepl.com` and requires this key at runtime.

## Architecture

The app is a **single-page client component** (`src/app/page.tsx`) with four tabs managed by `activeTab` state. All translation state, speech recognition, and conversation history live in that one component.

### Data flow

- **Translate tab**: debounced 800ms auto-translate on input change → `POST /api/translate` → DeepL API
- **Phrases JOJ tab**: preset French phrases from `src/lib/languages.ts` → navigate to Translate tab + trigger translate
- **Conversation tab**: two-sided A/B exchange, each send calls `POST /api/translate` then `speechSynthesis`
- **Mobilité tab**: `MobiliteJOJ` component, drills zones → sites → detail, translating site name/sports/transport info via `onTranslate` prop

### Key files

- `src/lib/languages.ts` — `LANGUAGES` array (13 entries), `JOJ_PHRASES` categories, `LanguageCode` type
- `src/app/api/translate/route.ts` — Route Handler wrapping DeepL. Short-circuits when `from === to`.
- `src/components/GuideCoach.tsx` — 9-step onboarding overlay, fully bilingual FR/EN via the `I18N` object. Steps are keyed by `GuideKey`, ordered in `ORDER`. Opens automatically on first session visit (tracked via `sessionStorage["guide_seen_welcome"]`); locale persisted in `localStorage["degg_guide_locale"]`.
- `src/components/MobiliteJOJ.tsx` — 3-zone explorer (Dakar, Diamniadio, Saly) with `ZONES` data and `TRANSPORT_PHRASES`. Translates site details on demand when `toLang !== "FR"`.
- `src/components/QRModal.tsx` — shares the current URL as a QR code using `qrcode.react`.
- `src/app/globals.css` — Tailwind v4 (`@import "tailwindcss"`) + custom CSS classes: `joj-track-bg`, `joj-track-lines`, `joj-overlay`, `joj-coach`, `joj-fab`, `joj-btn`, `joj-btn-primary`, `joj-btn-ghost`.

### Styling conventions

- Tailwind v4: use `@import "tailwindcss"` in CSS, not `@tailwind base/components/utilities`.
- Custom design tokens are CSS variables prefixed `--degg-*` and aliased as `--joj-*`.
- `tailwind.config.ts` extends colors under `degg.*` (bg, ink, green, green2, orange, orange2, yellow) and adds `shadow-soft`, animation `fade-up`, `shimmer`.

### Speech API notes

- Wolof (`WO`) maps to `fr-SN` for both `SpeechRecognition` and `SpeechSynthesis` (no native Wolof browser support).
- DeepL does not natively support Wolof — translations for `WO` may fall back or fail silently; handle accordingly when extending language support.

### PWA

`src/app/layout.tsx` registers `/sw.js` and references `/manifest.json` — both must exist in `public/`. The service worker is not in this repo's source; it must be present in `public/sw.js` for offline support to work.
