-- Tabla `cases` para el dashboard de Mobius.
-- Ejecuta este archivo en el SQL Editor del dashboard de Supabase.
-- Es idempotente.

create extension if not exists "pgcrypto";

create table if not exists public.cases (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  client      text,
  status      text not null default 'Activo',
  description text,
  created_by  uuid not null references auth.users(id) on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists cases_created_at_idx on public.cases (created_at desc);
create index if not exists cases_created_by_idx on public.cases (created_by);

alter table public.cases enable row level security;

-- Cualquier usuario autenticado del equipo HGD puede ver y crear casos.
-- (Los 4 correos preautorizados son los únicos que pueden autenticarse.)
drop policy if exists "cases_select_authenticated" on public.cases;
create policy "cases_select_authenticated"
  on public.cases for select
  to authenticated
  using (true);

drop policy if exists "cases_insert_authenticated" on public.cases;
create policy "cases_insert_authenticated"
  on public.cases for insert
  to authenticated
  with check (created_by = auth.uid());

-- Solo el creador puede editar/borrar su caso.
drop policy if exists "cases_update_owner" on public.cases;
create policy "cases_update_owner"
  on public.cases for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "cases_delete_owner" on public.cases;
create policy "cases_delete_owner"
  on public.cases for delete
  to authenticated
  using (created_by = auth.uid());

-- Trigger para mantener updated_at.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists cases_set_updated_at on public.cases;
create trigger cases_set_updated_at
  before update on public.cases
  for each row execute function public.set_updated_at();
