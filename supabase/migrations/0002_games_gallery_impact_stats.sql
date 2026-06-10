create table if not exists public.games (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  icon text,
  age_group text not null,
  start_time text not null,
  status text not null default 'active',
  capacity integer,
  registered_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id text primary key,
  url text not null,
  alt text not null,
  caption text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.impact_stats (
  id text primary key,
  stat_key text,
  value text not null,
  label text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.games enable row level security;
alter table public.gallery_images enable row level security;
alter table public.impact_stats enable row level security;

grant select on public.games to anon, authenticated;
grant select on public.gallery_images to anon, authenticated;
grant select on public.impact_stats to anon, authenticated;

grant insert, update, delete on public.games to authenticated;
grant insert, update, delete on public.gallery_images to authenticated;
grant insert, update, delete on public.impact_stats to authenticated;

create policy "games_public_read"
  on public.games
  for select
  to anon, authenticated
  using (true);

create policy "games_authenticated_write"
  on public.games
  for all
  to authenticated
  using (true)
  with check (true);

create policy "gallery_images_public_read"
  on public.gallery_images
  for select
  to anon, authenticated
  using (true);

create policy "gallery_images_authenticated_write"
  on public.gallery_images
  for all
  to authenticated
  using (true)
  with check (true);

create policy "impact_stats_public_read"
  on public.impact_stats
  for select
  to anon, authenticated
  using (true);

create policy "impact_stats_authenticated_write"
  on public.impact_stats
  for all
  to authenticated
  using (true)
  with check (true);

insert into public.games (
  id,
  slug,
  name,
  description,
  age_group,
  start_time,
  status,
  capacity,
  registered_count
) values
  (
    'sack-race',
    'sack-race',
    'Sack Race',
    'Hop your way to the finish line with speed, balance, and a big smile.',
    'Ages 6-10',
    '10:00 AM',
    'active',
    80,
    0
  ),
  (
    'tug-of-war',
    'tug-of-war',
    'Tug of War',
    'Team up with friends and pull together to win this classic strength challenge.',
    'Ages 8-14',
    '11:00 AM',
    'active',
    60,
    0
  ),
  (
    'sprint-50m',
    'sprint-50m',
    '50-Meter Sprint',
    'A quick burst of speed where every second counts on the track.',
    'Ages 6-14',
    '12:00 PM',
    'active',
    100,
    0
  ),
  (
    'relay-race',
    'relay-race',
    'Relay Race',
    'Pass the baton, cheer your team, and race to victory together.',
    'Ages 8-14',
    '1:00 PM',
    'active',
    120,
    0
  ),
  (
    'musical-chairs',
    'musical-chairs',
    'Musical Chairs',
    'A fun and fast-paced game of rhythm, reflexes, and laughter.',
    'Ages 5-12',
    '2:00 PM',
    'active',
    90,
    0
  )
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  age_group = excluded.age_group,
  start_time = excluded.start_time,
  status = excluded.status,
  capacity = excluded.capacity;

insert into public.gallery_images (id, url, alt, caption, sort_order) values
  (
    'gallery-1',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    'Children running during school sports day',
    null,
    1
  ),
  (
    'gallery-2',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    'Kids celebrating a race win together',
    null,
    2
  ),
  (
    'gallery-3',
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80',
    'Children practicing relay handoff',
    null,
    3
  ),
  (
    'gallery-4',
    'https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'Young athletes warming up outdoors',
    null,
    4
  ),
  (
    'gallery-5',
    'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'Group of children participating in games',
    null,
    5
  ),
  (
    'gallery-6',
    'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80',
    'Parents cheering from the sidelines',
    null,
    6
  ),
  (
    'gallery-7',
    'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'Sports cones and equipment on field',
    null,
    7
  ),
  (
    'gallery-8',
    'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
    'Children having fun in team activities',
    null,
    8
  )
on conflict (id) do update
set
  url = excluded.url,
  alt = excluded.alt,
  caption = excluded.caption,
  sort_order = excluded.sort_order;

insert into public.impact_stats (id, stat_key, value, label, sort_order) values
  ('children', 'children_participating', '500+', 'Children Participating', 1),
  ('games', 'games_activities', '15+', 'Games & Activities', 2),
  ('volunteers', 'community_volunteers', '80+', 'Community Volunteers', 3),
  ('schools', 'schools_represented', '20+', 'Schools Represented', 4)
on conflict (id) do update
set
  stat_key = excluded.stat_key,
  value = excluded.value,
  label = excluded.label,
  sort_order = excluded.sort_order;
