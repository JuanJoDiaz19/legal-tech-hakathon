-- Persistencia del chat "Consultar análisis" por caso.
-- Cada fila es un mensaje (del abogado o del asistente) asociado a un caso.
-- Ejecuta este archivo en el SQL Editor del dashboard de Supabase.
-- Es idempotente.

create extension if not exists "pgcrypto";

create table if not exists public.case_chat_messages (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  role        text not null,
  content     text not null,
  created_by  uuid not null references auth.users(id) on delete restrict,
  created_at  timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'case_chat_messages_role_chk'
  ) then
    alter table public.case_chat_messages
      add constraint case_chat_messages_role_chk
      check (role in ('user', 'assistant'));
  end if;
end $$;

create index if not exists case_chat_messages_case_id_idx
  on public.case_chat_messages (case_id, created_at);

alter table public.case_chat_messages enable row level security;

-- Todo el equipo autenticado puede leer la conversación de cualquier caso.
drop policy if exists "case_chat_select_authenticated" on public.case_chat_messages;
create policy "case_chat_select_authenticated"
  on public.case_chat_messages for select
  to authenticated
  using (true);

-- Solo el usuario autenticado puede insertar, y debe quedar como autor.
drop policy if exists "case_chat_insert_self" on public.case_chat_messages;
create policy "case_chat_insert_self"
  on public.case_chat_messages for insert
  to authenticated
  with check (created_by = auth.uid());

-- Solo el autor puede borrar sus mensajes.
drop policy if exists "case_chat_delete_owner" on public.case_chat_messages;
create policy "case_chat_delete_owner"
  on public.case_chat_messages for delete
  to authenticated
  using (created_by = auth.uid());