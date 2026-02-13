# Spiritual Gifts Test Notes

## Architecture

- A Next.js 16 App Router site renders everything inside `app/page.tsx`; there are no API routes or server persistence.
- `data/questions.ts` and `data/gifts.ts` are generated from the provided Excel/DOCX assets and store every statement plus gift definitions.
- Tailwind CSS 4 provides gradients and responsive cards via `app/globals.css`.

## Experience

- Clients answer 161 statements (from the Excel workbook), selecting a 0-3 score per statement.
- The UI tracks completion, enables submission after all answers, and shows the **top 3 gifts** ranked with scores, descriptions, and Scripture references.
- An empty-state nudge appears when no questions have been answered yet.
- Progress is persisted to `localStorage` so users can resume across sessions.
- Resetting clears answers so the questionnaire can be retaken instantly.

## Deployment

- GitHub pushes to `main` trigger Vercel builds (`npm run build -> .next`) as configured in `vercel.json`.
- No environment variables are needed because the app operates purely on client-side state.

## Metadata & SEO

- Open Graph and Twitter card meta tags are set in `app/layout.tsx` via the Next.js `Metadata` export.
- `themeColor` lives in a separate `viewport` export (required by Next.js 16 — putting it in `metadata` triggers a warning).
- SVG favicon at `app/icon.svg` is auto-detected by the App Router.

## Notes

- Keep `data/` updated whenever you refresh the assets; regenerate from the `.xlsx`/`.docx` if statement text changes.
- Run `npm run dev` or `npm run build` locally before pushing to ensure the Next.js TypeScript stack compiles cleanly.
