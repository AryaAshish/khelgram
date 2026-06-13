create table if not exists public.success_stories (
  id text primary key,
  title text not null,
  summary text not null default '',
  story text not null default '',
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.success_stories enable row level security;

grant select on public.success_stories to anon, authenticated;
grant insert, update, delete on public.success_stories to authenticated;

create policy "success_stories_public_read"
  on public.success_stories
  for select
  to anon
  using (published = true);

create policy "success_stories_authenticated_read"
  on public.success_stories
  for select
  to authenticated
  using (true);

create policy "success_stories_authenticated_write"
  on public.success_stories
  for all
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value, section) values
  ('success_stories_visible', 'true', 'sections'),
  ('success_stories_title', 'Success Stories', 'sections')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;

insert into public.success_stories (
  id,
  title,
  summary,
  story,
  image_url,
  sort_order,
  published
) values
  (
    'story-village-champion',
    'From village field to district finals',
    'A young athlete from a remote village discovered through grassroots scouting.',
    'Rahul joined our grassroots discovery camp with borrowed shoes and unmatched determination. Within a year of structured coaching, he reached district-level athletics finals and inspired three neighboring villages to restart school sports programs.',
    null,
    1,
    true
  ),
  (
    'story-girls-football',
    'Girls reclaim the playground',
    'Inclusive sports days brought girls back to community play spaces.',
    'Our girls inclusion program helped a cluster of villages run weekly football sessions for adolescent girls. Parents who once hesitated now volunteer as coaches, and school attendance among participating girls has improved noticeably.',
    null,
    2,
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  summary = excluded.summary,
  story = excluded.story,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  published = excluded.published;
