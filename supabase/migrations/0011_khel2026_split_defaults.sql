insert into public.site_settings (key, value, section) values
  ('org_hero_visible', 'true', 'org'),
  ('org_hero_title', 'Building sporting futures in rural India', 'org'),
  (
    'org_hero_subtitle',
    'Khelgram Foundation discovers and nurtures grassroots talent in villages and underserved communities through sports programs, training, and inclusive events.',
    'org'
  ),
  ('org_hero_primary_cta', 'Our impact', 'org'),
  ('org_hero_secondary_cta', 'Khel 2026', 'org'),
  ('khel2026_hero_visible', 'true', 'khel2026'),
  ('khel2026_countdown_visible', 'true', 'khel2026'),
  ('khel2026_events_visible', 'true', 'khel2026'),
  ('khel2026_gallery_visible', 'true', 'khel2026'),
  ('khel2026_register_cta_visible', 'true', 'khel2026'),
  ('khel2026_faq_visible', 'true', 'khel2026'),
  ('countdown_visible', 'false', 'sections'),
  ('events_visible', 'false', 'sections'),
  ('register_visible', 'false', 'sections'),
  ('hero_visible', 'false', 'sections')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
