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
 *
 * El simulador en DÓLARES (11 oct 2026, para quien escribe desde fuera de
 * Colombia) es otro Flow con su propio id, `WHATSAPP_FLOW_SIMULADOR_USD_ID`. Su
 * JSON se genera desde el de pesos —nunca se edita a mano—:
 *   node scripts/generar-flow-simulador-usd.mjs
 *   node scripts/actualizar-flow-simulador.mjs --usd --crear   # la primera vez: lo crea e imprime el id
 *   node scripts/actualizar-flow-simulador.mjs --usd           # las siguientes
 * Después de crearlo, el id va a Vercel como WHATSAPP_FLOW_SIMULADOR_USD_ID.
 * ⚠️ Un Flow que la persona ya abrió se queda guardado en su teléfono: cambiar el
 * contenido de uno publicado no le llega a quien ya lo vio. Contenido nuevo
 * para todos = id nuevo.
 */

import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const USD     = process.argv.includes('--usd');
const CREAR   = process.argv.includes('--crear');
const VAR_ID  = USD ? 'WHATSAPP_FLOW_SIMULADOR_USD_ID' : 'WHATSAPP_FLOW_SIMULADOR_ID';
let   FLOW_ID = process.env[VAR_ID]?.trim();
const RUTA    = USD
  ? 'docs/handoff/queswa/flows/simulador-de-ingresos-usd.flow.json'
  : 'docs/handoff/queswa/flows/simulador-de-ingresos.flow.json';

if (!TOKEN || (!FLOW_ID && !CREAR)) {
  console.error(`❌ Faltan WHATSAPP_SYSTEM_TOKEN o ${VAR_ID}${USD ? ' (la primera vez: --usd --crear)' : ''}`);
  process.exit(1);
}
if (CREAR && FLOW_ID) {
  console.error(`❌ ${VAR_ID} ya está definida (${FLOW_ID}): no se crea otro. Quite --crear para actualizarlo.`);
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

// ─── 0) Crear el Flow (solo con --crear) ─────────────────────────────────────
if (CREAR) {
  const WABA = process.env.WHATSAPP_WABA_ID;
  if (!WABA) { console.error('❌ Falta WHATSAPP_WABA_ID para crear el Flow'); process.exit(1); }
  const rCrear = await fetch(`${GRAPH}/${WABA}/flows`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: USD ? 'Simulador de ingresos (USD)' : 'Simulador de ingresos', categories: ['OTHER'] }),
  });
  const jCrear = await rCrear.json();
  if (!rCrear.ok || !jCrear.id) {
    console.error('❌ Meta no creó el Flow:', JSON.stringify(jCrear.error || jCrear, null, 2));
    process.exit(1);
  }
  FLOW_ID = jCrear.id;
  console.log(`✅ Flow creado: ${FLOW_ID} — defínalo en Vercel y en .env.local como ${VAR_ID}`);
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
