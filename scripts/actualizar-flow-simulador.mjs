/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Sube a Meta el JSON del simulador de ingresos y lo republica.
 *
 * ⚠️ Actualizar los assets devuelve el Flow a DRAFT, así que SIEMPRE hay que
 * republicar después — un Flow en DRAFT no se le puede enviar a nadie. Este
 * script hace los dos pasos y verifica el estado final.
 *
 * ⚠️ La trampa que ya costó una salida a producción: las descripciones de
 * `NavigationList` admiten **máximo 20 caracteres**. El validador de publicación
 * de Meta NO lo revisa —el Flow queda PUBLISHED y con salud AVAILABLE— pero el
 * runtime del teléfono sí, y el Flow resulta imposible de abrir. Por eso este
 * script lo valida ANTES de subir.
 *
 * Para diagnosticar un Flow que publica pero no abre, la vista previa interactiva
 * muestra el error completo:
 *   GET /<FLOW_ID>?fields=preview.invalidate(true)
 *
 * Uso:
 *   node scripts/actualizar-flow-simulador.mjs --dry   # valida, no sube
 *   node scripts/actualizar-flow-simulador.mjs         # sube y republica
 */

import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const FLOW_ID = process.env.WHATSAPP_FLOW_SIMULADOR_ID;
const RUTA    = 'docs/handoff/queswa/flows/simulador-de-ingresos.flow.json';

if (!TOKEN || !FLOW_ID) {
  console.error('❌ Faltan WHATSAPP_SYSTEM_TOKEN o WHATSAPP_FLOW_SIMULADOR_ID');
  process.exit(1);
}

const crudo = fs.readFileSync(RUTA, 'utf8');
let flow;
try { flow = JSON.parse(crudo); }
catch (e) { console.error('❌ El JSON no es válido:', e.message); process.exit(1); }

// ─── Validación previa: el límite de 20 caracteres que Meta no revisa ─────────
const largos = [];
(function buscar(n, pantalla) {
  if (Array.isArray(n)) return n.forEach((x) => buscar(x, pantalla));
  if (n && typeof n === 'object') {
    if (n.type === 'NavigationList') {
      for (const item of n['list-items'] || []) {
        const d = item?.description || '';
        if (d.length > 20) largos.push(`${pantalla}: "${d}" (${d.length})`);
      }
    }
    for (const [k, v] of Object.entries(n)) buscar(v, n.id || pantalla);
  }
})(flow.screens, '');

if (largos.length) {
  console.error('❌ Descripciones de NavigationList de más de 20 caracteres:');
  largos.forEach((l) => console.error('   ' + l));
  console.error('\nMeta las acepta al publicar y el teléfono no las abre. Acórtelas antes de subir.');
  process.exit(1);
}

console.log(`✅ JSON válido · ${flow.screens.length} pantallas · descripciones dentro del límite`);

if (process.argv.includes('--dry')) {
  console.log('🟡 --dry: no se subió nada.');
  process.exit(0);
}

// ─── 1) Subir los assets (esto devuelve el Flow a DRAFT) ─────────────────────
const form = new FormData();
form.append('name', 'flow.json');
form.append('asset_type', 'FLOW_JSON');
form.append('file', new Blob([crudo], { type: 'application/json' }), 'flow.json');

const rSubir = await fetch(`${GRAPH}/${FLOW_ID}/assets`, {
  method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body: form,
});
const jSubir = await rSubir.json();
if (!rSubir.ok) {
  console.error('❌ Meta rechazó el JSON:', JSON.stringify(jSubir.error || jSubir, null, 2));
  process.exit(1);
}
if (jSubir.validation_errors?.length) {
  console.error('❌ Errores de validación:', JSON.stringify(jSubir.validation_errors, null, 2));
  process.exit(1);
}
console.log('✅ JSON subido — el Flow quedó en DRAFT');

// ─── 2) Republicar (sin esto el Flow no se le puede enviar a nadie) ──────────
const rPub = await fetch(`${GRAPH}/${FLOW_ID}/publish`, {
  method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` },
});
const jPub = await rPub.json();
if (!rPub.ok) {
  console.error('❌ No se pudo republicar:', JSON.stringify(jPub.error || jPub, null, 2));
  console.error('⚠️ El Flow quedó en DRAFT — republíquelo antes de usarlo.');
  process.exit(1);
}

const rEstado = await fetch(`${GRAPH}/${FLOW_ID}?fields=name,status,validation_errors`, {
  headers: { Authorization: `Bearer ${TOKEN}` },
});
const jEstado = await rEstado.json();
console.log(`✅ Republicado — "${jEstado.name}" está ${jEstado.status}`);
