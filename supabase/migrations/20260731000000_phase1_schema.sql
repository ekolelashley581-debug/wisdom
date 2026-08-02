-- WISDOM Phase 1 schema
-- Apply in Supabase SQL Editor or via: supabase db push

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

-- Settings key/value
create table if not exists public.settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('restaurant', 'spa')),
  name text not null,
  slug text not null,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int not null default 0,
  unique (type, slug)
);

-- Menu items
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12,0) not null default 0,
  images text[] not null default '{}',
  ingredients text[] not null default '{}',
  allergens text[] not null default '{}',
  prep_time text default '',
  spice_level int not null default 0 check (spice_level between 0 and 5),
  is_chefs_special boolean not null default false,
  is_available boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Spa services
create table if not exists public.spa_services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_by_level jsonb not null default '{"junior":0,"senior":0,"master":0}',
  duration text default '',
  images text[] not null default '{}',
  is_package boolean not null default false,
  is_available boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Spa products
create table if not exists public.spa_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sizes jsonb not null default '[]',
  price numeric(12,0) not null default 0,
  images text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media library
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text not null default '',
  folder text not null default 'uploads',
  usage_refs jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Activity log
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  created_at timestamptz not null default now()
);

-- Helper: check admin/editor role from profiles (not user_metadata)
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.spa_services enable row level security;
alter table public.spa_products enable row level security;
alter table public.media enable row level security;
alter table public.activity_log enable row level security;

-- Public read published content
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read published menu" on public.menu_items for select using (status = 'published' or public.is_staff());
create policy "Public read published spa" on public.spa_services for select using (status = 'published' or public.is_staff());
create policy "Public read published products" on public.spa_products for select using (status = 'published' or public.is_staff());
create policy "Public read settings" on public.settings for select using (true);
create policy "Public read media" on public.media for select using (true);

-- Staff write
create policy "Staff write categories" on public.categories for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff write menu" on public.menu_items for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff write spa" on public.spa_services for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff write products" on public.spa_products for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff write media" on public.media for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff write settings" on public.settings for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff read activity" on public.activity_log for select using (public.is_staff());
create policy "Staff insert activity" on public.activity_log for insert with check (public.is_staff());

-- Profiles
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Admin manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Default settings seed
insert into public.settings (key, value) values
  ('whatsapp_number', '237673949163'),
  ('delivery_radius', 'Within Limbe city limits (approx. 8 km)'),
  ('min_order', '5000'),
  ('address', 'Limbe, South-West Region, Cameroon'),
  ('maps_query', 'Limbe Cameroon'),
  ('email', 'hello@wisdomlimbe.com'),
  ('tagline', 'Restaurant, Spa & Lounge in Limbe'),
  ('opening_hours', '[{"day":"Monday","open":"9:00 AM","close":"11:00 PM"},{"day":"Tuesday","open":"9:00 AM","close":"11:00 PM"},{"day":"Wednesday","open":"9:00 AM","close":"11:00 PM"},{"day":"Thursday","open":"9:00 AM","close":"11:00 PM"},{"day":"Friday","open":"9:00 AM","close":"1:00 AM"},{"day":"Saturday","open":"9:00 AM","close":"1:00 AM"},{"day":"Sunday","open":"10:00 AM","close":"11:00 PM"}]'),
  ('social_links', '{"facebook":"https://facebook.com","instagram":"https://instagram.com","tiktok":"https://tiktok.com"}')
on conflict (key) do nothing;
