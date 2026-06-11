create table if not exists public.team_members (
  id text primary key,
  name text not null,
  role text not null,
  bio text not null default '',
  photo_url text,
  published boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.contributors (
  id text primary key,
  name text not null,
  contribution text not null,
  photo_url text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id text primary key,
  name text not null,
  tier text not null check (tier in ('platinum', 'gold', 'silver', 'community')),
  logo_url text,
  website text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key,
  quote text not null,
  author text not null,
  relation text not null default '',
  photo_url text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
alter table public.contributors enable row level security;
alter table public.sponsors enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq_items enable row level security;

grant select on public.team_members to anon, authenticated;
grant select on public.contributors to anon, authenticated;
grant select on public.sponsors to anon, authenticated;
grant select on public.testimonials to anon, authenticated;
grant select on public.faq_items to anon, authenticated;

grant insert, update, delete on public.team_members to authenticated;
grant insert, update, delete on public.contributors to authenticated;
grant insert, update, delete on public.sponsors to authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant insert, update, delete on public.faq_items to authenticated;

create policy "team_members_public_read"
  on public.team_members
  for select
  to anon
  using (published = true);

create policy "team_members_authenticated_read"
  on public.team_members
  for select
  to authenticated
  using (true);

create policy "team_members_authenticated_write"
  on public.team_members
  for all
  to authenticated
  using (true)
  with check (true);

create policy "contributors_public_read"
  on public.contributors
  for select
  to anon, authenticated
  using (true);

create policy "contributors_authenticated_write"
  on public.contributors
  for all
  to authenticated
  using (true)
  with check (true);

create policy "sponsors_public_read"
  on public.sponsors
  for select
  to anon, authenticated
  using (true);

create policy "sponsors_authenticated_write"
  on public.sponsors
  for all
  to authenticated
  using (true)
  with check (true);

create policy "testimonials_public_read"
  on public.testimonials
  for select
  to anon, authenticated
  using (true);

create policy "testimonials_authenticated_write"
  on public.testimonials
  for all
  to authenticated
  using (true)
  with check (true);

create policy "faq_items_public_read"
  on public.faq_items
  for select
  to anon, authenticated
  using (true);

create policy "faq_items_authenticated_write"
  on public.faq_items
  for all
  to authenticated
  using (true)
  with check (true);

insert into public.faq_items (id, question, answer, sort_order) values
  (
    'faq-what-to-bring',
    'What should my child bring to the festival?',
    'Please bring comfortable clothes, a water bottle, and running shoes.',
    1
  ),
  (
    'faq-age-groups',
    'Are events grouped by age?',
    'Yes. Each game lists its recommended age group on the events section.',
    2
  )
on conflict (id) do update
set
  question = excluded.question,
  answer = excluded.answer,
  sort_order = excluded.sort_order;
