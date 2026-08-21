/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete a Meta la plantilla del CÓDIGO de acceso al Centro de Mando.
 *
 * Para qué sirve: cuando el socio YA tiene la app instalada y perdió la sesión,
 * un enlace no le resuelve — se abriría en el navegador de WhatsApp, que tiene su
 * propio almacén, y la app seguiría deslogueada. El código se escribe DENTRO de la
 * app, así que la sesión nace en el contexto correcto, sin saltos de navegador.
 *
 * 🔴 ESTA PLANTILLA NO LLEVA BOTÓN, Y ES DELIBERADO. Si lo llevara, el socio lo
 * tocaría —es lo llamativo— y volvería a aterrizar en el navegador de WhatsApp,
 * que es justo lo que este mecanismo existe para evitar. No agregar botón.
 *
 * El código son 4 cifras (decisión del Director, modelo Netflix) y vale 15 min:
 * con tan pocas combinaciones, la seguridad la da la ventana corta, no la longitud.
 *
 * Uso:
 *   node scripts/someter-plantilla-codigo-acceso.mjs --dry    # muestra sin enviar
 *   node scripts/someter-plantilla-codigo-acceso.mjs          # somete a Meta
 *   node scripts/someter-plantilla-codigo-acceso.mjs --estado # consulta aprobación
 *   node scripts/someter-plantilla-codigo-acceso.mjs --editar # actualiza la ya aprobada
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'codigo_acceso_centro_mando';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // ⚠️ Tono de ENTREGA y un solo párrafo, sin frases de beneficio: es la
      // fórmula con la que Meta clasificó UTILITY la plantilla del enlace. Una
      // sola frase de beneficio la manda a MARKETING y ahí no se puede corregir.
      text: 'Listo, {{1}}. Su código para entrar al Centro de Mando es {{2}}. Por seguridad vence en 15 minutos.',
      example: { body_text: [['Julieth', '4827']] },
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
console.log(PLANTILLA.components[0].text.replace('{{1}}', 'Julieth').replace('{{2}}', '4827'));
console.log('─'.repeat(60));
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
console.log('\nRevise la aprobación con:\n  node scripts/someter-plantilla-codigo-acceso.mjs --estado');
