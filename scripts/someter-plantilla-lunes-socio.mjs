/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete `lunes_socio` — el mensaje de los lunes de Queswa a cada distribuidor.
 *
 * ── PARA QUÉ ──────────────────────────────────────────────────────────────────
 *
 * El 14 sep 2026 Meta le mandó al Director, por defecto, su mensaje de lunes de
 * WhatsApp Business (video, tres consejos, tuteo). La decisión: que Queswa haga
 * lo mismo con los socios con los que ya conversa —desearles la semana y dejar
 * claro que está ahí para tres cosas: metas, redactar el mensaje de contacto y
 * resolver dudas antes de que se las hagan a ellos—. El texto es del Director,
 * con sus cuatro emoticones (saludo · metas · redactar · dudas); la regla «sin
 * emojis» gobierna la voz de Queswa en el chat, no un mensaje que él firma.
 *
 * ── CATEGORÍA ─────────────────────────────────────────────────────────────────
 *
 * Se somete como UTILITY, igual que las anteriores, pero LO ESPERABLE ES QUE META
 * LA APRUEBE COMO MARKETING: no responde a nada que el socio haya pedido —es
 * Queswa tomando la iniciativa—, y eso Meta lo clasifica como relación, no como
 * utilidad. Con la del acceso ya pasó: se sometió UTILITY y salió MARKETING sin
 * rechazo. Para 20 socios en Colombia la diferencia es el precio (~90 pesos por
 * envío contra ~3) y el tope de marketing por persona, que un envío semanal no
 * toca. Lo que NO se puede es corregir la categoría después: de ahí que el
 * nombre sea nuevo y específico.
 *
 * ⚠️ El cuerpo no puede terminar en variable (error_subcode 2388299). Termina en
 * «Soy todo oídos.», que además es la invitación a responder — y la respuesta
 * del socio es lo que abre la ventana de 24 h para que Queswa converse libre.
 *
 * Diseño (14 sep 2026, probado en el teléfono del Director por texto libre): una
 * viñeta por emoticón y UNA LÍNEA EN BLANCO ENTRE CADA UNA, como el mensaje de
 * lunes que Meta le mandó. El párrafo corrido colapsaba con «Leer más»; las
 * viñetas pegadas se veían apiñadas. Esta no colapsa y «respira».
 *
 * Uso:
 *   node scripts/someter-plantilla-lunes-socio.mjs --editar  # actualiza la aprobada (vuelve a revisión)
 *   node scripts/someter-plantilla-lunes-socio.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-lunes-socio.mjs           # somete a Meta
 *   node scripts/someter-plantilla-lunes-socio.mjs --estado  # consulta aprobación
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
// v2 (14 sep 2026): el diseño con una línea en blanco entre viñetas llegó el mismo
// día de la edición anterior, y Meta solo deja editar una plantilla activa una vez
// cada 24 h (error_subcode 2388124). Nombre nuevo en vez de esperar a mañana.
// `lunes_socio` (v1) queda aprobada y sin uso.
const NOMBRE  = 'lunes_socio_v2';

/** El mismo texto vive en src/lib/wa-lunes-socio.ts (texto libre dentro de ventana). Cambiar los dos a la vez. */
export const CUERPO_LUNES_SOCIO =
  'Hola {{1}} 👋, espero que esté genial y vamos por una gran semana.\n\n' +
  'Aquí estoy para ayudarle:\n\n' +
  '🎯 A cumplir sus metas.\n\n' +
  '✍️ A redactarle el mensaje para esa persona que tiene en mente.\n\n' +
  '💬 A responderle cualquier duda de los productos o del proyecto, antes de que se la hagan a usted.\n\n' +
  'Soy todo oídos.';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text: CUERPO_LUNES_SOCIO,
      example: { body_text: [['Liliana']] },
    },
  ],
};

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.includes('--estado')) {
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=name,status,category,previous_category,rejected_reason`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  for (const t of j.data || []) {
    const icono = t.status === 'APPROVED' ? '✅' : t.status === 'REJECTED' ? '❌' : '⏳';
    const movida = t.previous_category && t.previous_category !== t.category;
    console.log(`${icono} ${t.name} — ${t.status} · ${t.category}${movida ? ` (se sometió como ${t.previous_category})` : ''}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}`);
  }
  if (!(j.data || []).length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

if (args.includes('--editar')) {
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=id,status,category`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json();
  const t = (j.data || [])[0];
  if (!t) { console.error('❌ No existe la plantilla; sométala primero.'); process.exit(1); }
  const e = await fetch(`${GRAPH}/${t.id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ components: PLANTILLA.components }),
  });
  const je = await e.json();
  if (!e.ok) { console.error('❌ Meta rechazó la edición:', JSON.stringify(je.error || je, null, 2)); process.exit(1); }
  console.log(`✅ Editada (id ${t.id}, era ${t.status} · ${t.category}). Vuelve a revisión. Consulte con --estado.`);
  process.exit(0);
}

console.log('\n📋 Plantilla a someter\n' + '─'.repeat(70));
console.log(CUERPO_LUNES_SOCIO.replace('{{1}}', 'Liliana'));
console.log('─'.repeat(70));
console.log(`nombre: ${NOMBRE} · categoría: ${PLANTILLA.category} · idioma: ${PLANTILLA.language} · ${CUERPO_LUNES_SOCIO.length} caracteres\n`);

if (args.includes('--dry')) {
  console.log('🟡 --dry: no se envió nada a Meta.');
  process.exit(0);
}

const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(PLANTILLA),
});
const j = await r.json();

if (!r.ok) {
  console.error('❌ Meta rechazó la solicitud:', JSON.stringify(j.error || j, null, 2));
  process.exit(1);
}

console.log(`✅ Sometida. id: ${j.id} · estado: ${j.status || 'PENDING'} · categoría: ${j.category || PLANTILLA.category}`);
console.log('\nConsulte con:\n  node scripts/someter-plantilla-lunes-socio.mjs --estado');
