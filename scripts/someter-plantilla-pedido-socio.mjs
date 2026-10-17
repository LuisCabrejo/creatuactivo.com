/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete a Meta la plantilla con que el socio se entera de un PEDIDO de producto
 * (17 oct 2026, texto aprobado por el Director).
 *
 * Hasta ese día el aviso salía con `pre_afiliacion_nueva`, escrita para la
 * vinculación de un socio: al distribuidor le llegaba «Juan dejó lista su
 * pre-afiliación con el paquete 1 × Ganocafé 3 en 1…» y lo mandaba a buscar los
 * datos a un Centro de Mando que no muestra pedidos.
 *
 * El botón es de URL con sufijo dinámico (Meta exige la variable AL FINAL): la base
 * https://creatuactivo.com/pedido/ va fija y viaja `{codigo}-{firma}`. La ruta
 * (src/app/pedido/[clave]/route.ts) abre el chat con el comprador con el primer
 * mensaje del socio ya escrito.
 *
 * UTILITY: es el aviso de una transacción concreta que el socio tiene que atender,
 * sin una palabra de beneficio (ver por qué en someter-plantilla-acceso-dashboard.mjs:
 * una sola frase de beneficio basta para que Meta la mueva a MARKETING).
 *
 * v2 (17 oct 2026, Director: «llegó totalmente desordenado, los productos
 * deberían venir en viñetas»). Meta no deja saltos de línea DENTRO de una
 * variable, así que la v1 metía la lista entera en un renglón. La v2 lleva los
 * saltos en el texto fijo, no lleva la lista, y suma [Ver el pedido]: ese toque
 * abre la ventana de 24 h y Queswa responde el detalle con viñetas (nodo 1.37).
 * La v1 sigue aprobada como respaldo: avisarPedido() cae a ella, y después a
 * `pre_afiliacion_nueva`, si la v2 no sale. No hay que cambiar código al aprobarse.
 *
 * Uso:
 *   node scripts/someter-plantilla-pedido-socio.mjs --dry     # muestra sin enviar
 *   node scripts/someter-plantilla-pedido-socio.mjs           # somete a Meta
 *   node scripts/someter-plantilla-pedido-socio.mjs --estado  # consulta aprobación y categoría
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
// El mismo nombre que PLANTILLA_PEDIDO_SOCIO en src/lib/wa-pedido.ts.
const NOMBRE  = 'pedido_cliente_v2';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text: '*Nuevo pedido N.º {{1}} de su catálogo*\n\nCliente: {{2}}\n{{3}} · Total: {{4}}\n\nEscríbale hoy para acordar el pago y la entrega.',
      example: { body_text: [['47004', 'Efraín Reyes, +57 320 680 5737', '5 productos', '$563.500 COP']] },
    },
    {
      type: 'BUTTONS',
      buttons: [
        { type: 'QUICK_REPLY', text: 'Ver el pedido' },
        {
          type: 'URL',
          text: 'Escribirle',
          url: 'https://creatuactivo.com/pedido/{{1}}',
          example: ['https://creatuactivo.com/pedido/48213-k3J9x2aQ1z'],
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
console.log(PLANTILLA.components[1].buttons.map((b) => `[ ${b.text} ]${b.url ? ` → ${b.url}` : ''}`).join('  '));
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
console.log('\nRevise la aprobación con:\n  node scripts/someter-plantilla-pedido-socio.mjs --estado');
