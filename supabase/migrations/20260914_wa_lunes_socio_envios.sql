-- Propósito: registrar el mensaje de los lunes de Queswa a cada distribuidor
--            (src/lib/wa-lunes-socio.ts) — un envío por socio y semana ISO.
-- Fecha: 2026-09-14
create table if not exists public.wa_lunes_socio_envios (
  id uuid primary key default gen_random_uuid(),
  constructor_id text not null,
  telefono text not null,
  semana text not null,                       -- '2026-W38' (Bogotá)
  via text not null check (via in ('texto', 'plantilla')),
  wamid text,
  ok boolean not null default true,
  error text,
  created_at timestamptz not null default now()
);
-- Un envío logrado por socio y semana; los fallidos no bloquean el reintento.
create unique index if not exists wa_lunes_socio_envios_unico_ok
  on public.wa_lunes_socio_envios (constructor_id, semana) where ok;
create index if not exists wa_lunes_socio_envios_constructor_idx
  on public.wa_lunes_socio_envios (constructor_id, created_at desc);
alter table public.wa_lunes_socio_envios enable row level security;
-- Solo el service role escribe y lee (el cron y el script); ninguna política pública.
select count(*) as filas from public.wa_lunes_socio_envios;
