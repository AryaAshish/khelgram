insert into public.site_settings (key, value, section) values
  ('support_visible', 'true', 'sections'),
  ('support_title', 'Support Our Mission', 'org_support'),
  ('support_description', 'Your contribution helps us run grassroots sports programs, training camps, and inclusive events across rural communities.', 'org_support'),
  ('donate_url', 'https://khelgram.org/donate', 'org_support'),
  ('donate_qr_image', '', 'org_support'),
  ('support_funds_usage', 'Equipment and coaching\nVillage outreach camps\nScholarships for talented athletes', 'org_support')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
