/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete a Meta la plantilla de bienvenida del dueño de canal.
 *
 * Para qué sirve: hoy el enlace solo se le puede enviar a alguien que haya
 * escrito al WABA en las últimas 24 h. Con esta plantilla aprobada, Queswa puede
 * entregárselo a cualquiera —haya escrito o no— y el Director deja de reenviarlo
 * a mano.
 *
 * Categoría UTILITY a propósito: es la entrega de algo que la persona acaba de
 * adquirir, no una promoción. Las de marketing tardan más y se rechazan más.
 *
 * El botón de respuesta rápida no es decorativo: cuando la persona lo toca,
 * ABRE la ventana de 24 h, y a partir de ahí Queswa puede escribirle en texto
 * libre — el resto del onboarding y los primeros avisos de actividad.
 *
 * Uso:
 *   node scripts/someter-plantilla-bienvenida.mjs --dry    # muestra sin enviar
 *   node scripts/someter-plantilla-bienvenida.mjs          # somete a Meta
 *   node scripts/someter-plantilla-bienvenida.mjs --estado # consulta aprobación
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'enlace_canal_listo';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text:
        'Listo, {{1}}. Su canal ya quedó abierto.\n\n' +
        'Este es su enlace: {{2}}\n\n' +
        'Compártalo con quien quiera. Yo converso con cada persona que lo abra, ' +
        'le explico y le resuelvo las dudas.\n\n' +
        '¿Le cuento cómo empezar?',
      example: { body_text: [['Julieth', 'creatuactivo.com/julieth-cabrejo']] },
    },
    {
      type: 'BUTTONS',
      buttons: [{ type: 'QUICK_REPLY', text: 'Sí, cuénteme' }],
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
console.log(PLANTILLA.components[0].text.replace('{{1}}', 'Julieth').replace('{{2}}', 'creatuactivo.com/julieth-cabrejo'));
console.log('─'.repeat(60));
console.log(`[ ${PLANTILLA.components[1].buttons[0].text} ]`);
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
console.log('\nRevise la aprobación con:\n  node scripts/someter-plantilla-bienvenida.mjs --estado');
