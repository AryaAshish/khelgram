insert into public.site_settings (key, value, section) values
  ('hero_primary_cta', 'Register Now', 'hero'),
  ('hero_secondary_cta', 'Explore Events', 'hero'),
  ('hero_event_date_label', 'Festival Date', 'hero'),
  ('hero_event_date', 'March 20, 2026', 'hero'),
  ('countdown_title', 'Countdown to Festival Day', 'countdown'),
  ('countdown_tba_text', 'To Be Announced', 'countdown'),
  ('about_title', 'About Khelgram Foundation', 'about'),
  (
    'about_mission',
    'To create a safe, inclusive, and inspiring sports platform where every child can discover confidence, discipline, and teamwork.',
    'about'
  ),
  (
    'about_vision',
    'To become the most trusted community-led movement that nurtures young talent through joyful sports experiences.',
    'about'
  ),
  (
    'about_values',
    'Inclusion First
Play with Respect
Team Spirit
Healthy Competition',
    'about'
  ),
  ('events_title', 'Festival Events', 'events'),
  ('gallery_title', 'Gallery', 'gallery'),
  ('register_title', 'Register Your Child', 'register'),
  (
    'register_pre_message',
    'Pre-registration open — we''ll confirm dates by email',
    'register'
  ),
  ('register_submit_label', 'Submit Registration', 'register'),
  ('contact_title', 'Contact', 'contact'),
  ('contact_address', 'Khelgram Community Ground, Jaipur, Rajasthan', 'contact'),
  ('contact_phone', '+91 98765 43210', 'contact'),
  ('contact_email', 'hello@khelgramfoundation.org', 'contact'),
  (
    'footer_description',
    'Khelgram Foundation empowers children through sports, confidence building, and community-driven events.',
    'footer'
  )
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
