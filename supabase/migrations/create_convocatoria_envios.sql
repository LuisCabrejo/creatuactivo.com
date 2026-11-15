-- Propósito: el registro de cada WhatsApp que Queswa envía para una convocatoria de
--            /vip (taller del 16 nov 2026): la invitación a los distribuidores y la
--            confirmación con el enlace a los inscritos. Sirve para no repetirle a
--            nadie y para ver qué falló. Lo escribe /api/mesa/whatsapp.
-- Quién lee y escribe: solo el servidor (service role). RLS cerrado, sin políticas.
-- Fecha: 2026-11-15
-- Reversa: drop table public.convocatoria_envios;

create table if not exists public.convocatoria_envios (
  evento text not null,                 -- Mesa.id
  plantilla text not null,              -- invitacion_taller_v1, confirmacion_evento_v1
  whatsapp text not null,               -- solo dígitos
  nombre text,
  constructor_id text,
  estado text not null,                 -- enviado | fallo
  error text,
  message_id text,
  enviado_at timestamptz not null default now(),
  primary key (evento, plantilla, whatsapp)
);

alter table public.convocatoria_envios enable row level security;

-- Verificación
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'convocatoria_envios' order by ordinal_position;
