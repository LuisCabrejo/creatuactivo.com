-- Propósito: los invitados de una convocatoria en línea (taller del 16 nov 2026).
--            `invitado_de` guarda el constructor_id del socio que invitó (llega
--            por su enlace, creatuactivo.com/{slug}/taller) o, si la persona lo
--            escribió a mano, el nombre que escribió con el prefijo «texto:».
--            Vacío = distribuidor. Los invitados ocupan los puestos 101 en
--            adelante (cupo aparte; ver src/lib/mesas.ts).
-- Fecha: 2026-11-15
-- Reversa: alter table public.reservas_mesa drop column invitado_de;

alter table public.reservas_mesa add column if not exists invitado_de text
  check (invitado_de is null or char_length(invitado_de) between 2 and 90);

-- Verificación
select column_name, data_type from information_schema.columns
where table_schema = 'public' and table_name = 'reservas_mesa' order by ordinal_position;
