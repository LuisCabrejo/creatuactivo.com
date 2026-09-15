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
 * (hay que cambiar de nombre). La v1 cayó justo ahí; ver la nota junto a NOMBRE.
 *
 * Variables (en este orden, las manda el Dashboard):
 *   {{1}} primer nombre · {{2}} PV vigentes · {{3}} PV que faltan ·
 *   {{4}} cajas CON la palabra ("1 caja" / "3 cajas") — así el singular se lee bien
 *
 * Después de aprobada COMO UTILITY: WA_PLANTILLA_ACTIVACION=activacion_50pv_v2 en Vercel del
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
// ⚠️ v2 y no `activacion_50pv` a secas: la v1 («… Compre y pague antes.») fue
// APROBADA pero RECLASIFICADA de UTILITY a MARKETING (15 sep 2026). Marketing
// tiene tope diario por persona sumando todas las empresas — a Leidy García ya
// le pasó con lunes_socio — y el aviso existe para llegar antes del domingo a
// medianoche. Meta no deja cambiar la categoría ni reusar el nombre → nombre nuevo.
// Auditoría de la cuenta: quedaron en UTILITY las que informan un hecho o responden
// a algo pedido (recordatorio_acuerdo, acceso_centro_mando_v2, pre_afiliacion_nueva);
// pasaron a MARKETING las que piden una acción comercial («Compre…», «Compártalo…»).
// Por eso la v2 es un ESTADO DE CUENTA sin orden de compra, y cierra como
// recordatorio_acuerdo. Texto aprobado por el Director el 15 sep 2026.
const NOMBRE  = 'activacion_50pv_v2';

const PLANTILLA = {
  name: NOMBRE,
  language: 'es',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // ⚠️ Meta no admite una variable al principio ni al final del cuerpo
      // (rechazo del 15 sep 2026: "No se permite incluir parámetros al principio
      // ni al final"). Por eso «Hola, {{1}}.» y el cierre en texto fijo.
      // ⚠️ Sin imperativos comerciales («compre», «pague», «comparta»): son los que
      // hacen que Meta reclasifique a MARKETING.
      text: 'Hola, {{1}}. Estado de su cuenta en Gano: {{2}} PV vigentes. La calificación pide 50 PV en el corte del domingo a medianoche, así que le faltan {{3}} PV ({{4}}). Cualquier duda, aquí estoy.',
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
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${NOMBRE}&fields=name,status,category,previous_category,language,rejected_reason`, {
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
    console.log(`${icono} ${t.name} (${t.language}) — ${t.status} · ${t.category}${t.previous_category ? ` (sometida ${t.previous_category})` : ''}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · motivo: ${t.rejected_reason}` : ''}${alerta}`);
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
