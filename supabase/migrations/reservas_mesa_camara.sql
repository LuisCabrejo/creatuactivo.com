-- Propósito: guardar que la persona aceptó entrar con la cámara encendida (taller del
--            16 nov 2026, Director). Desde hoy /api/mesa lo exige en las
--            convocatorias en línea y guarda la hora. Las reservas anteriores lo
--            aceptaron en la página —la casilla era obligatoria desde el primer
--            registro real— pero el servidor no lo guardaba: se les pone la hora de
--            su reserva.
-- Fecha: 2026-11-15
-- Reversa: alter table public.reservas_mesa drop column camara_aceptada_at;

alter table public.reservas_mesa add column if not exists camara_aceptada_at timestamptz;

update public.reservas_mesa set camara_aceptada_at = created_at
where evento = 'taller-dos-socios-2026-11-16' and camara_aceptada_at is null;

-- Verificación
select count(*) total, count(camara_aceptada_at) con_camara
from public.reservas_mesa where evento = 'taller-dos-socios-2026-11-16';
