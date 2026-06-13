-- Allow donation interest leads with email or phone contact
alter table public.inquiry_leads drop constraint if exists inquiry_leads_type_check;

alter table public.inquiry_leads
  add constraint inquiry_leads_type_check
  check (type in ('partner', 'volunteer', 'donate'));

alter table public.inquiry_leads alter column email drop not null;

insert into public.site_settings (key, value, section) values
  ('donate_url', '/donate', 'org_support')
on conflict (key) do update
set
  value = excluded.value,
  section = excluded.section;
