# Spiritual Gifts Test

A narrative-style Next.js 16 App Router experience that walks through the Willow Church spiritual gift statements and reveals a single top gift, built on the same GitHub + Vercel workflow you used for `table-picker`.

## Quick start

```
npm install
npm run dev
```

## Stack

- `Next.js 16` (App Router)
- `React 20`
- `Tailwind CSS 4` with a cinematic gradient background
- TypeScript-driven data modules (`data/questions.ts`, `data/gifts.ts`)
- No backend persistence or APIs, all scoring happens in the browser

## Questionnaire flow

- The `data/questions.ts` file was generated from `src/assets/spiritualgiftstest.xlsx` so every statement maps back to the original Excel workbook.
- Answers are recorded per statement (score 0-3) and the UI highlights a single top gift plus its Scripture references.
- The experience includes a completion progress bar, animated option states, and a reset button for retakes.

## Deployment

- Connect the repository to GitHub (push `main`) and link the same repo to a Vercel project.
- Vercel uses the `nextjs` framework preset (`vercel.json` points at `.next`), so every push triggers `npm run build`.
- No environment variables are required; the experience is fully static and runs entirely in the browser.

## Operational notes

- Keep `node_modules`, `.next`, and other artifacts out of source control (`.gitignore` already tracks them).
- Run `npm run build` locally to verify what Vercel will deploy.
