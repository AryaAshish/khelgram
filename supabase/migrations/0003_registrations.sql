create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  child_name text not null,
  age integer not null,
  parent_name text not null,
  email text not null,
  phone text not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table if not exists public.registration_games (
  registration_id uuid not null references public.registrations (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete restrict,
  status text not null default 'confirmed',
  primary key (registration_id, game_id)
);

create or replace function public.generate_registration_code()
returns text
language plpgsql
as $$
declare
  new_code text;
begin
  loop
    new_code := 'KG-2026-' || lpad(floor(random() * 100000)::text, 5, '0');
    exit when not exists (select 1 from public.registrations where code = new_code);
  end loop;
  return new_code;
end;
$$;

create or replace function public.set_registration_code()
returns trigger
language plpgsql
as $$
begin
  if new.code is null or new.code = '' then
    new.code := public.generate_registration_code();
  end if;
  return new;
end;
$$;

drop trigger if exists registrations_set_code on public.registrations;
create trigger registrations_set_code
  before insert on public.registrations
  for each row
  execute function public.set_registration_code();

create or replace function public.increment_game_registered_count()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'confirmed' then
    update public.games
    set registered_count = registered_count + 1
    where id = new.game_id;
  end if;
  return new;
end;
$$;

drop trigger if exists registration_games_increment_count on public.registration_games;
create trigger registration_games_increment_count
  after insert on public.registration_games
  for each row
  execute function public.increment_game_registered_count();

create or replace function public.get_registration_count()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.registrations;
$$;

create or replace function public.check_registration_duplicate(p_email text, p_game_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.registrations r
    inner join public.registration_games rg on rg.registration_id = r.id
    where lower(r.email) = lower(p_email)
      and rg.game_id = p_game_id
      and rg.status = 'confirmed'
  );
$$;

alter table public.registrations enable row level security;
alter table public.registration_games enable row level security;

grant insert on public.registrations to anon, authenticated;
grant insert on public.registration_games to anon, authenticated;
grant select on public.registrations to authenticated;
grant select on public.registration_games to authenticated;
grant execute on function public.get_registration_count() to anon, authenticated;
grant execute on function public.check_registration_duplicate(text, uuid) to anon, authenticated;

create policy "registrations_anon_insert"
  on public.registrations
  for insert
  to anon
  with check (true);

create policy "registrations_authenticated_all"
  on public.registrations
  for all
  to authenticated
  using (true)
  with check (true);

create policy "registration_games_anon_insert"
  on public.registration_games
  for insert
  to anon
  with check (true);

create policy "registration_games_authenticated_all"
  on public.registration_games
  for all
  to authenticated
  using (true)
  with check (true);
