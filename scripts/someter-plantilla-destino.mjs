/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Plantillas del MODO WAZE que Queswa le manda al socio por iniciativa propia,
 * fuera de la ventana de 24 h (Director, 6 oct 2026: «no importa el costo: lo que
 * requerimos es que los distribuidores desarrollen confianza y cariño con Queswa»).
 *
 *   • `destino_corregir_v1` — la vida que quiere quedó por debajo de lo que
 *     necesita hoy (Nidia, 5 oct: $8.000.000 y $600.000). Mismo texto que recibe
 *     en el chat quien lo anota con la ventana abierta (`cifraDudosa`, en
 *     wa-destino-socio.ts), con el formulario ya escrito en el botón.
 *
 *   • `ruta_pendientes_v1` — cada semana, a quien le falte algo en sus Ajustes de
 *     Cuenta (destino, foto, contraseña de Gano, notificaciones): Queswa en modo
 *     Waze le dice qué le falta, y el botón trae lo que le abre cada cosa
 *     (`wa-pendientes-socio.ts`). La lista va en una sola variable.
 *
 * `destino_corregir_v1` se sometió como UTILITY (dato de su cuenta) y Meta la
 * movió a MARKETING; `ruta_pendientes_v1` se somete ya como MARKETING. El costo
 * no es el criterio aquí.
 *
 *   node scripts/someter-plantilla-destino.mjs [nombre…] [--dry | --estado]
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });

const GRAPH = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN = process.env.WHATSAPP_SYSTEM_TOKEN;
const FLOW_DESTINO_ID = '967176575826968'; // destino_socio_v2

export const CUERPO_DESTINO_CORREGIR =
  'Hola {{1}} 👋, revisando su destino me quedó una duda: la vida que quiere quedó en {{2}} al mes, menos de lo que necesita hoy ({{3}}). ¿Quiso escribir otra cifra? Aquí se la dejo para corregirla en un minuto.';

/** Mismo texto en src/lib/wa-pendientes-socio.ts (texto libre dentro de ventana). */
export const CUERPO_RUTA_PENDIENTES =
  'Hola {{1}} 👋, estoy en modo Waze para usted y quiero marcarle la ruta completa. En sus Ajustes de Cuenta me falta {{2}}: cada cosa le abre algo.';

const TODAS = [
  {
    name: 'destino_corregir_v1',
    language: 'es',
    category: 'UTILITY',
    components: [
      { type: 'BODY', text: CUERPO_DESTINO_CORREGIR, example: { body_text: [['Nidia', '$600.000', '$8.000.000']] } },
      { type: 'BUTTONS', buttons: [{ type: 'FLOW', text: 'Corregir mi destino', flow_id: FLOW_DESTINO_ID, navigate_screen: 'DESTINO', flow_action: 'navigate' }] },
    ],
  },
  {
    name: 'ruta_pendientes_v1',
    language: 'es',
    category: 'MARKETING',
    components: [
      { type: 'BODY', text: CUERPO_RUTA_PENDIENTES, example: { body_text: [['Adriana', 'su destino y activar sus notificaciones']] } },
      { type: 'BUTTONS', buttons: [{ type: 'QUICK_REPLY', text: 'Ver qué me abre' }] },
    ],
  },
];

const nombres = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PLANTILLAS = nombres.length ? TODAS.filter(p => nombres.includes(p.name)) : TODAS;

if (!WABA_ID || !TOKEN) { console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN'); process.exit(1); }
const args = process.argv.slice(2);
const h = { Authorization: `Bearer ${TOKEN}` };

if (args.includes('--estado')) {
  for (const p of PLANTILLAS) {
    const j = await fetch(`${GRAPH}/${WABA_ID}/message_templates?name=${p.name}&fields=name,status,category,previous_category,rejected_reason`, { headers: h }).then(r => r.json());
    const t = (j.data || []).find(x => x.name === p.name);
    console.log(t ? `${t.status === 'APPROVED' ? '✅' : t.status === 'REJECTED' ? '❌' : '⏳'} ${t.name} — ${t.status} · ${t.category}${t.previous_category && t.previous_category !== t.category ? ` (se sometió como ${t.previous_category})` : ''}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · ${t.rejected_reason}` : ''}` : `· ${p.name} — no existe`);
  }
  process.exit(0);
}

for (const p of PLANTILLAS) {
  const b = p.components.find(c => c.type === 'BODY');
  console.log(`\n📋 ${p.name} (${p.category})\n` + b.example.body_text[0].reduce((t, v, i) => t.replace(`{{${i + 1}}}`, v), b.text));
  console.log('Botón: ' + p.components.find(c => c.type === 'BUTTONS').buttons.map(x => `[${x.text}]`).join(' '));
}
if (args.includes('--dry')) process.exit(0);

for (const p of PLANTILLAS) {
  const r = await fetch(`${GRAPH}/${WABA_ID}/message_templates`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const j = await r.json();
  console.log(r.ok ? `✅ ${p.name} sometida · ${j.status || 'PENDING'} · ${j.category || p.category}` : `❌ ${p.name}: ${JSON.stringify(j.error || j)}`);
}
