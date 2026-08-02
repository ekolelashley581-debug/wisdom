-- WISDOM Phase 3: bookings, deliveries, analytics events
-- Apply after phase 1 & 2 migrations

create table if not exists public.spa_bookings (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  service_slug text not null default '',
  stylist_level text not null default 'senior',
  date date not null,
  time text not null,
  customer_name text not null default '',
  customer_phone text not null default '',
  notes text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create table if not exists public.delivery_orders (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null default '[]',
  customer_name text not null default '',
  customer_phone text not null default '',
  address text not null default '',
  notes text not null default '',
  total numeric(12,0) not null default 0,
  status text not null default 'new'
    check (status in ('new','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  payment_method text not null default 'whatsapp',
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  label text not null default '',
  path text not null default '',
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.spa_bookings enable row level security;
alter table public.delivery_orders enable row level security;
alter table public.analytics_events enable row level security;

create policy "Auth manage bookings" on public.spa_bookings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Auth manage deliveries" on public.delivery_orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Auth manage analytics" on public.analytics_events
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Anon insert analytics" on public.analytics_events
  for insert with check (true);
