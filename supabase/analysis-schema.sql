-- Extensión de la tabla `cases` para guardar el análisis del backend.
-- Ejecuta este archivo en el SQL Editor del dashboard de Supabase.
-- Es idempotente.

alter table public.cases
  add column if not exists analysis_status text not null default 'pending',
  add column if not exists analysis        jsonb,
  add column if not exists memo_markdown   text,
  add column if not exists analysis_error  text;

-- Restringe los valores posibles de analysis_status.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'cases_analysis_status_chk'
  ) then
    alter table public.cases
      add constraint cases_analysis_status_chk
      check (analysis_status in ('pending', 'done', 'error'));
  end if;
end $$;

create index if not exists cases_analysis_status_idx
  on public.cases (analysis_status);
