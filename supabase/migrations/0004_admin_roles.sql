create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;

grant select on public.admin_roles to authenticated;

create policy "admin_roles_read_own"
  on public.admin_roles
  for select
  to authenticated
  using (user_id = auth.uid());
