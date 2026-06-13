-- Phase 18: scope org vs event impact stats + NGO metric reseed

alter table public.impact_stats
  add column if not exists scope text not null default 'org';

update public.impact_stats
set scope = 'event'
where id in ('children', 'games', 'volunteers', 'schools');

insert into public.impact_stats (id, stat_key, value, label, sort_order, scope) values
  ('org-villages', 'villages_reached', '120+', 'Villages Reached', 1, 'org'),
  ('org-athletes', 'athletes_in_programs', '2,500+', 'Athletes in Programs', 2, 'org'),
  ('org-equipment', 'equipment_provided', '800+', 'Equipment Kits Provided', 3, 'org'),
  ('org-girls', 'girls_participating', '45%', 'Girls Participating', 4, 'org')
on conflict (id) do update
set
  stat_key = excluded.stat_key,
  value = excluded.value,
  label = excluded.label,
  sort_order = excluded.sort_order,
  scope = excluded.scope;

insert into public.site_settings (key, value, section) values
  ('org_impact_subtitle', 'Long-term grassroots sports outcomes across rural communities.', 'org_impact')
on conflict (key) do update
set value = excluded.value, section = excluded.section;
