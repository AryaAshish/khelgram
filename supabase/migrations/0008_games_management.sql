alter table public.games
  add column if not exists pre_registration_allowed boolean not null default true;

create or replace function public.adjust_game_registered_count_on_status_change()
returns trigger
language plpgsql
as $$
begin
  if old.status is distinct from new.status then
    if old.status = 'confirmed' and new.status <> 'confirmed' then
      update public.games
      set registered_count = greatest(registered_count - 1, 0)
      where id = new.game_id;
    elsif old.status <> 'confirmed' and new.status = 'confirmed' then
      update public.games
      set registered_count = registered_count + 1
      where id = new.game_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists registration_games_adjust_count on public.registration_games;
create trigger registration_games_adjust_count
  after update of status on public.registration_games
  for each row
  execute function public.adjust_game_registered_count_on_status_change();
