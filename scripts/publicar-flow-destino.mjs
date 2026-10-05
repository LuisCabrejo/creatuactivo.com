/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Crea (la primera vez) o actualiza y publica el Flow «Su destino» — el
 * formulario del MODO WAZE (5 oct 2026, Director).
 *
 * Tres casillas —lo que necesita al mes, la vida que quiere y su razón— que el
 * socio llena sin salir de WhatsApp. Al guardar, el webhook escribe en
 * `socio_referencias`, la misma tabla que lee el Dashboard: queda aplicado en
 * sus Ajustes de Cuenta en ese instante (nodo 1.391, `guardarDestinoSocio`).
 *
 * ⚠️ Límites que Meta no siempre revisa al publicar y el teléfono sí: rótulo de
 * TextInput/TextArea ≤ 20 caracteres, ayuda ≤ 80, id de pantalla sin dígitos.
 * El JSON versionado vive en docs/handoff/queswa/flows/destino-socio.flow.json —
 * el constructor de Meta no es fuente versionada.
 *
 * Uso:
 *   node scripts/publicar-flow-destino.mjs --dry   # valida los límites sin subir
 *   node scripts/publicar-flow-destino.mjs         # crea o actualiza, y publica
 */

import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const WABA_ID = process.env.WHATSAPP_WABA_ID;
// v2 (5 oct 2026): con las explicaciones completas de Ajustes de Cuenta. Nombre
// nuevo a propósito: WhatsApp guarda en el teléfono el formulario que ya abrió, y
// el Director siguió viendo la versión corta tras republicar `destino_socio`. Un
// identificador nuevo no tiene nada guardado en ningún teléfono.
const NOMBRE  = 'destino_socio_v2';
const RUTA    = 'docs/handoff/queswa/flows/destino-socio.flow.json';

if (!TOKEN || !WABA_ID) { console.error('❌ Faltan WHATSAPP_SYSTEM_TOKEN o WHATSAPP_WABA_ID'); process.exit(1); }

const crudo = fs.readFileSync(RUTA, 'utf8');
const flow = JSON.parse(crudo);

const problemas = [];
(function revisar(n) {
  if (Array.isArray(n)) return n.forEach(revisar);
  if (!n || typeof n !== 'object') return;
  if ((n.type === 'TextInput' || n.type === 'TextArea') && (n.label || '').length > 20) problemas.push(`rótulo «${n.label}» (${n.label.length})`);
  if ((n['helper-text'] || '').length > 80) problemas.push(`ayuda «${n['helper-text']}» (${n['helper-text'].length})`);
  Object.values(n).forEach(revisar);
})(flow.screens);
for (const s of flow.screens) if (/\d/.test(s.id)) problemas.push(`pantalla ${s.id} con dígitos`);
if (problemas.length) { console.error('❌ Fuera de límite:\n  ' + problemas.join('\n  ')); process.exit(1); }
console.log('✅ JSON dentro de los límites');
if (process.argv.includes('--dry')) process.exit(0);

const h = { Authorization: `Bearer ${TOKEN}` };

// ¿Ya existe? Se busca por nombre en el WABA.
const lista = await fetch(`${GRAPH}/${WABA_ID}/flows?fields=id,name,status&limit=100`, { headers: h }).then(r => r.json());
let id = (lista.data || []).find(f => f.name === NOMBRE)?.id;
if (!id) {
  const r = await fetch(`${GRAPH}/${WABA_ID}/flows`, {
    method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: NOMBRE, categories: ['OTHER'] }),
  });
  const j = await r.json();
  if (!r.ok) { console.error('❌ No se pudo crear:', JSON.stringify(j.error || j, null, 2)); process.exit(1); }
  id = j.id;
  console.log(`✅ Flow creado: ${id}`);
}

const form = new FormData();
form.append('name', 'flow.json');
form.append('asset_type', 'FLOW_JSON');
form.append('file', new Blob([crudo], { type: 'application/json' }), 'flow.json');
const rs = await fetch(`${GRAPH}/${id}/assets`, { method: 'POST', headers: h, body: form });
const js = await rs.json();
if (!rs.ok) { console.error('❌ Meta rechazó el JSON:', JSON.stringify(js.error || js, null, 2)); process.exit(1); }
if (js.validation_errors?.length) { console.error('❌ Errores de validación:', JSON.stringify(js.validation_errors, null, 2)); process.exit(1); }
console.log('✅ JSON subido');

const rp = await fetch(`${GRAPH}/${id}/publish`, { method: 'POST', headers: h });
const jp = await rp.json();
if (!rp.ok) { console.error('❌ No se pudo publicar:', JSON.stringify(jp.error || jp, null, 2)); process.exit(1); }

const e = await fetch(`${GRAPH}/${id}?fields=name,status,validation_errors,preview.invalidate(true)`, { headers: h }).then(r => r.json());
console.log(`✅ «${e.name}» ${e.status} · id ${id}`);
if (e.preview?.preview_url) console.log(`👀 Vista previa: ${e.preview.preview_url}`);
