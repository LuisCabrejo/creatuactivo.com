/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete a Meta la plantilla de confirmación de un evento en línea (taller del 16
 * nov 2026, y los que sigan en /vip): el puesto confirmado, la fecha, la cámara
 * encendida y el enlace de la reunión en un BOTÓN. Copy aprobado por el Director
 * el 15 nov 2026.
 *
 * Categoría UTILITY: confirmación y recordatorio de un evento al que la persona se
 * inscribió, que es ejemplo de UTILITY en la guía de Meta. Se arma con el molde de
 * la única UTILITY de la cuenta (`acceso_centro_mando_v2`): entrega pura, el enlace
 * en un botón de URL y no en el cuerpo, y un dato operativo al cierre. Nada de
 * cupos, insignias, metas ni preguntas: cualquiera de esas frases la empuja a
 * MARKETING (las tres del enlace de canal quedaron MARKETING al crearse; ver
 * docs/handoff/queswa/WABA_REFERENCIA.md).
 *
 * Variables del cuerpo: {{1}} primer nombre · {{2}} el evento («el taller en
 * línea») · {{3}} cuándo («lunes 16 de noviembre a las 8:00 a. m.»). Botón: la base
 * https://meet.google.com/ va fija y el código de la reunión viaja como variable
 * (Meta exige la variable al final de la URL).
 *
 * Uso:
 *   node scripts/someter-plantilla-confirmacion-evento.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-confirmacion-evento.mjs           # somete a Meta
 *   node scripts/someter-plantilla-confirmacion-evento.mjs --estado  # estado y CATEGORÍA asignada
 *
 * ⚠️ Una plantilla que cambia lleva nombre nuevo (_v2): Meta no deja cambiar la
 * categoría de una aprobada y reserva el nombre de una eliminada.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'confirmacion_evento_v1';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // La fecha va en medio de la frase y no al final: «… a las 8:00 a. m..» dejaba doble punto.
      text: 'Hola, {{1}}. Su puesto en {{2}} del {{3}} quedó confirmado. Entre con la cámara encendida.',
      example: { body_text: [['Julieth', 'el taller en línea', 'lunes 16 de noviembre a las 8:00 a. m.']] },
    },
    {
      type: 'BUTTONS',
      buttons: [
        {
          type: 'URL',
          text: 'Entrar a la reunión',
          url: 'https://meet.google.com/{{1}}',
          example: ['https://meet.google.com/fgz-qdxk-mhr'],
        },
      ],
    },
  ],
};

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.includes('--estado')) {
  const r = await fetch(
    `${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=name,status,category,previous_category,rejected_reason`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  const j = await r.json();
  for (const t of j.data || []) {
    const icono = t.status === 'APPROVED' ? '✅' : t.status === 'REJECTED' ? '❌' : '⏳';
    console.log(`${icono} ${t.name} — ${t.status} · categoría: ${t.category}${t.previous_category ? ` (sometida ${t.previous_category})` : ''}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}`);
    if (t.status === 'APPROVED' && t.category !== 'UTILITY') {
      console.log('⚠️ Meta la clasificó como ' + t.category + ': llega a Colombia, pero cuesta más, no le llega a quien bloqueó marketing y no llega a números +1.');
    }
  }
  if (!(j.data || []).length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

const [ej1, ej2, ej3] = PLANTILLA.components[0].example.body_text[0];
console.log('\n📋 Plantilla a someter\n' + '─'.repeat(60));
console.log(PLANTILLA.components[0].text.replace('{{1}}', ej1).replace('{{2}}', ej2).replace('{{3}}', ej3));
console.log('─'.repeat(60));
console.log(`[ ${PLANTILLA.components[1].buttons[0].text} ] → ${PLANTILLA.components[1].buttons[0].example[0]}`);
console.log(`\nnombre: ${NOMBRE} · categoría pedida: ${PLANTILLA.category} · idioma: ${PLANTILLA.language}\n`);

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

console.log(`✅ Sometida. id: ${j.id} · estado: ${j.status || 'PENDING'} · categoría: ${j.category || '(consultar)'}`);
console.log('\nRevise la aprobación y la categoría con:\n  node scripts/someter-plantilla-confirmacion-evento.mjs --estado');
