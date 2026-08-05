-- WISDOM Phase 4: shop orders, reservations, subscribers, contact, notifications
-- Aligns Supabase with ops/analytics features used by the site

-- Extend delivery_orders for pickup/delivery pricing
alter table public.delivery_orders
  add column if not exists fulfillment text not null default 'delivery'
    check (fulfillment in ('pickup', 'delivery'));
alter table public.delivery_orders
  add column if not exists delivery_km numeric(8,2) not null default 0;
alter table public.delivery_orders
  add column if not exists delivery_fee numeric(12,0) not null default 0;
alter table public.delivery_orders
  add column if not exists subtotal numeric(12,0) not null default 0;

-- Extend analytics_events
alter table public.analytics_events
  add column if not exists visitor_id text;

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_type_idx
  on public.analytics_events (type);

-- Shop orders
create table if not exists public.shop_orders (
  id text primary key,
  product_name text not null,
  product_slug text not null default '',
  size text not null default 'Standard',
  quantity int not null default 1,
  unit_price numeric(12,0) not null default 0,
  fulfillment text not null default 'pickup'
    check (fulfillment in ('pickup', 'delivery')),
  delivery_km numeric(8,2) not null default 0,
  delivery_fee numeric(12,0) not null default 0,
  subtotal numeric(12,0) not null default 0,
  total numeric(12,0) not null default 0,
  customer_name text not null default '',
  customer_phone text not null default '',
  address text not null default '',
  notes text not null default '',
  status text not null default 'new'
    check (status in ('new','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  payment_method text not null default 'whatsapp',
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table reservations
create table if not exists public.table_reservations (
  id text primary key,
  date date not null,
  time text not null,
  guests int not null default 2,
  customer_name text not null default '',
  customer_phone text not null default '',
  notes text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

-- Blog subscribers
create table if not exists public.blog_subscribers (
  id text primary key,
  name text not null default '',
  email text not null unique,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Contact inbox
create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null default '',
  message text not null default '',
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  notes text,
  created_at timestamptz not null default now()
);

-- Admin notifications
create table if not exists public.admin_notifications (
  id text primary key,
  type text not null default 'system',
  title text not null,
  body text not null default '',
  href text,
  meta jsonb not null default '{}',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.shop_orders enable row level security;
alter table public.table_reservations enable row level security;
alter table public.blog_subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_notifications enable row level security;

-- Public can submit forms / analytics
create policy "Anon insert shop orders" on public.shop_orders
  for insert with check (true);
create policy "Anon insert reservations" on public.table_reservations
  for insert with check (true);
create policy "Anon insert subscribers" on public.blog_subscribers
  for insert with check (true);
create policy "Anon insert contact" on public.contact_messages
  for insert with check (true);
create policy "Anon insert spa bookings" on public.spa_bookings
  for insert with check (true);
create policy "Anon insert delivery orders" on public.delivery_orders
  for insert with check (true);

-- Staff (authenticated) full manage
create policy "Auth manage shop orders" on public.shop_orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Auth manage reservations" on public.table_reservations
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Auth manage subscribers" on public.blog_subscribers
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Auth manage contact" on public.contact_messages
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Auth manage notifications" on public.admin_notifications
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Allow authenticated read of analytics (anon already can insert)
create policy "Auth read analytics" on public.analytics_events
  for select using (auth.role() = 'authenticated');
