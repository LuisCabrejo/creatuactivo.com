-- ─────────────────────────────────────────────────────────────────────────────
-- wa_lista_socio — la lista de contactos que el socio va a abordar
--
-- POR QUÉ EXISTE. El proceso de campo del Director, cuando alguien arranca, es
-- una sola pregunta:
--
--   «Hagamos una lista de cinco a diez personas a las que usted invitaría a tomar
--    un café y que no le van a preguntar para qué.»
--
-- Es la mejor pregunta de todo el método y no está construida en ninguna parte.
-- Identifica, sin nombrarla, la relación COMUNAL —la que se sostiene en el
-- vínculo y no en el intercambio—, que es justo donde la confianza se transfiere.
-- Y evita la lista de cien nombres, que paraliza a cualquiera.
--
-- Hoy esa lista se hace en papel o no se hace. Queswa la guarda y la trabaja de a
-- uno: pide el contexto de la primera, redacta, y cuando el socio dice que ya la
-- mandó, pasa a la siguiente. Sin esto el socio le da un nombre suelto y nadie
-- lleva la cuenta de a quién falta — que es exactamente la razón por la que la
-- gente arranca y se detiene a los tres contactos.
--
-- ⚠️ NO es un CRM. No hay etapas ni puntajes: hay nombres, contexto y si ya se
-- escribió o no. Todo lo demás vive en `wa_acuerdos` y en el Dashboard.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists wa_lista_socio (
  id              bigserial primary key,

  -- De quién es la lista. El socio se identifica por su fingerprint del canal,
  -- que es como lo conoce el webhook; constructor_id queda para el Dashboard.
  socio_fp        text not null,
  constructor_id  text,

  -- El nombre tal como el socio lo dijo. No se normaliza: «mi compadre Beto» es
  -- como él lo tiene en la cabeza, y devolvérselo así es lo que hace que
  -- reconozca su propia lista.
  nombre          text not null,

  -- Lo que el socio contó de esa persona. Es la materia prima del mensaje: sin
  -- esto no hay primer golpe, y sin primer golpe el mensaje se lee como cadena.
  contexto        text,

  -- Cómo se tratan los dos. Decide el pronombre del mensaje — y esa es una
  -- excepción deliberada al «usted siempre» del canal: el texto lo firma el
  -- socio, no Queswa, y si no suena a él se pierde la transferencia de confianza.
  trato           text check (trato in ('tu', 'usted')),

  estado          text not null default 'pendiente'
                  check (estado in ('pendiente', 'redactado', 'enviado', 'respondio', 'descartado')),

  -- El orden en que el socio los nombró. Se respeta: el primero que dice suele
  -- ser el que tiene más presente, y trabajar por ahí es lo que da el primer sí.
  orden           int not null default 0,

  creado_at       timestamptz not null default now(),
  enviado_at      timestamptz,
  nota            text
);

create index if not exists wa_lista_socio_pendientes
  on wa_lista_socio (socio_fp, orden)
  where estado = 'pendiente';

-- Un nombre no se repite en la lista de un mismo socio. Si lo vuelve a dictar,
-- se actualiza el que ya está en vez de crear un duplicado.
create unique index if not exists wa_lista_socio_sin_repetidos
  on wa_lista_socio (socio_fp, lower(nombre));

alter table wa_lista_socio enable row level security;
drop policy if exists wa_lista_socio_service on wa_lista_socio;
create policy wa_lista_socio_service on wa_lista_socio
  for all to service_role using (true) with check (true);

comment on table  wa_lista_socio is 'La lista del café: a quién va a abordar el socio, en su orden.';
comment on column wa_lista_socio.trato is 'tu | usted — decide el pronombre del mensaje que él firma.';
