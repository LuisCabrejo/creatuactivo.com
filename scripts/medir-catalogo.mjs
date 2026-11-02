/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * La tienda del socio, de la visita al pedido (2 nov 2026, Director).
 *
 * Los pasos ya se guardaban, pero nadie los juntaba:
 *   · la VISITA al catálogo: `page_visits` con origen `catalogo` (una por carga);
 *   · el PEDIDO ENVIADO desde la tienda: origen `pedido`, con `detalle` (productos,
 *     unidades, total y, desde el 2 nov, las líneas); destino `whatsapp` si tocó
 *     «Enviar pedido por WhatsApp», `web` si pagó a Gano Excel desde la hoja;
 *   · el PEDIDO REGISTRADO por Queswa en WhatsApp: `wa_pedidos`, con sus líneas,
 *     el socio y cómo eligió pagar (`estado`).
 *
 * Tres tablas: por socio (visitas → enviados → registrados → cómo pagó), por
 * producto (lo que se arma en el carrito contra lo que Queswa registró) y por día.
 *
 *   node scripts/medir-catalogo.mjs [--dias 7]
 *
 * ⚠️ Una visita no es una persona (quien recarga cuenta dos), y los envíos y los
 * registros no se atan uno a uno: el enviado viene del navegador y el registro
 * del número de WhatsApp. Se comparan como totales por socio y por día. Las
 * pruebas del equipo entran igual que las ventas: mire el nombre en `wa_pedidos`.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const i = process.argv.indexOf('--dias');
const dias = i > -1 ? Number(process.argv[i + 1]) : 7;
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const [{ data: visitas, error: e1 }, { data: pedidos, error: e2 }, { data: socios, error: e3 }] = await Promise.all([
  sb.from('page_visits').select('mentor_ref_id, page_entry, timestamp, dispositivo, destino, origen, detalle').in('origen', ['catalogo', 'pedido']).gte('timestamp', desde),
  sb.from('wa_pedidos').select('codigo, nombre, lineas, total_cop, constructor_id, socio, estado, creado_at').gte('creado_at', desde),
  sb.from('constructor_slugs').select('slug, constructor_id'),
]);
for (const e of [e1, e2, e3]) if (e) { console.error('❌', e.message); process.exit(1); }

// El socio de una visita: el ref que publicó la página, o el slug de la ruta.
const porSlug = new Map((socios ?? []).map((s) => [s.slug, s.constructor_id]));
const socioDe = (v) => {
  if (v.mentor_ref_id) return v.mentor_ref_id;
  const m = /^\/productos\/([^/?#]+)/.exec(v.page_entry ?? '');
  return m ? (porSlug.get(m[1]) ?? m[1]) : '(sin socio)';
};
const dia = (iso) => new Date(iso).toLocaleDateString('es-CO', { timeZone: 'America/Bogota', month: '2-digit', day: '2-digit' });
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)} %` : '—');
const cop = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;

// ── Por socio ───────────────────────────────────────────────────────────────
const filas = new Map();
const fila = (k) => filas.get(k) ?? filas.set(k, { socio: k, visitas: 0, 'en celular': 0, enviados: 0, 'pagó en la hoja': 0, registrados: 0, 'con el socio': 0, 'a Gano': 0, vendido: 0 }).get(k);
for (const v of visitas ?? []) {
  const f = fila(socioDe(v));
  if (v.origen === 'catalogo') { f.visitas++; if (v.dispositivo === 'celular') f['en celular']++; }
  else if (v.destino === 'web') f['pagó en la hoja']++;
  else f.enviados++;
}
for (const p of pedidos ?? []) {
  const f = fila(p.constructor_id ?? '(sin socio)');
  f.registrados++;
  if (p.estado === 'pago_socio') f['con el socio']++;
  else if (/gano/.test(p.estado ?? '')) f['a Gano']++;
  f.vendido += Number(p.total_cop) || 0;
}
const tabla = [...filas.values()].sort((a, b) => b.visitas - a.visitas).map((f) => ({ ...f, 'enviados/visitas': pct(f.enviados + f['pagó en la hoja'], f.visitas), vendido: cop(f.vendido) }));
console.log(`\n📦 La tienda del socio, últimos ${dias} días (desde ${dia(desde)})\n`);
console.log('Por socio: visitas al catálogo → pedidos enviados desde la tienda → registrados por Queswa');
console.table(tabla);

// ── Por producto ────────────────────────────────────────────────────────────
const prod = new Map();
const pf = (k) => prod.get(k) ?? prod.set(k, { producto: k, 'en carritos enviados': 0, 'unidades enviadas': 0, 'registrados por Queswa': 0, 'unidades registradas': 0 }).get(k);
let enviadosConLineas = 0;
for (const v of visitas ?? []) {
  if (v.origen !== 'pedido' || !Array.isArray(v.detalle?.lineas)) continue;
  enviadosConLineas++;
  for (const l of v.detalle.lineas) { const f = pf(l.id); f['en carritos enviados']++; f['unidades enviadas'] += Number(l.cantidad) || 0; }
}
for (const p of pedidos ?? []) {
  for (const l of Array.isArray(p.lineas) ? p.lineas : []) { const f = pf(l.slug ?? l.nombre); f['registrados por Queswa']++; f['unidades registradas'] += Number(l.cantidad) || 0; }
}
console.log(`\nPor producto (las líneas del carrito se guardan desde el 2 nov 2026: ${enviadosConLineas} envío(s) las traen)`);
console.table([...prod.values()].sort((a, b) => b['unidades registradas'] - a['unidades registradas'] || b['unidades enviadas'] - a['unidades enviadas']));

// ── Por día ─────────────────────────────────────────────────────────────────
const dias_ = new Map();
const df = (k) => dias_.get(k) ?? dias_.set(k, { día: k, visitas: 0, enviados: 0, registrados: 0 }).get(k);
for (const v of visitas ?? []) { const f = df(dia(v.timestamp)); if (v.origen === 'catalogo') f.visitas++; else f.enviados++; }
for (const p of pedidos ?? []) df(dia(p.creado_at)).registrados++;
console.log('\nPor día');
console.table([...dias_.values()]);

if (pedidos?.length) {
  console.log('\nLos pedidos registrados');
  console.table(pedidos.sort((a, b) => (a.creado_at < b.creado_at ? 1 : -1)).map((p) => ({ día: dia(p.creado_at), pedido: p.codigo, cliente: p.nombre, socio: p.socio, estado: p.estado, total: cop(Number(p.total_cop) || 0) })));
}
