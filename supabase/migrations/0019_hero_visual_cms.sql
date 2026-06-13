-- Optional CMS image overrides for public hero/about visuals (Phase 30)
INSERT INTO site_settings (key, value, section)
VALUES
  ('org_hero_image', '', 'org'),
  ('khel2026_hero_image', '', 'khel2026'),
  ('org_about_image', '', 'org_about')
ON CONFLICT (key) DO NOTHING;
