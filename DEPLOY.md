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
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
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

| Name | Where to get it | Required for |
|------|-----------------|--------------|
| `NEXT_PUBLIC_SITE_URL` | Your live URL, e.g. `https://wisdom-ruddy.vercel.app` | SEO / auth redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Login |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` `public` key | Login |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` secret | Products, images, Users |

These go in **Vercel → Project → Settings → Environment Variables** (Name + Value only — no `=` in the name).

Admin login uses **email + password** for a user that already exists in Supabase Auth. There is no Google / public sign-up.

## Custom domain

Vercel → Project → Settings → Domains → add `wisdomlimbe.com` (or similar) and follow DNS instructions.

## Post-deploy checklist

- [ ] Homepage loads with WISDOM logo
- [ ] `/restaurant` and `/spa` list items
- [ ] WhatsApp buttons open `wa.me/237673949163` with pre-filled text
- [ ] `/admin/login` works
- [ ] `/sitemap.xml` and `/robots.txt` respond
