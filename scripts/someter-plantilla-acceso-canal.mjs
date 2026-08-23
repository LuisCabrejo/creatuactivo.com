/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ⛔ RESULTADO (22 ago 2026, 19:20 Bogotá): APPROVED · **MARKETING**, clasificada así
 * en el minuto de crearse, igual que las dos `enlace_canal_listo`. Tres variantes
 * del enlace de canal —con URL y beneficio, con URL sola, sin URL y con botón de
 * respuesta rápida— y las tres MARKETING; la única UTILITY de la cuenta entrega
 * un acceso con vencimiento por botón de URL. Conclusión: el enlace de canal, por
 * lo que es, no pasa. **No someter otra variante.** La plantilla existe, está
 * aprobada y NO la usa ningún código; el webhook sigue con la v1 para todos.
 * Este script queda como historia y para `--estado`.
 *
 * Somete `acceso_canal` — la entrega del enlace de canal al socio nuevo cuando
 * su ventana de 24 h está cerrada, **para números de Estados Unidos**.
 *
 * Por qué existe (22 ago 2026). `enlace_canal_listo` (v1) es la plantilla que
 * usa el webhook en `ACTIVAR` fuera de ventana, y Meta la movió a MARKETING.
 * Para Colombia y el resto del mundo eso es tolerable —llega, con el límite
 * dinámico por persona— y el Director decidió conservarla porque trae el enlace
 * en el cuerpo, dice qué hacer con él y su botón mete al socio en la
 * conversación con un toque: hoy pesa más la experiencia del socio nuevo que la
 * categoría. Pero **a números de EE. UU. Meta no entrega MARKETING** (pausa desde
 * el 1 abr 2025, vigente en 2026 y sin fecha de fin), así que a ese socio la v1
 * no le llega de ningún modo. Esta plantilla existe para ese caso, y solo para
 * ese caso: si queda UTILITY, el socio estadounidense recibe su acuse y un toque
 * lo mete en la conversación; si Meta la clasifica MARKETING, tampoco llega —
 * igual que hoy— y no se pierde nada salvo el nombre.
 *
 * Qué se aprendió con `enlace_canal_listo_v2` (22 ago, entrega pura, MARKETING
 * en el mismo minuto de crearse): quitar la frase de beneficio y la pregunta NO
 * basta. Lo que las dos versiones del enlace compartían, y la única UTILITY de la
 * cuenta (`acceso_centro_mando_v2`) no tenía, es **la URL dentro del cuerpo**.
 * Por eso aquí no hay URL en ningún componente: el botón es de RESPUESTA RÁPIDA
 * —un toque, sin salir del chat, sin ruta nueva— y al tocarlo el webhook
 * (bloque 1.45) le entrega en texto libre lo mismo que recibe el socio
 * colombiano dentro de ventana: enlace, «compártalo con cinco personas hoy» y
 * la oferta de redactarle el mensaje. ⚠️ Si Meta la clasifica MARKETING también,
 * NO someter otra variante: con tres resultados iguales el patrón sería que el
 * enlace de canal, por lo que es, no pasa.
 *
 * El nombre no lleva `_v3` a propósito (Director, 22 ago): evitar que Meta lo
 * lea como hermana de las dos anteriores. Nada indica que el clasificador mire
 * el nombre, pero no cuesta nada. `acceso_` es el molde de la que sí quedó
 * UTILITY.
 *
 * Uso:
 *   node scripts/someter-plantilla-acceso-canal.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-acceso-canal.mjs           # somete a Meta
 *   node scripts/someter-plantilla-acceso-canal.mjs --estado  # consulta aprobación y categoría
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });

const GRAPH   = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'acceso_canal';

/** El rótulo del botón es la llave del webhook (bloque 1.45): si cambia aquí, cambia allá. */
export const BOTON_ACCESO_CANAL = 'Ver mi enlace';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // ⚠️ Sin URL, sin frase de beneficio, sin pregunta. «Quedó a su nombre» es un
      // hecho de registro; «le entrego su enlace» es la entrega. La variable no
      // puede ir al principio ni al final del cuerpo (error_subcode 2388299).
      text: 'Listo, {{1}}. Su canal quedó a su nombre. Toque el botón y le entrego su enlace.',
      example: { body_text: [['Julieth']] },
    },
    {
      type: 'BUTTONS',
      buttons: [{ type: 'QUICK_REPLY', text: BOTON_ACCESO_CANAL }],
    },
  ],
};

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.includes('--estado')) {
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=name,status,category,previous_category,rejected_reason,last_updated_time`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  for (const t of j.data || []) {
    const icono = t.status !== 'APPROVED' ? (t.status === 'REJECTED' ? '❌' : '⏳') : (t.category === 'UTILITY' ? '✅' : '⚠️');
    const movida = t.previous_category && t.previous_category !== t.category ? ` (sometida como ${t.previous_category})` : '';
    console.log(`${icono} ${t.name} — ${t.status} · ${t.category}${movida}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''} · ${t.last_updated_time}`);
  }
  if (!(j.data || []).length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

console.log('\n📋 Plantilla a someter\n' + '─'.repeat(64));
console.log(PLANTILLA.components[0].text.replace('{{1}}', 'Julieth'));
console.log(`[ ${BOTON_ACCESO_CANAL} ]`);
console.log('─'.repeat(64));
console.log(`nombre: ${NOMBRE} · categoría: ${PLANTILLA.category} · idioma: ${PLANTILLA.language}\n`);

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

console.log(`✅ Sometida. id: ${j.id} · estado inicial: ${j.status || 'PENDING'} · categoría: ${j.category || PLANTILLA.category}`);
console.log('\nConsulte la aprobación y la categoría REAL con:\n  node scripts/someter-plantilla-acceso-canal.mjs --estado');
