/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete `recordatorio_acuerdo` — el mensaje con que Queswa cumple lo que prometió.
 *
 * ── PARA QUÉ ──────────────────────────────────────────────────────────────────
 *
 * La escalera del aplazamiento termina en «¿a qué hora le queda bien que le
 * escriba?». Esa hora se guarda en `wa_acuerdos` y el cron horario la dispara. Si
 * la persona está DENTRO de su ventana de 24 h, entra texto libre y esta plantilla
 * no hace falta. Fuera de la ventana —que es el caso normal, porque un acuerdo a
 * un día vence justo en el filo— sin plantilla no hay forma de escribir, y la
 * promesa queda incumplida.
 *
 * ── POR QUÉ ESTA SÍ TIENE CASO DE UTILIDAD ────────────────────────────────────
 *
 * La regla que costó cuatro plantillas: **Meta clasifica por lo que la plantilla
 * ENTREGA, no por cómo está redactada.** El enlace de canal cayó cuatro veces
 * —con botón, sin botón, sin beneficio y hasta sin URL— porque entrega un activo
 * que la persona va a COMPARTIR, y eso es mercadeo por naturaleza.
 *
 * Esto entrega otra cosa: una nota para ella sola sobre algo que ella pidió. El
 * «me pidió que le escribiera» es literalmente el criterio de utilidad de Meta
 * —específica o solicitada por el usuario— y no hay nada que promocionar.
 *
 * ⚠️ No está garantizado. Ya nos equivocamos prediciendo una vez; si sale
 * MARKETING, el cron sigue sirviendo para todos menos para números de EE. UU.
 *
 * ── LO QUE NO LLEVA, Y ES DELIBERADO ──────────────────────────────────────────
 *
 * Ni «para que no pierda la oportunidad», ni el paquete, ni precios, ni botón.
 * Nada de eso agrega y todo eso la tumbaría. Su único trabajo es que la persona
 * RESPONDA: una plantilla no abre ventana, la abre la respuesta a la plantilla.
 *
 * ⚠️ El cuerpo no puede terminar en variable (error_subcode 2388299): de ahí el
 * «Aquí estoy cuando quiera» del final, que no es adorno sino estructura.
 *
 * Uso:
 *   node scripts/someter-plantilla-recordatorio.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-recordatorio.mjs           # somete a Meta
 *   node scripts/someter-plantilla-recordatorio.mjs --estado  # consulta aprobación
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'recordatorio_acuerdo';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // {{1}} nombre · {{2}} lo que ELLA dijo que iban a retomar (columna `que`
      // de wa_acuerdos, guardada en sus palabras justamente para esto).
      text: 'Hola, {{1}}. Me pidió que le escribiera hoy para retomar {{2}}. Aquí estoy cuando quiera.',
      example: { body_text: [['Claudia', 'lo de los paquetes']] },
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
    if (movida) console.log('   ⚠️ Meta la recategorizó. Ver la cabecera de este script: no es problema de copy.');
  }
  if (!(j.data || []).length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

console.log('\n📋 Plantilla a someter\n' + '─'.repeat(70));
console.log(PLANTILLA.components[0].text.replace('{{1}}', 'Claudia').replace('{{2}}', 'lo de los paquetes'));
console.log('─'.repeat(70));
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

console.log(`✅ Sometida. id: ${j.id} · estado: ${j.status || 'PENDING'} · categoría: ${j.category || PLANTILLA.category}`);
console.log('\nConsulte con:\n  node scripts/someter-plantilla-recordatorio.mjs --estado');
