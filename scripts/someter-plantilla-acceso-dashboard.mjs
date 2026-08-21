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
 *   node scripts/someter-plantilla-acceso-dashboard.mjs --editar # actualiza la ya aprobada
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
// ⚠️ v2 y no `acceso_centro_mando` a secas: Meta NO permite cambiar la categoría
// de una plantilla ya aprobada ("No puedes actualizar una categoría de plantilla
// aprobada", error_subcode 3835031). La v1 quedó clasificada MARKETING —cuota
// promocional con tope diario por persona, inaceptable para una credencial de
// acceso— así que la única salida es un nombre nuevo. La v1 sigue viva como
// respaldo hasta que esta se apruebe; borrarla no serviría, porque Meta reserva
// el nombre de una plantilla eliminada.
const NOMBRE  = 'acceso_centro_mando_v2';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // ⚠️ El cuerpo va en UNA sola frase y en tono de ENTREGA, no de beneficio.
      // La v1 decía además "Ahí ve quién ha llegado por su enlace y en qué va
      // cada persona" — esa frase vende un beneficio, y por ella el clasificador
      // de Meta la aprobó como MARKETING pese a someterla como UTILITY. Marketing
      // cuesta ~30x y, sobre todo, tiene TOPE DIARIO POR PERSONA sumando todas las
      // empresas del mundo: una credencial de acceso no puede viajar por una cuota
      // promocional. Sin salto de párrafo, además, WhatsApp no la colapsa con
      // "Leer más". No reintroducir frases de beneficio aquí.
      text: 'Listo, {{1}}. Aquí está su acceso al Centro de Mando. Por seguridad vence en 24 horas.',
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

if (args.includes('--editar')) {
  const r0 = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=id,status,category`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j0 = await r0.json();
  const actual = (j0.data || [])[0];
  if (!actual) {
    console.error(`❌ No existe ${NOMBRE}. Corra el script sin banderas para crearla.`);
    process.exit(1);
  }
  console.log(`Editando ${NOMBRE} (id ${actual.id}) — hoy: ${actual.status} · ${actual.category}`);

  // Se conserva el NOMBRE: el Dashboard la invoca por nombre, así que no hay
  // cambio de código. Editar la devuelve a revisión; la versión vigente sigue
  // enviándose mientras tanto.
  const r = await fetch(`${GRAPH}/${actual.id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: PLANTILLA.category, components: PLANTILLA.components }),
  });
  const j = await r.json();
  if (!r.ok) {
    console.error('❌ Meta rechazó la edición:', JSON.stringify(j.error || j, null, 2));
    process.exit(1);
  }
  console.log('✅ Edición enviada. Vuelve a revisión — consulte con --estado.');
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
