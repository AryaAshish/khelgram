insert into public.site_settings (key, value, section) values
  ('reach_visible', 'true', 'sections'),
  ('reach_title', 'Where We Work', 'org_reach'),
  ('org_regions', '[{"name":"Uttar Pradesh","states":["UP"],"description":"Grassroots discovery camps across eastern UP districts."},{"name":"Bihar","states":["BR"],"description":"School partnerships and girls inclusion programs."},{"name":"Rajasthan","states":["RJ"],"description":"Traditional sports revival and village tournaments."}]', 'org_reach')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
