# Deploy WISDOM to Vercel

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. (Optional) Supabase project with [`supabase/migrations/20260731000000_phase1_schema.sql`](../supabase/migrations/20260731000000_phase1_schema.sql) applied
3. Local build passes: `npm run build`

## Option A — Vercel CLI

```bash
npx vercel login
npx vercel
```

Follow prompts to link/create the project. Then set env vars:

```bash
npx vercel env add NEXT_PUBLIC_SITE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Production deploy:

```bash
npx vercel --prod
```

## Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Next.js**
4. Add environment variables (see below)
5. Deploy

## Environment variables

| Name | Example | Required |
|------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | `https://wisdomlimbe.com` | Yes (SEO/sitemap) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | For live CMS/auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | For live CMS/auth |

Without Supabase keys, the site still works with seed data. Admin demo password: `wisdom-admin`.

## Custom domain

Vercel → Project → Settings → Domains → add `wisdomlimbe.com` (or similar) and follow DNS instructions.

## Post-deploy checklist

- [ ] Homepage loads with WISDOM logo
- [ ] `/restaurant` and `/spa` list items
- [ ] WhatsApp buttons open `wa.me/237673949163` with pre-filled text
- [ ] `/admin/login` works
- [ ] `/sitemap.xml` and `/robots.txt` respond
