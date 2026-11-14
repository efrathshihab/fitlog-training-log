# FitLog — Workout Library

FitLog is a responsive training log for choosing workouts, building today's plan, and saving lifts for later. It follows the supplied B14-A6 design and loads workout names, images, and stats from the assignment API.

## Technologies

- Next.js 16 with App Router and TypeScript
- Tailwind CSS 4 and shadcn/ui style components
- Radix UI, Lucide icons, and Sonner toasts
- Browser `localStorage` for plan and saved state
- Playwright Core for browser smoke checks

## Features

1. Browse all 12 API workouts in a responsive library with loading and retry states.
2. Open detail pages with the image, muscle groups, seven specs, and four instructions.
3. Add workouts to today's plan or save them for later with live navbar badges and toasts.
4. See live exercise, minute, and calorie totals; mark planned workouts done or remove entries.
5. Switch between Today's Plan and Saved and sort the active list by duration, calories, or rating.
6. Keep plan and saved entries across reloads and limit today's active plan to five lifts.
7. Show a custom 404 for unknown routes and invalid workout IDs.
8. Retry the alternative workout API if the primary API fails.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. To check the production build:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Run the browser smoke checks against a running app with `npm run smoke`. They use an installed Chrome browser. On Windows the script uses the usual Chrome installation path; set `CHROME_PATH` if Chrome is elsewhere. Set `FITLOG_URL` to test a different local URL.

## Routes and data

- `/` — home and workout library
- `/workouts/[id]` — workout detail
- `/my-plan` — today's plan and saved workouts
- `/api/workouts` and `/api/workouts/[id]` — server routes that validate and proxy the assignment API

The API routes try `https://api.abcz.workers.dev/api/fitlog` first, then `https://api.api-store.workers.dev/api/fitlog`. If neither responds with usable data, the app shows a retryable error state.

## Deploy

Import this repository into Vercel, keep the root directory as the project root, choose the Next.js framework preset, and deploy. No environment variables are required. After deployment, open and refresh `/`, `/my-plan`, and `/workouts/1` to verify direct routing.
