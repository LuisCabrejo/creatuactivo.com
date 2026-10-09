/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete `cumpleanos_socio_v1` — el mensaje que le pide a cada distribuidor su
 * cumpleaños (9 oct 2026, Director).
 *
 * El socio responde con la fecha y el nodo 2.20 del webhook la guarda en su
 * Dashboard; ese día su patrocinador y la administración reciben el aviso. El
 * texto lo aprueba el Director ANTES de someterlo (regla de proceso).
 *
 * ── CATEGORÍA ─────────────────────────────────────────────────────────────────
 * Se somete como MARKETING: pide un dato por iniciativa nuestra, y eso Meta lo
 * reclasifica igual (ver someter-plantilla-lunes-socio.mjs). Costo: 46,02 COP por
 * envío fuera de la ventana de 24 h (factura real, 9 oct 2026); dentro, va como
 * texto libre y no cuesta. Meta no entrega MARKETING a números de EE. UU.
 *
 * ⚠️ El cuerpo no puede terminar en variable (error_subcode 2388299).
 * ⚠️ Mismo texto que `cuerpoCumple` en src/lib/wa-cumpleanos-socio.ts: si cambia
 *    uno, cambia el otro y el nombre de la plantilla.
 *
 * Uso:
 *   node scripts/someter-plantilla-cumpleanos-socio.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-cumpleanos-socio.mjs           # somete a Meta
 *   node scripts/someter-plantilla-cumpleanos-socio.mjs --estado  # consulta aprobación
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;

const NOMBRE = 'cumpleanos_socio_v1';
const CUERPO =
  '🎂 Hola, {{1}}. En el equipo queremos celebrar su cumpleaños con usted.\n\n' +
  '¿Qué día es? Escríbamelo aquí, por ejemplo «15 de marzo», y yo lo guardo. ' +
  'También lo puede anotar en Ajustes de Cuenta de queswa.app.';

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.includes('--estado')) {
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=name,status,category,previous_category,rejected_reason`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const t = ((await r.json()).data || []).find(x => x.name === NOMBRE);
  if (!t) { console.log(`· ${NOMBRE} — no existe todavía`); process.exit(0); }
  const icono = t.status === 'APPROVED' ? '✅' : t.status === 'REJECTED' ? '❌' : '⏳';
  const movida = t.previous_category && t.previous_category !== t.category;
  console.log(`${icono} ${t.name} — ${t.status} · ${t.category}${movida ? ` (se sometió como ${t.previous_category})` : ''}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}`);
  process.exit(0);
}

console.log(`\n📋 ${NOMBRE}\n` + '─'.repeat(70));
console.log(CUERPO.replace('{{1}}', 'Liliana'));
console.log('─'.repeat(70) + `\nMARKETING · ${CUERPO.length} caracteres`);

if (args.includes('--dry')) {
  console.log('\n🟡 --dry: no se envió nada a Meta.');
  process.exit(0);
}

const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: NOMBRE,
    language: 'es',
    category: 'MARKETING',
    components: [{ type: 'BODY', text: CUERPO, example: { body_text: [['Liliana']] } }],
  }),
});
const j = await r.json();
if (!r.ok) { console.error('❌ Meta la rechazó:', JSON.stringify(j.error ?? j)); process.exit(1); }
console.log(`\n✅ Sometida: ${NOMBRE} · id ${j.id} · ${j.status} · ${j.category}`);
