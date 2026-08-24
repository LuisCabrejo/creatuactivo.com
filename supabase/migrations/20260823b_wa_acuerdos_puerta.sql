-- ─────────────────────────────────────────────────────────────────────────────
-- La PUERTA ABIERTA — el permiso que queda después de un «no»
--
-- Técnica de campo del Director. Cuando ya es evidente que no hay nada que hacer:
--
--   «Soy enemigo del spam y de que lo persigan a uno. Pero si llego a tener algo
--    demasiado relevante, ¿le parece bien que se lo comparta?»
--
-- El 100% dice que sí. Y el caso que lo justifica: Patricia dijo que no era lo
-- suyo, quedó la puerta abierta, meses después la despidieron de Ecopetrol — hoy
-- es rango bronce. Lo que cambió no fue su interés: fue su momento. Eso no se
-- acelera, solo se puede estar ahí cuando pase.
--
-- ⚠️ POR QUÉ `cuando` PASA A SER NULO. Una cita tiene fecha; una puerta abierta no
-- la tiene, porque su disparador no es un reloj sino un hecho que no controlamos
-- —que aparezca algo que de verdad valga la pena—. Por eso el cron NO la dispara:
-- una puerta abierta es un permiso guardado que se consulta, no un envío agendado.
-- Automatizarla la convertiría en la cadena de la que el Director se declara
-- enemigo en la propia frase con que la pide.
-- ─────────────────────────────────────────────────────────────────────────────

alter table wa_acuerdos
  add column if not exists tipo text not null default 'cita'
  check (tipo in ('cita', 'puerta_abierta'));

alter table wa_acuerdos alter column cuando drop not null;

-- Coherencia: una cita SIEMPRE lleva fecha; una puerta abierta NUNCA.
alter table wa_acuerdos drop constraint if exists wa_acuerdos_fecha_coherente;
alter table wa_acuerdos add constraint wa_acuerdos_fecha_coherente check (
  (tipo = 'cita'           and cuando is not null) or
  (tipo = 'puerta_abierta' and cuando is null)
);

-- ⚠️ El índice de un solo pendiente por persona se rehace para permitir UNA cita
-- y UNA puerta abierta a la vez. No son excluyentes: alguien puede quedar de
-- revisar el jueves Y haber dado permiso para el futuro.
drop index if exists wa_acuerdos_uno_activo;
create unique index if not exists wa_acuerdos_uno_por_tipo
  on wa_acuerdos (fingerprint_id, tipo)
  where estado = 'pendiente';

-- El cron solo mira citas con fecha vencida. Las puertas abiertas quedan fuera
-- por el `cuando is not null`, no por una condición que alguien pueda olvidar.
drop index if exists wa_acuerdos_por_vencer;
create index if not exists wa_acuerdos_por_vencer
  on wa_acuerdos (cuando)
  where estado = 'pendiente' and cuando is not null;

comment on column wa_acuerdos.tipo is 'cita = con fecha, la dispara el cron. puerta_abierta = permiso sin fecha, se consulta.';
