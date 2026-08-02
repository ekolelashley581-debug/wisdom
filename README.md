# WISDOM — Restaurant, Spa & Lounge (Limbe)

Phase 1 MVP: Next.js 14 + Tailwind + Supabase-ready CMS, WhatsApp-first ordering/booking.

## Design

- **Logo:** `public/branding/wisdom-logo.png`
- **Palette:** Black `#1A1A1A`, Teal `#0D7377`, Silver `#C0C0C0` / `#E8E8E8`, Cream `#FAF8F5`, WhatsApp `#25D366`
- **Fonts:** Playfair Display (headings) + Inter (body)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin (demo mode)

1. Go to [/admin/login](http://localhost:3000/admin/login)
2. Password: `wisdom-admin` (no Supabase required)
3. Manage restaurant, spa, and settings (stored in browser localStorage)

## Environment

Copy `.env.example` → `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://wisdomlimbe.com
```

Without Supabase, the public site uses seeded menu/spa data and the default WhatsApp number `+237 673 949 163`.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in [`supabase/migrations/20260731000000_phase1_schema.sql`](supabase/migrations/20260731000000_phase1_schema.sql) (SQL Editor → Run)
3. Create an Auth user, then set `profiles.role` to `admin` for that user
4. Add env vars locally and on Vercel

## Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel
```

Then set environment variables in the Vercel dashboard (same as `.env.example`), and:

```bash
vercel --prod
```

Or connect the GitHub repo in the Vercel UI for automatic deploys.

Custom domain: add `wisdomlimbe.com` (or similar) under Project → Settings → Domains.

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/restaurant` | Menu listing |
| `/restaurant/[slug]` | Menu item detail |
| `/spa` | Spa services |
| `/spa/[slug]` | Service detail |
| `/admin` | Admin dashboard |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots |

## Phase 2+ (deferred)

Blog, AI chatbot (OpenRouter), product detail galleries, booking calendar, payments (MoMo / Orange / Fapshi), full analytics.
