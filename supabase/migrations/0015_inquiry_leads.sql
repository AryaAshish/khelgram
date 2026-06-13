create table if not exists public.inquiry_leads (
  id text primary key,
  type text not null check (type in ('partner', 'volunteer')),
  name text not null,
  email text not null,
  phone text,
  organization text,
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.inquiry_leads enable row level security;

grant insert on public.inquiry_leads to anon, authenticated;
grant select on public.inquiry_leads to authenticated;

create policy "inquiry_leads_anon_insert"
  on public.inquiry_leads
  for insert
  to anon
  with check (true);

create policy "inquiry_leads_authenticated_read"
  on public.inquiry_leads
  for select
  to authenticated
  using (true);

insert into public.site_settings (key, value, section) values
  ('org_get_involved_partners_cta_url', '/get-involved#partner-inquiry', 'org_get_involved'),
  ('org_get_involved_volunteers_cta_url', '/get-involved#volunteer-signup', 'org_get_involved')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
