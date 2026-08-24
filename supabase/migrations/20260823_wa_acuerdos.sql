-- ─────────────────────────────────────────────────────────────────────────────
-- wa_acuerdos — lo que Queswa se comprometió a hacer, y cuándo
--
-- POR QUÉ EXISTE. La escalera del aplazamiento termina preguntando «¿qué día le
-- escribo para retomarlo?». Sin esta tabla esa frase se pierde en el hilo: se
-- promete y no se cumple, que es peor que no prometer.
--
-- Y no es solo higiene. Un recordatorio que la persona PIDIÓ es la reentrada de
-- mayor tolerancia que existe fuera de la ventana de 24 h, y la única con opción
-- real de calificar como plantilla de UTILITY —la categoría que sí se entrega a
-- números de Estados Unidos—. El acuerdo no es una técnica de cierre: es lo que
-- le compra a Queswa el permiso de volver.
--
-- Fundamento → docs/investigaciones/resultados/CIENCIA_CONDUCTUAL_SEGUIMIENTO_Y_ACUERDO_AGO2026.md
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists wa_acuerdos (
  id              bigserial primary key,

  -- A quién. El fingerprint es la llave del canal (wa_{telefono}); el teléfono
  -- se guarda aparte porque es lo que necesita la Graph API para enviar, y
  -- derivarlo del fingerprint en cada consulta es una fuente de errores.
  fingerprint_id  text not null,
  telefono        text not null,
  constructor_id  text,

  -- Qué se prometió, EN LAS PALABRAS DE ELLA. No una etiqueta ni una categoría:
  -- el recordatorio tiene que poder devolverle lo que ella misma dijo, y una
  -- categoría («seguimiento») no sirve para eso.
  que             text not null,

  -- Cuándo. Se guarda en UTC y se calcula en hora de Bogotá: la persona dice
  -- "el jueves a las 8" pensando en su reloj, no en el del servidor.
  cuando          timestamptz not null,

  estado          text not null default 'pendiente'
                  check (estado in ('pendiente', 'cumplido', 'cancelado', 'vencido')),

  -- Cuántas veces se intentó enviar. Un acuerdo que falla tres veces se marca
  -- 'vencido' y NO se reintenta: insistirle a quien no responde es exactamente
  -- lo que Meta lee como spam, y lo paga la calificación del número entero.
  intentos        int not null default 0,

  creado_at       timestamptz not null default now(),
  cumplido_at     timestamptz,
  nota            text
);

-- La consulta del cron: los que ya vencieron y siguen pendientes.
create index if not exists wa_acuerdos_por_vencer
  on wa_acuerdos (cuando)
  where estado = 'pendiente';

-- ⚠️ UN SOLO ACUERDO ACTIVO POR PERSONA. Sin esto se acumulan: la persona aplaza
-- tres veces y recibe tres recordatorios el mismo día. El acuerdo nuevo REEMPLAZA
-- al anterior (lo cancela), no se suma.
create unique index if not exists wa_acuerdos_uno_activo
  on wa_acuerdos (fingerprint_id)
  where estado = 'pendiente';

alter table wa_acuerdos enable row level security;

-- Solo el service role la toca: la escriben el webhook y el cron, nunca el
-- navegador. Sin política de lectura pública a propósito — aquí hay teléfonos.
drop policy if exists wa_acuerdos_service on wa_acuerdos;
create policy wa_acuerdos_service on wa_acuerdos
  for all to service_role using (true) with check (true);

comment on table  wa_acuerdos is 'Compromisos de seguimiento de Queswa. Un pendiente por persona.';
comment on column wa_acuerdos.que is 'Lo prometido, en las palabras de la persona.';
comment on column wa_acuerdos.cuando is 'UTC. Se calcula en hora de Bogotá.';
