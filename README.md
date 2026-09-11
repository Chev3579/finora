# Finora — แอปจดรายรับรายจ่าย

Implementation of the Liquid Glass mobile design exported from Claude Design
(`../project/Liquid Glass App.dc.html`). React + TypeScript + Vite, no backend —
state lives in `localStorage`.

## Run

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

The layout is mobile-first and capped at 460px; open the browser in a phone
viewport for the intended experience.

## Screens

| Route          | Design artboard | Notes                                                        |
| -------------- | --------------- | ------------------------------------------------------------ |
| `/onboarding`  | 1g              | 3 slides, TH/EN toggle; shown until completed once           |
| `/`            | 1a              | Balance, range selector, bank filter, quick-add sheet        |
| `/add`         | 1b              | Full entry form; expense/income recolours the whole screen   |
| `/dashboard`   | 1c              | Income/expense bars + category donut                         |
| `/list`        | 1d              | Month picker, type/category filters, CSV export              |
| `/budget`      | 1e              | Monthly budget progress per category, tag management         |
| `/pricing`     | 1f              | Plan comparison; selecting a plan updates the profile        |
| `/settings`    | —               | Not in the design; added because the nav has a 5th tab       |

## How it differs from the prototype

The prototype drove every screen from fixed mock tables (`RANGE`, `SERIES`,
`SLICES`, `BUDGETS`) that were independent of each other. Here a single
transaction list is the source of truth: totals, the trend chart, the donut and
budget progress are all derived from it, so saving an entry updates every screen.

Seed data matches the prototype's transactions (September 2569 / 2026). Clearing
site data resets to it.

## Structure

```
src/
  components/   glass primitives, charts, nav, sheet
  context/      store (reducer + persistence), provider, hook
  data/         categories, plans, slides, seed data
  pages/        one file per screen
  styles/       design tokens (theme.css) + component classes
  utils/        money, Thai/Buddhist-era dates, selectors
```

Design tokens in `styles/theme.css` are ported verbatim from the prototype's
`:root` block, including the light-theme overrides.
