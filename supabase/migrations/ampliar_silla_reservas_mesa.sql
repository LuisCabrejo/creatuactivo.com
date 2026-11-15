-- Propósito: las convocatorias EN LÍNEA de /vip (taller del 16 nov 2026, 30 cupos)
--            guardan el puesto en `silla`, y la restricción original (1 a 8) era
--            de la mesa presencial. Se amplía a 1–200; las reservas existentes
--            (Villavicencio, sillas 1 a 4) siguen cumpliendo.
-- Fecha: 2026-11-15
-- Reversa: alter table public.reservas_mesa drop constraint reservas_mesa_silla_check;
--          alter table public.reservas_mesa add constraint reservas_mesa_silla_check check (silla between 1 and 8);

alter table public.reservas_mesa drop constraint if exists reservas_mesa_silla_check;
alter table public.reservas_mesa
  add constraint reservas_mesa_silla_check check (silla between 1 and 200);

-- Verificación
select pg_get_constraintdef(oid) as def from pg_constraint
where conrelid = 'public.reservas_mesa'::regclass and conname = 'reservas_mesa_silla_check';
