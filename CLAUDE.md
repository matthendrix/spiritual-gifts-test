# Spiritual Gifts Test Notes

## Architecture

- A Next.js 16 App Router site renders everything inside `app/page.tsx`; there are no API routes or server persistence.
- `data/questions.ts` and `data/gifts.ts` are generated from the provided Excel/DOCX assets and store every statement plus gift definitions.
- Tailwind CSS 4 provides gradients and responsive cards via `app/globals.css`.

## Experience

- Clients answer 161 statements (from the Excel workbook), selecting a 0-3 score per statement.
- The UI tracks completion, enables submission after all answers, and shows a single top gift with the original description and Scripture references.
- Resetting clears answers so the questionnaire can be retaken instantly.

## Deployment

- GitHub pushes to `main` trigger Vercel builds (`npm run build -> .next`) as configured in `vercel.json`.
- No environment variables are needed because the app operates purely on client-side state.

## Notes

- Keep `data/` updated whenever you refresh the assets; regenerate from the `.xlsx`/`.docx` if statement text changes.
- Run `npm run dev` or `npm run build` locally before pushing to ensure the Next.js TypeScript stack compiles cleanly.
