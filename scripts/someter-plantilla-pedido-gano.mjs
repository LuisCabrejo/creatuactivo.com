/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete a Meta la plantilla que le avisa al socio que un cliente de su catálogo
 * PAGÓ DIRECTO A GANO EXCEL (18 oct 2026, texto aprobado por el Director).
 *
 * Por qué existe: el 17 oct 2026 ese aviso salió con `pre_afiliacion_nueva`, la
 * plantilla de respaldo de los demás avisos, y el Director leyó en su WhatsApp un
 * mensaje que hablaba de una pre-afiliación por una compra. Desde entonces, fuera
 * de la ventana de 24 h no iba nada por WhatsApp (solo el push del Centro de Mando).
 *
 * Variables (las arma avisarAlSocio en src/app/api/pedido-cliente/route.ts):
 *   {{1}} N.º de pedido · {{2}} cliente y celular · {{3}} productos y forma de pago
 *   · {{4}} total. Meta no deja saltos de línea dentro de una variable: los saltos
 *   van en el texto fijo y los productos van separados por comas.
 *
 * UTILITY: informa una compra concreta, sin una palabra de beneficio y sin pedirle
 * nada al socio («Usted no tiene que hacer nada»). Ver someter-plantilla-acceso-dashboard.mjs
 * para por qué una sola frase de beneficio basta para que Meta la mueva a MARKETING.
 *
 * Al aprobarse: WA_PLANTILLA_PEDIDO_GANO=pedido_pagado_gano_v1 en Vercel (no hay
 * que cambiar código).
 *
 * Uso:
 *   node scripts/someter-plantilla-pedido-gano.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-pedido-gano.mjs           # somete a Meta
 *   node scripts/someter-plantilla-pedido-gano.mjs --estado  # consulta aprobación y categoría
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
// El mismo nombre que va en WA_PLANTILLA_PEDIDO_GANO (Vercel).
const NOMBRE  = 'pedido_pagado_gano_v1';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text: '*Pedido N.º {{1}} de su catálogo, con pago directo a Gano Excel*\n\nCliente: {{2}}\n{{3}} · Total: {{4}}\n\nGano Excel se lo despacha al cliente cuando registre el pago. Usted no tiene que hacer nada.',
      example: { body_text: [['47004', 'Jonatan Cabrejo, +57 320 680 5737', '1 × Ganorico Latte Rico · paga por PSE', '$133.400 COP']] },
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
    const movida = t.previous_category && t.previous_category !== t.category ? ` ⚠️ Meta la movió de ${t.previous_category}` : '';
    console.log(`${icono} ${t.name} — ${t.status} · ${t.category}${movida}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}`);
  }
  if (!(j.data || []).length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

const ej = PLANTILLA.components[0].example.body_text[0];
console.log('\n📋 Plantilla a someter\n' + '─'.repeat(60));
console.log(PLANTILLA.components[0].text.replace(/\{\{(\d)\}\}/g, (_, n) => ej[Number(n) - 1]));
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

console.log(`✅ Sometida. id: ${j.id} · estado inicial: ${j.status || 'PENDING'} · categoría: ${j.category || PLANTILLA.category}`);
console.log('\nRevise la aprobación con:\n  node scripts/someter-plantilla-pedido-gano.mjs --estado');
