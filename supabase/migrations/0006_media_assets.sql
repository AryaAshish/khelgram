create table if not exists public.media_assets (
  id text primary key,
  path text unique not null,
  url text not null,
  alt text not null default '',
  size bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;

grant select on public.media_assets to anon, authenticated;
grant insert, update, delete on public.media_assets to authenticated;

create policy "media_assets_public_read"
  on public.media_assets
  for select
  to anon, authenticated
  using (true);

create policy "media_assets_authenticated_write"
  on public.media_assets
  for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update
set public = excluded.public;

create policy "media_storage_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media_storage_authenticated_write"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');
