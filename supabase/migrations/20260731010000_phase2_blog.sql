-- WISDOM Phase 2: blog posts table
-- Apply after phase1 schema

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  featured_image text default '',
  category text not null default 'Events',
  author text not null default 'WISDOM Team',
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  scheduled_at timestamptz,
  meta_title text default '',
  meta_description text default '',
  og_image text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Public read published blog"
  on public.blog_posts for select
  using (
    status = 'published'
    and (published_at is null or published_at <= now())
  );

create policy "Authenticated manage blog"
  on public.blog_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Optional: ensure spa_products has is_available
alter table public.spa_products
  add column if not exists is_available boolean not null default true;
