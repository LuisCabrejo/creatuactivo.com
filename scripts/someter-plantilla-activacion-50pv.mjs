/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Somete a Meta la plantilla del AVISO DE ACTIVACIÓN (50 PV) que el Dashboard
 * manda viernes, sábado y domingo a cada socio que esté por debajo de 50 PV
 * vigentes (queswa.app → /api/gano/activacion/avisar, cron de Vercel).
 *
 * Por qué existe: un socio perdió el GCV acumulado por faltarle una caja. Gano
 * corta el ciclo el DOMINGO A MEDIANOCHE, hora de Colombia (corte oficial; las
 * ~2 h extra del reloj del Pacífico no son oficiales), y un PV de menos borra
 * el volumen acumulado del banco y del cobro.
 *
 * Categoría UTILITY: es una alerta sobre el estado de la cuenta del propio
 * socio, con dato concreto y plazo. Reglas aprendidas con acceso_centro_mando
 * (agosto 2026): tono de entrega, UN solo párrafo, SIN frase de beneficio — una
 * sola frase que venda y Meta la reclasifica a MARKETING, y eso ya no se corrige
 * (hay que cambiar de nombre). Texto aprobado por el Director el 15 sep 2026.
 *
 * Variables (en este orden, las manda el Dashboard):
 *   {{1}} primer nombre · {{2}} PV vigentes · {{3}} PV que faltan ·
 *   {{4}} cajas CON la palabra ("1 caja" / "3 cajas") — así el singular se lee bien
 *
 * Después de aprobada: WA_PLANTILLA_ACTIVACION=activacion_50pv en Vercel del
 * DASHBOARD, y verificar la categoría contra la API (--estado), no en el Manager.
 *
 * Uso:
 *   node scripts/someter-plantilla-activacion-50pv.mjs --dry    # muestra sin enviar
 *   node scripts/someter-plantilla-activacion-50pv.mjs          # somete a Meta
 *   node scripts/someter-plantilla-activacion-50pv.mjs --estado # consulta aprobación y categoría
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v21.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE  = 'activacion_50pv';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text: '{{1}}, su cuenta en Gano tiene {{2}} PV vigentes. Le faltan {{3}} PV ({{4}}) para los 50 del corte del domingo a medianoche. Compre y pague antes.',
      example: { body_text: [['Nidia', '15', '35', '3 cajas']] },
    },
  ],
};

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);

async function estado() {
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=name,status,category,language,rejected_reason`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  if (!r.ok) { console.error('❌ Meta respondió:', JSON.stringify(j.error || j)); process.exit(1); }
  return j.data || [];
}

if (args.includes('--estado')) {
  const lista = await estado();
  for (const t of lista) {
    const icono = t.status === 'APPROVED' ? '✅' : t.status === 'REJECTED' ? '❌' : '⏳';
    const alerta = t.category !== 'UTILITY' ? `  ⚠️ Meta la clasificó ${t.category}: NO usarla para el aviso (cuota promocional); someter con nombre nuevo` : '';
    console.log(`${icono} ${t.name} (${t.language}) — ${t.status} · ${t.category}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}${alerta}`);
  }
  if (!lista.length) console.log('No existe todavía. Corra el script sin --estado para someterla.');
  process.exit(0);
}

const ejemplo = PLANTILLA.components[0].example.body_text[0];
console.log('\n📋 Plantilla a someter\n' + '─'.repeat(60));
console.log(PLANTILLA.components[0].text.replace(/\{\{(\d)\}\}/g, (_, n) => ejemplo[Number(n) - 1]));
console.log('─'.repeat(60));
console.log(`nombre: ${NOMBRE} · categoría: ${PLANTILLA.category} · idioma: ${PLANTILLA.language}\n`);

const existentes = await estado();
if (existentes.length) {
  console.log(`🟡 Ya existe ${NOMBRE} (${existentes[0].status} · ${existentes[0].category}). No se somete de nuevo — consulte con --estado.`);
  process.exit(0);
}

if (args.includes('--dry')) {
  console.log('🟡 --dry: el nombre está libre y no se envió nada a Meta.');
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
console.log(`✅ Sometida: id ${j.id} · estado ${j.status} · categoría ${j.category}`);
if (j.category && j.category !== 'UTILITY') console.log('⚠️ Meta ya la marcó como', j.category, '— no usarla para el aviso.');
console.log('Consulte la aprobación con --estado.');
