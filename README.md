# Finora — แอปจดรายรับรายจ่าย

Implementation of the Liquid Glass mobile design exported from Claude Design.
React + TypeScript + Vite, with Supabase for auth and storage.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env` and fill in the two values from
   **Project Settings → API**.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

The layout is mobile-first and capped at 460px; open the browser in a phone
viewport for the intended experience.

## Deploy (Cloudflare Pages)

Connect the repo, then set:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

`public/_redirects` sends every path to `index.html` so client-side routes
survive a refresh. After the first deploy, add the Pages URL to Supabase under
**Authentication → URL Configuration** so confirmation emails link back to it.

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

A new account starts with the prototype's default budgets and tags, but no
transactions — those are the user's own data.

Every row is scoped to `auth.uid()` by row-level security, so one account can
never read another's. Writes paint locally first and reload from the server if
the write is rejected.

## Structure

```
src/
  components/   glass primitives, charts, nav, sheet
  context/      store (reducer), provider, hook
  data/         categories, plans, slides, default budgets and tags
  lib/          Supabase client and queries
  pages/        one file per screen
  styles/       design tokens (theme.css) + component classes
  utils/        money, Thai/Buddhist-era dates, selectors
```

Design tokens in `styles/theme.css` are ported verbatim from the prototype's
`:root` block, including the light-theme overrides.
