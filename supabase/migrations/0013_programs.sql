create table if not exists public.programs (
  id text primary key,
  title text not null,
  description text not null default '',
  pillar text not null check (
    pillar in (
      'grassroots_discovery',
      'training',
      'traditional_sports',
      'health',
      'scholarships',
      'girls_inclusion'
    )
  ),
  icon text,
  sort_order integer not null default 0,
  published boolean not null default false,
  cta_label text,
  cta_url text,
  updated_at timestamptz not null default now()
);

alter table public.programs enable row level security;

grant select on public.programs to anon, authenticated;
grant insert, update, delete on public.programs to authenticated;

create policy "programs_public_read"
  on public.programs
  for select
  to anon
  using (published = true);

create policy "programs_authenticated_read"
  on public.programs
  for select
  to authenticated
  using (true);

create policy "programs_authenticated_write"
  on public.programs
  for all
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value, section) values
  ('programs_visible', 'true', 'sections'),
  ('programs_title', 'Our Programs', 'sections')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;

insert into public.programs (
  id,
  title,
  description,
  pillar,
  icon,
  sort_order,
  published,
  cta_label,
  cta_url
) values
  (
    'program-grassroots-discovery',
    'Grassroots Discovery',
    'Scouting talent in villages and underserved communities through local tournaments, school visits, and community coaches.',
    'grassroots_discovery',
    'search',
    1,
    true,
    'Learn more',
    '/khel2026'
  ),
  (
    'program-training',
    'Training & Coaching',
    'Structured coaching camps and mentorship that help young athletes build skills, discipline, and confidence.',
    'training',
    'dumbbell',
    2,
    true,
    null,
    null
  ),
  (
    'program-traditional-sports',
    'Traditional Sports',
    'Reviving indigenous games and rural sports traditions so cultural heritage stays alive alongside modern athletics.',
    'traditional_sports',
    'trophy',
    3,
    true,
    null,
    null
  ),
  (
    'program-health',
    'Health & Nutrition',
    'Workshops on fitness, hygiene, and balanced nutrition so children stay healthy on and off the field.',
    'health',
    'heart',
    4,
    true,
    null,
    null
  ),
  (
    'program-scholarships',
    'Scholarships',
    'Financial support for promising athletes to access equipment, travel, and advanced training opportunities.',
    'scholarships',
    'graduation-cap',
    5,
    true,
    null,
    null
  ),
  (
    'program-girls-inclusion',
    'Girls & Inclusion',
    'Safe, inclusive spaces that encourage girls and marginalized youth to participate, lead, and compete.',
    'girls_inclusion',
    'users',
    6,
    true,
    null,
    null
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  pillar = excluded.pillar,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  published = excluded.published,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url;
