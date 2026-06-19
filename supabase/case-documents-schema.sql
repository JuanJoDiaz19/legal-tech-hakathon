-- Persistencia de los documentos originales subidos a cada caso.
-- Ejecuta este archivo en el SQL Editor del dashboard de Supabase.
-- Es idempotente.

create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. Tabla case_documents
-- =============================================================================

create table if not exists public.case_documents (
  id            uuid primary key default gen_random_uuid(),
  case_id       uuid not null references public.cases(id) on delete cascade,
  categoria     text not null,
  storage_path  text not null,
  filename      text not null,
  mime_type     text,
  size_bytes    bigint,
  uploaded_by   uuid not null references auth.users(id) on delete restrict,
  created_at    timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'case_documents_categoria_chk'
  ) then
    alter table public.case_documents
      add constraint case_documents_categoria_chk
      check (categoria in ('demanda', 'pruebas', 'anexos', 'poderes'));
  end if;
end $$;

create index if not exists case_documents_case_id_idx
  on public.case_documents (case_id, categoria);
create index if not exists case_documents_uploaded_by_idx
  on public.case_documents (uploaded_by);

alter table public.case_documents enable row level security;

-- Todo el equipo autenticado puede ver los documentos.
drop policy if exists "case_documents_select_authenticated" on public.case_documents;
create policy "case_documents_select_authenticated"
  on public.case_documents for select
  to authenticated
  using (true);

-- Solo el usuario autenticado puede insertar, y debe ser él mismo el uploader.
drop policy if exists "case_documents_insert_self" on public.case_documents;
create policy "case_documents_insert_self"
  on public.case_documents for insert
  to authenticated
  with check (uploaded_by = auth.uid());

-- Solo quien lo subió puede borrar el registro.
drop policy if exists "case_documents_delete_owner" on public.case_documents;
create policy "case_documents_delete_owner"
  on public.case_documents for delete
  to authenticated
  using (uploaded_by = auth.uid());

-- =============================================================================
-- 2. Bucket privado en Storage
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('case-documents', 'case-documents', false)
on conflict (id) do update set public = false;

-- Lectura: cualquier usuario autenticado puede leer cualquier objeto del bucket.
drop policy if exists "case_documents_storage_select_authenticated" on storage.objects;
create policy "case_documents_storage_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'case-documents');

-- Escritura: usuario autenticado, escribiendo bajo el prefijo {auth.uid()}/.
drop policy if exists "case_documents_storage_insert_own_prefix" on storage.objects;
create policy "case_documents_storage_insert_own_prefix"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'case-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Borrado: solo el dueño del objeto.
drop policy if exists "case_documents_storage_delete_owner" on storage.objects;
create policy "case_documents_storage_delete_owner"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'case-documents'
    and owner = auth.uid()
  );
