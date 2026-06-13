-- Seed credibility content so public fixture fallbacks match editable admin records.
insert into public.team_members (id, name, role, bio, photo_url, published, sort_order) values
  (
    'team-1',
    'Priya Sharma',
    'Program Director',
    'Leads festival operations and volunteer coordination.',
    null,
    true,
    0
  )
on conflict (id) do update
set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  photo_url = excluded.photo_url,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.contributors (id, name, contribution, photo_url, sort_order) values
  (
    'contributor-1',
    'Local Schools Network',
    'Venue and volunteer support',
    null,
    0
  )
on conflict (id) do update
set
  name = excluded.name,
  contribution = excluded.contribution,
  photo_url = excluded.photo_url,
  sort_order = excluded.sort_order;

insert into public.sponsors (id, name, tier, logo_url, website, sort_order) values
  (
    'sponsor-1',
    'Greenfield Sports',
    'platinum',
    null,
    'https://example.com',
    0
  )
on conflict (id) do update
set
  name = excluded.name,
  tier = excluded.tier,
  logo_url = excluded.logo_url,
  website = excluded.website,
  sort_order = excluded.sort_order;

insert into public.testimonials (id, quote, author, relation, photo_url, sort_order) values
  (
    'testimonial-1',
    'My daughter gained so much confidence after participating.',
    'Anita Mehta',
    'Parent',
    null,
    0
  )
on conflict (id) do update
set
  quote = excluded.quote,
  author = excluded.author,
  relation = excluded.relation,
  photo_url = excluded.photo_url,
  sort_order = excluded.sort_order;
