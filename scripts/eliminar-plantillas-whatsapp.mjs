/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Elimina plantillas del WABA por nombre — las que sobran tras un experimento de
 * categoría (Meta recategoriza sin avisar y la categoría de una aprobada no se
 * puede cambiar, así que cada intento deja una plantilla huérfana).
 *
 * ⛔ PROTEGIDAS: las que usa el Dashboard, el webhook o sirven de sonda no se
 * borran ni por error de tecleo — conviven `acceso_centro_mando` (huérfana) con
 * `acceso_centro_mando_v2` (en uso), y `enlace_canal_listo_v2` (huérfana) con
 * `enlace_canal_listo` (en uso). Si una protegida deja de usarse, se quita de
 * la lista A PROPÓSITO, no se pasa por encima.
 *
 * ⚠️ Meta reserva el nombre de una plantilla borrada durante 30 días. Los
 * mensajes ya entregados con ella no se ven afectados.
 *
 * ⚠️ Requiere que el usuario del sistema tenga CONTROL TOTAL del WABA. Con el
 * permiso de solo gestión (`whatsapp_business_management`) Meta crea pero
 * devuelve `(#100) Need permission on either WhatsApp Business Account or
 * owner/shared business` al borrar — en ese caso, a mano en WhatsApp Manager:
 * https://business.facebook.com/wa/manage/message-templates/?business_id=2440608633047462&waba_id=1436663504253230
 *
 * Uso:
 *   node scripts/eliminar-plantillas-whatsapp.mjs --dry nombre1 nombre2   # muestra qué borraría
 *   node scripts/eliminar-plantillas-whatsapp.mjs nombre1 nombre2         # borra
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });

const GRAPH   = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;

const PROTEGIDAS = new Set([
  'codigo_centro_mando',      // Dashboard — código de acceso (AUTHENTICATION)
  'acceso_centro_mando_v2',   // Dashboard — enlace de acceso (UTILITY)
  'pre_afiliacion_nueva',     // Dashboard → aviso al socio y al equipo
  'enlace_canal_listo',       // webhook ACTIVAR fuera de ventana (la elegida, 22 ago 2026)
  'hello_world',              // sonda de Meta — verificó el nombre «Queswa»
]);

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID / WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const args    = process.argv.slice(2);
const DRY     = args.includes('--dry');
const nombres = args.filter((a) => !a.startsWith('--'));

if (!nombres.length) {
  console.error('Uso: node scripts/eliminar-plantillas-whatsapp.mjs [--dry] nombre1 nombre2 …');
  process.exit(1);
}

const res  = await fetch(`${GRAPH}/${WABA_ID}/message_templates?fields=name,status,category&limit=100`,
  { headers: { Authorization: `Bearer ${TOKEN}` } });
const data = await res.json();
if (!res.ok) { console.error('❌ Meta:', JSON.stringify(data.error ?? data)); process.exit(1); }
const existentes = new Map((data.data ?? []).map((t) => [t.name, t]));

let fallos = 0;
for (const nombre of nombres) {
  if (PROTEGIDAS.has(nombre)) {
    console.log(`⛔ ${nombre} — PROTEGIDA, no se toca (quítela de PROTEGIDAS a propósito si de verdad sobra)`);
    fallos++; continue;
  }
  const t = existentes.get(nombre);
  if (!t) { console.log(`ℹ️  ${nombre} — no existe en el WABA`); continue; }
  if (DRY) { console.log(`🟡 ${nombre} — se borraría (${t.status} · ${t.category})`); continue; }

  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${encodeURIComponent(nombre)}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json();
  if (r.ok && j.success !== false) {
    console.log(`🗑️  ${nombre} — eliminada (${t.status} · ${t.category})`);
  } else {
    console.log(`❌ ${nombre} — Meta no la borró: ${j.error?.message ?? JSON.stringify(j)}`);
    fallos++;
  }
}
process.exit(fallos ? 1 : 0);
