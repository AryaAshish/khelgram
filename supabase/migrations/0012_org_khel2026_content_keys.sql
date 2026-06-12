-- Split CMS keys: organization (org_*) vs Khel 2026 event (khel2026_*)
insert into public.site_settings (key, value, section) values
  (
    'org_about_title',
    coalesce((select value from public.site_settings where key = 'about_title'), 'About Khelgram Foundation'),
    'org_about'
  ),
  (
    'org_about_mission',
    'To discover, train, and champion sporting talent in rural India — building confidence, health, and opportunity village by village.',
    'org_about'
  ),
  (
    'org_about_vision',
    'A nation where every child in every village can play, compete, and grow through sport with dignity and support.',
    'org_about'
  ),
  (
    'org_about_values',
    'Grassroots First
Inclusive Play
Community Partnership
Long-term Nurturing',
    'org_about'
  ),
  ('org_impact_title', coalesce((select value from public.site_settings where key = 'impact_title'), 'Impact'), 'org_sections'),
  (
    'khel2026_hero_title',
    coalesce((select value from public.site_settings where key = 'hero_title'), 'Khelgram Foundation Children''s Sports Festival 2026'),
    'khel2026'
  ),
  (
    'khel2026_hero_subtitle',
    coalesce((select value from public.site_settings where key = 'hero_subtitle'), 'A joyful celebration of young athletes.'),
    'khel2026'
  ),
  (
    'khel2026_hero_primary_cta',
    coalesce((select value from public.site_settings where key = 'hero_primary_cta'), 'Register Now'),
    'khel2026'
  ),
  (
    'khel2026_hero_secondary_cta',
    coalesce((select value from public.site_settings where key = 'hero_secondary_cta'), 'Explore Events'),
    'khel2026'
  ),
  (
    'khel2026_hero_event_date_label',
    coalesce((select value from public.site_settings where key = 'hero_event_date_label'), 'Festival Date'),
    'khel2026'
  ),
  (
    'khel2026_hero_event_date',
    coalesce((select value from public.site_settings where key = 'hero_event_date'), 'March 20, 2026'),
    'khel2026'
  ),
  (
    'khel2026_countdown_title',
    coalesce((select value from public.site_settings where key = 'countdown_title'), 'Countdown to Festival Day'),
    'khel2026_countdown'
  ),
  (
    'khel2026_countdown_tba_text',
    coalesce((select value from public.site_settings where key = 'countdown_tba_text'), 'To Be Announced'),
    'khel2026_countdown'
  ),
  (
    'khel2026_events_title',
    coalesce((select value from public.site_settings where key = 'events_title'), 'Festival Events'),
    'khel2026_events'
  ),
  (
    'khel2026_gallery_title',
    coalesce((select value from public.site_settings where key = 'gallery_title'), 'Gallery'),
    'khel2026_gallery'
  ),
  (
    'khel2026_register_title',
    coalesce((select value from public.site_settings where key = 'register_title'), 'Register Your Child'),
    'khel2026_register'
  ),
  (
    'khel2026_register_pre_message',
    coalesce((select value from public.site_settings where key = 'register_pre_message'), 'Pre-registration open — we''ll confirm dates by email'),
    'khel2026_register'
  ),
  (
    'khel2026_register_submit_label',
    coalesce((select value from public.site_settings where key = 'register_submit_label'), 'Submit Registration'),
    'khel2026_register'
  ),
  (
    'khel2026_faq_title',
    coalesce((select value from public.site_settings where key = 'faq_title'), 'FAQ'),
    'khel2026_faq'
  )
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
