-- Copyright © 2026 CreaTuActivo.com
--
-- page_visits: desde qué dispositivo se abre Queswa y a dónde lleva (13 oct 2026).
--
-- Decisión del Director, 13 oct 2026 (caso Wilson Romero): en el computador,
-- Queswa conversa en creatuactivo.com; en el celular y la tableta, sigue en
-- WhatsApp. Para saber si la decisión funciona hay que medir cada apertura por
-- dispositivo — el enlace del socio (/{slug}/queswa y los de los videos) y los
-- botones y el orbe del sitio.
--
--   dispositivo  'celular' | 'tableta' | 'computador'   (src/lib/dispositivo.ts)
--   sistema      'Android' | 'iOS' | 'Windows' | 'macOS' | 'ChromeOS' | 'Linux' | 'otro'
--   destino      'whatsapp' | 'web'   — a dónde llevó la apertura
--   origen       'enlace' | 'orbe' | 'boton' | 'video'
--   visitante    la cookie de un año del navegador (nexus_prospect_id, ck_…):
--                une la apertura con la ficha web (prospects.cookie_id) y con la
--                de WhatsApp (device_info.web_cookie), y por ahí con la conversación.
--
-- Las filas anteriores a esta fecha quedan con estas columnas en null.

alter table public.page_visits
  add column if not exists dispositivo text,
  add column if not exists sistema text,
  add column if not exists destino text,
  add column if not exists origen text,
  add column if not exists visitante text;

create index if not exists page_visits_visitante_idx on public.page_visits (visitante);
