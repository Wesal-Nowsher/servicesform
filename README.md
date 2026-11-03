# Services Form

One-page, mobile-friendly company services form with an admin page. Built with Next.js + Neon Postgres, deploys on Vercel.

- `/` — the form
- `/admin` — password-protected list of all submissions (search + CSV export)

## Deploy on Vercel
1. Import this repo in Vercel.
2. **Storage → Create → Neon (Postgres)** and connect it to the project (this sets `DATABASE_URL`).
3. **Settings → Environment Variables**: add `ADMIN_PASSWORD`.
4. Redeploy. The `submissions` table is created automatically on first use.

## Local
```bash
cp .env.example .env.local   # fill in values
npm install && npm run dev
```
