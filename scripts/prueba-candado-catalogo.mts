/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿La tabla con candado llega LITERAL cuando la pregunta es colectiva?
 * (12 sep 2026)
 *
 * Las cinco tablas del catálogo llevan `<verbatim_lock>` desde mayo, con un
 * motivo escrito: sin él el modelo simplifica los nombres —«Ganotea», «Gano
 * Supreme»— y se salta categorías enteras. El 12 sep se comprobó que en el
 * catálogo ese candado **no hacía nada**, por tres defectos encadenados:
 *
 *   1. La puerta directa de bebidas exigía el artículo «las», así que «¿cuáles
 *      son SUS bebidas?» no la abría (la de suplementos abre con la palabra
 *      suelta — por eso esa sí funcionaba).
 *   2. Caía al vector, donde el título de BEB_01 —cinco preguntas, tres sobre
 *      «productos» en general— repartía la señal y la ficha del té ganaba.
 *   3. Y aunque la tabla ganara, la regla «la ficha le gana a la tabla» la
 *      retiraba igual: se escribió para cuando la persona pregunta por UN
 *      producto, y nunca comprobaba que lo hubiera nombrado.
 *
 * Resultado real: «¿cuáles son sus bebidas?» devolvía cuatro de nueve, sin
 * precios, con «Ganocafé Mocha» y «Gano Chocolate» inventados.
 *
 * Esta batería mide lo único que importa: que la respuesta CONTENGA la tabla
 * verbatim. No se fía del parecido — compara contra el cuerpo del candado tal
 * como está en la base.
 *
 *   npx tsx scripts/prueba-candado-catalogo.mts
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const BASE = process.env.PRUEBA_BASE || 'https://creatuactivo.com';
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Preguntas COLECTIVAS: no nombran producto, así que deben recibir la tabla.
const CASOS: [string, string][] = [
  ['¿cuáles son sus bebidas?',              'catalogo_productos_BEB_01'],
  ['qué bebidas tienen',                    'catalogo_productos_BEB_01'],
  ['¿cuáles son las bebidas?',              'catalogo_productos_BEB_01'],
  ['háblame de las bebidas',                'catalogo_productos_BEB_01'],
  ['¿cuáles son los suplementos?',          'catalogo_productos_SUP_01'],
  ['qué suplementos tienen',                'catalogo_productos_SUP_01'],
  ['¿qué productos de cuidado personal tienen?', 'catalogo_productos_PERS_01'],
];
// Y la contraparte: quien SÍ nombra un producto recibe su ficha, no la tabla.
const FICHAS: [string, RegExp][] = [
  ['¿cuánto vale el Ganocafé 3 en 1?', /110\.900/],
  ['¿qué es el Cordygold?',            /Cordygold/i],
];

let fallos = 0;
const es = (ok: boolean, q: string) => { console.log(`  ${ok ? '✅' : '❌'} ${q}`); if (!ok) fallos++; };

async function preguntar(q: string): Promise<string> {
  const fp = `wa_57300${String(Date.now()).slice(-7)}`;
  const r = await fetch(`${BASE}/api/nexus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'whatsapp' },
    body: JSON.stringify({ messages: [{ role: 'user', content: q }], sessionId: fp, fingerprint: fp, pageContext: 'whatsapp' }),
  });
  return r.ok ? (await r.text()).trim() : '';
}

async function cuerpoDelCandado(categoria: string): Promise<string> {
  const { data } = await s.from('nexus_documents').select('content')
    .eq('tenant_id', 'whatsapp').eq('category', categoria).maybeSingle();
  return (data?.content?.match(/<verbatim_lock>\s*([\s\S]*?)\s*<\/verbatim_lock>/) || [])[1] || '';
}

console.log(`\n── La tabla con candado, ante una pregunta colectiva (${BASE}) ──`);
for (const [q, cat] of CASOS) {
  const [texto, lock] = await Promise.all([preguntar(q), cuerpoDelCandado(cat)]);
  if (!lock) { es(false, `«${q}» — no encontré el candado de ${cat}`); continue; }
  // La fila más característica de la tabla: la primera con precio.
  const fila = lock.split('\n').find((l) => /^\|\s*\*\*/.test(l))?.trim() || lock.slice(0, 80);
  es(texto.includes(fila), `«${q}» → llega la tabla de ${cat.replace('catalogo_productos_', '')}`);
  if (!texto.includes(fila)) console.log(`      esperaba la fila: ${fila.slice(0, 90)}\n      recibió: ${texto.slice(0, 160).replace(/\n/g, ' ⏎ ')}`);
}

console.log('\n── Y quien nombra un producto sigue recibiendo su ficha ──');
for (const [q, re] of FICHAS) {
  const texto = await preguntar(q);
  es(re.test(texto), `«${q}» → ${re}`);
}

console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : '\n✅ El candado del catálogo llega literal\n');
process.exit(fallos ? 1 : 0);
