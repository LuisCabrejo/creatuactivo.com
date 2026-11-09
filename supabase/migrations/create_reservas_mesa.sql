-- Copyright © 2026 CreaTuActivo.com
-- Reservas de silla para las mesas privadas presenciales (/mesa/{evento}).
-- Primera: Villavicencio, martes 10 nov 2026, oficina de Gano Excel.
--
-- Una fila = una silla. La unicidad (evento, horario, silla) es la que reparte las
-- sillas: si dos personas tocan la misma a la vez, la segunda recibe 23505 y la ruta
-- le responde «ya la tomaron». Sin políticas: solo la llave de servidor lee y escribe
-- (el teléfono de cada persona no sale nunca a la página).
--
-- Cancelar una reserva: delete from reservas_mesa where id = '…';

create table if not exists public.reservas_mesa (
  id uuid primary key default gen_random_uuid(),
  evento text not null,
  horario text not null,
  silla smallint not null check (silla between 1 and 8),
  nombre text not null check (char_length(nombre) between 2 and 80),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,15}$'),
  created_at timestamptz not null default now(),
  unique (evento, horario, silla)
);

create index if not exists reservas_mesa_evento_idx on public.reservas_mesa (evento);

alter table public.reservas_mesa enable row level security;
