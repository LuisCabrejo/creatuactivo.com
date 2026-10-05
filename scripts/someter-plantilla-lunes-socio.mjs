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
// v3 (20 sep 2026): el Director pidió invitar a terminar de ajustar la cuenta.
// Nombre nuevo, NO edición de la v2: editar la aprobada la manda a revisión, y si
// Meta no alcanza a aprobarla antes del cron del lunes (8:00 Bogotá) el envío se
// cae para todos los que estén fuera de la ventana de 24 h. Con v3 aparte, v2
// sigue sirviendo hasta que v3 esté aprobada.
// v5 (28 sep 2026): «metas» → «objetivos» (el 19 sep el Director decidió que se
// llaman referencias y que Queswa no introduce «meta»), y la línea de la semana es
// el video «Cómo funciona» en Compartir → Reels, con el enlace del socio puesto.
// v6 (5 oct 2026, mañana): el MODO WAZE en dos plantillas, con botones de
// respuesta. Aprobadas y nunca enviadas: el Director las revisó completas y pidió
// que el destino se anote sin salir de WhatsApp.
// v7 (5 oct 2026, mediodía): las dos de v6 con el formulario «Su destino»
// (Flow `destino_socio`, scripts/publicar-flow-destino.mjs) en el botón:
//   • `lunes_socio_v7` — quien no ha anotado su destino: «¿Ya conoce mi modo
//     Waze?» · [Anotarlo ahora] abre el formulario · [Recuérdemelo a las 2].
//   • `lunes_socio_v7_ruta` — quien ya lo anotó: su punto de partida, su destino
//     y su razón, con SUS cifras de GASTO y SUS palabras · [Actualizar destino]
//     abre el formulario con lo suyo ya escrito. Sin recordatorio: no tiene nada
//     pendiente.
// ⛔ «Le marco la ruta», nunca «lo llevo» (regla de WHY_02: llevarlo es prometer el
// resultado). Por eso «HACIA donde quiere llegar», no «hasta».
// Botones ≤ 20 caracteres (el interactivo del texto libre no admite más).
// Se somete ya como MARKETING: las anteriores se sometieron UTILITY y Meta las
// movió todas.

const FLOW_DESTINO_ID = '1735859347501922';

/** El mismo texto vive en src/lib/wa-lunes-socio.ts (texto libre dentro de ventana). Cambiar los dos a la vez. */
export const CUERPO_LUNES_GANCHO =
  'Hola {{1}} 👋, iniciamos semana. ¿Ya conoce mi modo Waze?\n\n' +
  'Igual que Waze, le marco la ruta hacia donde usted quiere llegar. Solo me falta saber a dónde va: lo que necesita al mes, la vida que quiere y su razón.\n\n' +
  'Son tres datos y un minuto, aquí mismo. Si hoy está a mil, se lo recuerdo a las 2 p. m.';

export const CUERPO_LUNES_RUTA =
  'Hola {{1}} 👋, iniciamos semana y estoy en modo Waze para usted: sé de dónde parte y a dónde va.\n\n' +
  '📍 Punto de partida: lo que necesita hoy, {{2}} al mes.\n\n' +
  '🏁 Destino: la vida que quiere, {{3}} al mes.\n\n' +
  '❤️ Su razón: «{{4}}».\n\n' +
  'Ese es el destino con el que trabajo para usted. Cuando quiera, aquí estoy; y si su destino cambió, lo actualizamos en un minuto.';

const formulario = (text) => ({ type: 'FLOW', text, flow_id: FLOW_DESTINO_ID, navigate_screen: 'DESTINO', flow_action: 'navigate' });
const respuesta = (text) => ({ type: 'QUICK_REPLY', text });

const PLANTILLAS = [
  {
    name: 'lunes_socio_v7',
    language: 'es',
    category: 'MARKETING',
    components: [
      { type: 'BODY', text: CUERPO_LUNES_GANCHO, example: { body_text: [['Liliana']] } },
      { type: 'BUTTONS', buttons: [formulario('Anotarlo ahora'), respuesta('Recuérdemelo a las 2')] },
    ],
  },
  {
    name: 'lunes_socio_v7_ruta',
    language: 'es',
    category: 'MARKETING',
    components: [
      { type: 'BODY', text: CUERPO_LUNES_RUTA, example: { body_text: [['Liliana', '$2.500.000', '$5.000.000', 'Tener más tiempo con mi familia']] } },
      { type: 'BUTTONS', buttons: [formulario('Actualizar destino')] },
    ],
  },
];

for (const p of PLANTILLAS) {
  for (const b of p.components.find(c => c.type === 'BUTTONS').buttons) {
    if (b.text.length > 20) { console.error(`❌ Botón «${b.text}» pasa de 20 caracteres (límite del botón interactivo).`); process.exit(1); }
  }
}

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.includes('--estado')) {
  for (const p of PLANTILLAS) {
    const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${p.name}&fields=name,status,category,previous_category,rejected_reason`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const j = await r.json();
    const t = (j.data || []).find(x => x.name === p.name);
    if (!t) { console.log(`· ${p.name} — no existe todavía`); continue; }
    const icono = t.status === 'APPROVED' ? '✅' : t.status === 'REJECTED' ? '❌' : '⏳';
    const movida = t.previous_category && t.previous_category !== t.category;
    console.log(`${icono} ${t.name} — ${t.status} · ${t.category}${movida ? ` (se sometió como ${t.previous_category})` : ''}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}`);
  }
  process.exit(0);
}

for (const p of PLANTILLAS) {
  const cuerpo = p.components.find(c => c.type === 'BODY');
  const ejemplo = cuerpo.example.body_text[0];
  console.log(`\n📋 ${p.name}\n` + '─'.repeat(70));
  console.log(ejemplo.reduce((t, v, i) => t.replace(`{{${i + 1}}}`, v), cuerpo.text));
  console.log('Botones: ' + p.components.find(c => c.type === 'BUTTONS').buttons.map(b => `[${b.text}]`).join(' '));
  console.log('─'.repeat(70) + `\n${p.category} · ${cuerpo.text.length} caracteres`);
}

if (args.includes('--dry')) {
  console.log('\n🟡 --dry: no se envió nada a Meta.');
  process.exit(0);
}

for (const p of PLANTILLAS) {
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
  });
  const j = await r.json();
  if (!r.ok) { console.error(`❌ ${p.name}: Meta rechazó la solicitud:`, JSON.stringify(j.error || j, null, 2)); continue; }
  console.log(`✅ ${p.name} sometida. id: ${j.id} · estado: ${j.status || 'PENDING'} · categoría: ${j.category || p.category}`);
}
console.log('\nConsulte con:\n  node scripts/someter-plantilla-lunes-socio.mjs --estado');
