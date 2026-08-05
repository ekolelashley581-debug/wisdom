-- Public media bucket for product/admin uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800,
  array[
    'image/jpeg','image/png','image/webp','image/gif',
    'video/mp4','video/webm','video/ogg','video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read media bucket" on storage.objects;
create policy "Public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Staff upload media" on storage.objects;
create policy "Staff upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "Staff update media objects" on storage.objects;
create policy "Staff update media objects"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "Staff delete media objects" on storage.objects;
create policy "Staff delete media objects"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff());

alter table public.media
  add column if not exists name text not null default '',
  add column if not exists size bigint not null default 0,
  add column if not exists kind text not null default 'image'
    check (kind in ('image', 'video'));

alter table public.spa_products
  add column if not exists thumbnail text not null default '';
