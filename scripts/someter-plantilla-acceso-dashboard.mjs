/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete a Meta la plantilla de acceso al Dashboard (Centro de Mando) por WhatsApp.
 *
 * Para qué sirve: hoy el magic link de acceso solo viaja por correo. Con esta
 * plantilla aprobada, el Dashboard puede entregarle el acceso al socio nuevo
 * directamente a su WhatsApp con UN botón — la persona nunca ve la URL larga.
 *
 * El botón es de URL con sufijo dinámico: la base https://queswa.app/e/ va fija
 * en la plantilla aprobada y solo viaja el token como variable. Meta exige que
 * la variable vaya AL FINAL de la URL — por eso la ruta corta /e/{token} en el
 * Dashboard (redirige a /activate?token=), no el query actual.
 *
 * Categoría UTILITY a propósito: es la entrega de un acceso que la persona
 * acaba de adquirir, no una promoción. Se aprueban en horas y se rechazan menos.
 *
 * ⚠️ El token del magic link expira en 24 h y es de un solo uso — quien envía
 * debe generar el token JUSTO antes de disparar la plantilla (el Dashboard lo
 * genera; este repo solo transporta). Ver HANDOFF_SOCIO_POR_WHATSAPP_AGO2026.
 *
 * Uso:
 *   node scripts/someter-plantilla-acceso-dashboard.mjs --dry    # muestra sin enviar
 *   node scripts/someter-plantilla-acceso-dashboard.mjs          # somete a Meta
 *   node scripts/someter-plantilla-acceso-dashboard.mjs --estado # consulta aprobación
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'acceso_centro_mando';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text:
        'Listo, {{1}}. Su Centro de Mando ya está abierto.\n\n' +
        'Ahí ve quién ha llegado por su enlace y en qué va cada persona.',
      example: { body_text: [['Julieth']] },
    },
    {
      type: 'BUTTONS',
      buttons: [
        {
          type: 'URL',
          text: 'Abrir mi Centro de Mando',
          url: 'https://queswa.app/e/{{1}}',
          example: ['https://queswa.app/e/K7mPq2xVbN4tR9wZcE3hA8sD5fG1jL6y'],
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
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=name,status,category,rejected_reason`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  for (const t of j.data || []) {
    const icono = t.status === 'APPROVED' ? '✅' : t.status === 'REJECTED' ? '❌' : '⏳';
    console.log(`${icono} ${t.name} (${t.language || 'es'}) — ${t.status}${t.rejected_reason ? ` · motivo: ${t.rejected_reason}` : ''}`);
  }
  if (!(j.data || []).length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

console.log('\n📋 Plantilla a someter\n' + '─'.repeat(60));
console.log(PLANTILLA.components[0].text.replace('{{1}}', 'Julieth'));
console.log('─'.repeat(60));
console.log(`[ ${PLANTILLA.components[1].buttons[0].text} ] → ${PLANTILLA.components[1].buttons[0].url}`);
console.log(`\nnombre: ${NOMBRE} · categoría: ${PLANTILLA.category} · idioma: ${PLANTILLA.language}\n`);

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

console.log(`✅ Sometida. id: ${j.id} · estado inicial: ${j.status || 'PENDING'}`);
console.log('\nRevise la aprobación con:\n  node scripts/someter-plantilla-acceso-dashboard.mjs --estado');
