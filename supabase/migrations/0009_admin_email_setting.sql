insert into public.site_settings (key, value, section) values
  ('admin_email', 'hello@khelgramfoundation.org', 'site')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
