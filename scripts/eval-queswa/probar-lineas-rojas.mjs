// Prueba sin costo del detector de líneas rojas de la evaluación (5 nov 2026).
//
//   npx tsx scripts/eval-queswa/probar-lineas-rojas.mjs     (exit 1 si falla)
//
// Las dos direcciones:
//   1. El copy aprobado PASA: el cuerpo de cada fragmento del arsenal vigente
//      (tenant whatsapp) y cada texto dictado de respuestas-maestras.ts. Un
//      hallazgo aquí es un falso positivo del detector, y se corrige el detector.
//   2. Lo que salió mal en el tráfico real CAE: frases tomadas de la auditoría
//      del 24 oct al 4 nov 2026.
import { config } from 'dotenv'; config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const { lineasRojasEn } = await import('./lineas-rojas.mjs');
const maestras = await import('../../src/lib/respuestas-maestras.ts');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
let fallos = 0;

// ── 1. El copy aprobado pasa ─────────────────────────────────────────────────
// El cuerpo de un fragmento, sin la línea de disparadores ni las instrucciones
// internas (misma partición que auditar-frases-vetadas.mjs).
const cuerpoDe = (contenido) => {
  const lineas = contenido.split('\n');
  const sin = (lineas[0].trimStart().startsWith('###') ? lineas.slice(1) : lineas).join('\n');
  return sin.split('\n\n')
    .filter((b) => !b.startsWith('###') && !/^\s*(\*\*)?\[|^\s*⚠️\s*\*\*QUESWA|^\s*\*\*\[INSTRUCC/i.test(b))
    .join('\n\n')
    .replace(/<\/?verbatim_lock>/g, '');
};
const { data: frags, error } = await s.from('nexus_documents').select('category, content, metadata').eq('tenant_id', 'whatsapp');
if (error) { console.error(error.message); process.exit(1); }
const aprobados = frags.filter((f) => f.metadata?.is_fragment === true).map((f) => [f.category, cuerpoDe(f.content)]);
// Los textos dictados del backend: toda cadena exportada, y las de los objetos exportados.
const recoger = (v, ruta, out) => {
  if (typeof v === 'string' && v.length > 40) out.push([ruta, v]);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) recoger(x, `${ruta}.${k}`, out);
};
for (const [k, v] of Object.entries(maestras)) recoger(v, `respuestas-maestras.${k}`, aprobados);

let falsos = 0;
for (const [donde, texto] of aprobados) {
  const h = lineasRojasEn(texto);
  if (h.length) { falsos++; console.log(`  ❌ ${donde}: ${h.join(' · ')}`); }
}
console.log(`${falsos ? '❌' : '✅'} copy aprobado: ${aprobados.length - falsos} de ${aprobados.length} textos pasan`);
fallos += falsos;

// ── 2. Lo que salió mal cae ──────────────────────────────────────────────────
const MALOS = [
  'Con gusto, Liliana, aunque debo ser honesta con usted en este punto.',
  'Patricia, le voy a ser honesta, porque creo que eso es lo que más le sirve aquí.',
  'Patricia, voy a ser directa: la estructura de ese mensaje la aprobó el Director.',
  'Lo que el material recuperado me trae con detalle son cuatro de ellos.',
  'El fragmento con candado es el que responde la pregunta de frente.',
  'cada cliente que llega por su enlace queda a su nombre para siempre.',
  'Por eso el activo que construye es una base de clientes que produce mes a mes.',
  'Ese pedido le deja a usted un porcentaje, mes tras mes.',
  '¿Y si hay una inteligencia artificial que trabaja por ti mientras duermes?',
  'Son productos de consumo diario, y por eso son los que más recompras generan.',
];
for (const t of MALOS) {
  const h = lineasRojasEn(t);
  if (!h.length) { fallos++; console.log(`  ❌ no cae: «${t}»`); }
}
console.log(`${MALOS.every((t) => lineasRojasEn(t).length) ? '✅' : '❌'} fallas reales: ${MALOS.filter((t) => lineasRojasEn(t).length).length} de ${MALOS.length} caen`);

process.exit(fallos ? 1 : 0);
