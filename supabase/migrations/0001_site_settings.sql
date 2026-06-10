create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  section text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

create policy "site_settings_public_read"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy "site_settings_authenticated_write"
  on public.site_settings
  for all
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value, section) values
  ('site_name', 'Khelgram Foundation', 'header'),
  ('hero_badge', 'Children''s Sports Festival 2026', 'hero'),
  ('hero_title', 'Where Young Champions', 'hero'),
  ('hero_title_highlight', 'Begin Their Journey', 'hero'),
  ('hero_subtitle', 'Join us for an unforgettable day of sports, fun, and teamwork at VM Field. Let your child experience the joy of play and the spirit of competition!', 'hero'),
  ('event_date', '2026-04-22', 'hero'),
  ('event_time', '6:00 AM - 10:00 AM', 'hero'),
  ('event_venue', 'VM Field', 'hero'),
  ('event_status', 'registration_open', 'settings'),
  ('contact_email', '123gmail.com', 'contact'),
  ('footer_tagline', 'Empowering children through sports, fitness, and healthy development', 'footer'),
  ('footer_copyright', '© 2026 Khelgram Foundation. All rights reserved. Building champions, one game at a time.', 'footer')
on conflict (key) do nothing;
