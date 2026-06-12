insert into public.site_settings (key, value, section) values
  ('hero_visible', 'true', 'sections'),
  ('countdown_visible', 'true', 'sections'),
  ('about_visible', 'true', 'sections'),
  ('impact_visible', 'true', 'sections'),
  ('events_visible', 'true', 'sections'),
  ('team_visible', 'true', 'sections'),
  ('contributors_visible', 'true', 'sections'),
  ('sponsors_visible', 'true', 'sections'),
  ('gallery_visible', 'true', 'sections'),
  ('testimonials_visible', 'true', 'sections'),
  ('register_visible', 'true', 'sections'),
  ('faq_visible', 'true', 'sections'),
  ('contact_visible', 'true', 'sections'),
  ('footer_visible', 'true', 'sections'),
  ('impact_title', 'Impact', 'sections'),
  ('team_title', 'Our Team', 'sections'),
  ('contributors_title', 'Contributors', 'sections'),
  ('sponsors_title', 'Sponsors', 'sections'),
  ('testimonials_title', 'Testimonials', 'sections'),
  ('faq_title', 'FAQ', 'sections')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
