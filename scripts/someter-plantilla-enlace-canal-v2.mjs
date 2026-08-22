/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete `enlace_canal_listo_v2` — la entrega del enlace de canal al socio nuevo,
 * reducida a ENTREGA PURA para que Meta la sostenga como UTILITY.
 *
 * Por qué existe. El 21 ago 2026 la auditoría (`auditar-plantillas-whatsapp.mjs`)
 * encontró que Meta había movido `enlace_canal_listo` de UTILITY a MARKETING por
 * su cuenta. Consecuencias, las dos graves: deja de entregarse a números de
 * Estados Unidos —un socio de la diáspora activa y no recibe su enlace— y empieza
 * a consumir el cupo diario de marketing del buzón de esa persona, compartido con
 * todas las marcas que le escriben.
 *
 * ⚠️ La categoría de una plantilla APROBADA no se puede cambiar (error_subcode
 * 3835031) y Meta reserva el nombre de las borradas. De ahí el `_v2`, igual que
 * en `acceso_centro_mando_v2`.
 *
 * QUÉ LA MOVIÓ, y es la regla general del ecosistema. La v1 decía, además de
 * entregar el enlace: *"Compártalo con quien quiera. Yo converso con cada persona
 * que lo abra, le explico y le resuelvo las dudas."* y cerraba con *"¿Le cuento
 * cómo empezar?"* + botón *"Sí, cuénteme"*. La primera frase vende un beneficio;
 * la segunda invita al paso siguiente. **Una plantilla es de utilidad mientras
 * entrega lo que se pidió y se calla.** No hay que redactar mal para perderla:
 * basta redactar bien. Es exactamente lo que ya le había pasado a
 * `acceso_centro_mando`, y la lección no se propagó a tiempo.
 *
 * ⚠️ SE PIERDE EL BOTÓN A PROPÓSITO, y no es gratis. El botón de respuesta rápida
 * de la v1 era deliberado: al tocarlo el socio ABRÍA su ventana de 24 h y a partir
 * de ahí Queswa podía escribirle libre. Sin él, la ventana la abre el socio cuando
 * escriba. Se acepta porque en este flujo el Director ya está conversando con esa
 * persona en su propio chat (el mensaje para reenviar sale siempre), así que la
 * ventana llega igual — y llegar SIEMPRE, en todos los países, vale más que
 * abrirla antes en algunos.
 *
 * Tampoco lleva botón de URL: el enlace de canal es `/{slug}/queswa` y Meta exige
 * que la variable vaya AL FINAL de la URL. Haría falta una ruta corta primero.
 *
 * Uso:
 *   node scripts/someter-plantilla-enlace-canal-v2.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-enlace-canal-v2.mjs           # somete a Meta
 *   node scripts/someter-plantilla-enlace-canal-v2.mjs --estado  # consulta aprobación
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'enlace_canal_listo_v2';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // ⚠️ Entrega y punto. No reintroducir aquí ninguna frase que explique para
      // qué sirve el canal, ni ninguna pregunta que invite al paso siguiente:
      // las dos cosas son lo que Meta lee como intención promocional. Todo eso
      // va en el texto LIBRE, cuando el socio escriba y abra su ventana.
      // ⚠️ La última línea NO es adorno: Meta rechaza el cuerpo si una variable
      // queda al principio o al final (error_subcode 2388299), y el enlace es la
      // última variable. Se eligió un HECHO OPERATIVO —dónde queda el mensaje—,
      // del mismo tipo que el "vence en 24 horas" de `acceso_centro_mando_v2`,
      // que es la única forma de cerrar sin vender nada. No sustituirla por una
      // frase de beneficio ni por una pregunta: eso la devuelve a MARKETING.
      text: 'Listo, {{1}}. Su canal ya quedó abierto.\n\nEste es su enlace: {{2}}\n\nQueda guardado en este chat.',
      example: { body_text: [['Julieth', 'https://creatuactivo.com/julieth/queswa']] },
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
    console.log(`${icono} ${t.name} (${t.language || 'es'}) — ${t.status} · ${t.category}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}`);
  }
  if (!(j.data || []).length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

console.log('\n📋 Plantilla a someter\n' + '─'.repeat(64));
console.log(PLANTILLA.components[0].text.replace('{{1}}', 'Julieth').replace('{{2}}', 'https://creatuactivo.com/julieth/queswa'));
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
console.log('\nConsulte la aprobación con:\n  node scripts/someter-plantilla-enlace-canal-v2.mjs --estado');
