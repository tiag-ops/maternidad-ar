# Maternidad.ar

Calculadoras de embarazo, licencia por maternidad y asignaciones de ANSES para Argentina.
Sitio 100% estático (Next.js 16 `output: export`) deployado en Cloudflare Pages.

## Stack

- Next.js 16 (static export) + Tailwind CSS 4 + TypeScript
- Motores de cálculo puros en `src/lib` (Vitest, sin DOM)
- Datos oficiales como JSON versionados en `src/data` (con vigencia y fuente)
- CI: GitHub Actions (lint + tsc + test + build)

## Comandos

```bash
npm install
npm run dev      # desarrollo
npm test         # vitest
npm run lint     # eslint
npx tsc --noEmit # tipos
npm run build    # exporta a out/
```

## Datos

- `src/data/anses-2026-08.json`: montos ANSES (AUE, AUH, prenatal, nacimiento) verificados
  contra anses.gob.ar el 2026-08-29. El script mensual (`scripts/fetch-anses.mjs`, Fase 5)
  reemplaza este JSON cuando cambia la movilidad.
- LCT 20.744 art. 177/183: parámetros en `src/lib/licencia.ts`, texto verificado contra
  argentina.gob.ar (texto según Ley 27.742, B.O. 8/7/2024).

## Reglas del repo

- Ningún número legal/legalizado hardcodeado en componentes: todo viene de `src/data`.
- Fechas SIEMPRE con `src/lib/fechas.ts` (aritmética UTC; nunca `new Date(iso)` pelado).
- Captions siempre `text-neutral-600 dark:text-neutral-400` (nunca neutral-500).
- Gate antes de push: `npm run lint && npx tsc --noEmit && npm test && npm run build`.
