/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Batería de clasificación — ¿cada pregunta llega al arsenal que la responde?
 *
 * Nació el 9 ago 2026, después de que la prueba de las seis preguntas en WhatsApp
 * devolviera tres respuestas improvisadas. Ninguna se oía mal; una afirmaba sobre
 * Gano Excel algo que nadie puede sostener si el prospecto verifica. **El fallo de
 * enrutamiento no se escucha — solo se mide.** De ahí este script.
 *
 * Replica el orden real de `consultarArsenalHibrido()`:
 *
 *   1. `clasificarDocumentoHibrido()`  — regex, 0ms, corre PRIMERO y gana
 *   2. `clasificarDocumentoVectorial()` — Voyage sobre FRAGMENTOS, solo si (1) calló
 *
 * Los patrones se extraen del propio `route.ts`, así que el resultado se mueve
 * cuando alguien los edita — que es justamente lo que hay que poder ver.
 *
 * Uso:
 *   node scripts/benchmark-clasificador.mjs             # tenant whatsapp
 *   node scripts/benchmark-clasificador.mjs --detalle   # muestra el fragmento ganador
 *   node scripts/benchmark-clasificador.mjs --tenant creatuactivo_marketing
 *
 * Sale con código 1 si alguna consulta ESPERADA falla, para poder encadenarlo.
 */

import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const DETALLE = process.argv.includes('--detalle');
const SIN_MANEJO = process.argv.includes('--sin-manejo');
const SIN_CIERRE = process.argv.includes('--sin-cierre');
const TENANT = (() => {
  const i = process.argv.indexOf('--tenant');
  return i > -1 ? process.argv[i + 1] : 'whatsapp';
})();

const UMBRAL = 0.4; // el mismo que aplica clasificarDocumentoVectorial()

// ─── Casos ────────────────────────────────────────────────────────────────────
// `esperado: null` = no nos importa a dónde vaya, solo que no rompa nada.
// Las seis primeras son las de la prueba del canal (docs/handoff/queswa/).
const CASOS = [
  // — Las 6 de la prueba del canal —
  // Chip 1: en producción NO llega aquí — lo intercepta Camino A (match exacto
  // contra QUESWA_QUICK_REPLIES → MASTER_WHY_02) y en WhatsApp el botón dictado.
  // Se deja sin expectativa porque el clasificador nunca lo ve.
  ['¿Y esto cómo funciona, exactamente?',        null],
  ['¿Esto es una pirámide?',                     'arsenal_inicial'],
  ['¿Cuánto cuesta empezar?',                    'arsenal_inicial'],
  ['¿Tengo que comprar todos los meses?',        'arsenal_inicial'],
  ['¿Hay capacitación?',                         'arsenal_inicial'],
  ['Quiero iniciar',                             null], // lo intercepta wa-radicacion antes del motor

  // — Prueba del Director, 19 ago 2026 (auditoría UX del canal) —
  // "ingresos por paquetes" es GEN5: compensación, y el pin debe dictar el
  // ejemplo (eso lo verifica el código del pin, no este benchmark).
  ['cómo son los ingresos por paquetes empresariales', 'arsenal_compensacion'],
  // El bot ofreció "¿le explico cómo se inicia con este paquete?" y la persona
  // aceptó: la aceptación busca con esa pregunta. Es PROCESO (ACTIVACION_01),
  // no composición del paquete — así entró "Presencial / con el socio / desde
  // aquí", tres formas inventadas por el modelo.
  ['¿Le explico cómo se inicia con este paquete?',  'arsenal_inicial'],
  ['cómo se inicia con el paquete Empresarial',      'arsenal_inicial'],
  ['cuál es el proceso para iniciar con el ESP-2',   'arsenal_inicial'],

  // — Primer contacto —
  ['¿Qué es CreaTuActivo?',                      'arsenal_inicial'],
  ['¿Quién está detrás de esto?',                'arsenal_inicial'],
  ['¿De dónde sale el dinero?',                  'arsenal_inicial'],
  ['¿Es una estafa?',                            'arsenal_inicial'],
  ['¿Es esto legal?',                            'arsenal_inicial'],
  ['¿Esto es para alguien como yo?',             'arsenal_inicial'],
  ['¿Tengo que ser vendedor?',                   'arsenal_inicial'],
  ['¿Tengo que buscar a mis amigos?',            'arsenal_inicial'],
  ['¿Puedo heredar esto a mi familia?',          'arsenal_inicial'],
  ['¿Qué pasa si quiero salirme?',               'arsenal_inicial'],
  ['¿El mercado no está saturado?',              'arsenal_inicial'],
  // catalogo_productos es correcto: CIENCIA_01 responde el respaldo científico.
  // FREQ_07 (INVIMA/TGA) es el encuadre de primer contacto, pero las dos sirven.
  ['¿Los productos tienen respaldo científico?', 'catalogo_productos'],
  ['No tengo tiempo',                            'arsenal_inicial'],
  ['Es mucho dinero',                            'arsenal_inicial'],
  ['¿Puedo participar si vivo en España?',       'arsenal_inicial'],
  ['¿Qué hago en el día a día?',                 'arsenal_inicial'],
  ['¿Cuál es mi rol exactamente?',               'arsenal_inicial'],
  ['¿Realmente puedo hacer esto sin dejar mi empleo?', 'arsenal_inicial'],
  ['¿Hay formación?',                            'arsenal_inicial'],
  ['¿Dan entrenamiento?',                        'arsenal_inicial'],

  // — Compensación —
  ['¿Cómo funciona el bono GEN5?',               'arsenal_compensacion'],
  // 22 ago 2026: «el otro bono, el de los paquetes» caía al vector y el modelo inventó nombre y cifras
  ['explícame el otro bono, el de los paquetes', 'arsenal_compensacion'],
  ['el bono de los paquetes',                    'arsenal_compensacion'],
  ['¿Qué es el binario?',                        'arsenal_compensacion'],
  ['¿Cuántos PV necesito al mes?',               'arsenal_compensacion'],
  ['¿Qué es el GCV?',                            'arsenal_compensacion'],

  // — Catálogo —
  ['¿Cuánto vale el Ganocafé 3 en 1?',           'catalogo_productos'],
  ['¿Qué es el Ganoderma lucidum?',              'catalogo_productos'],
  ['¿Tienen jabón?',                             'catalogo_productos'],

  // — 12 niveles —
  ['¿Qué son los 12 niveles?',                   'arsenal_12_niveles'],
  ['¿Cómo funciona la duplicación 2x2?',         'arsenal_12_niveles'],
  ['hay una opción menor al paquete esp1',       'arsenal_12_niveles'], // 22 ago: INV_00 (Kit de Inicio); antes → compensación, tabla del ESP-1

  // — Avanzado —
  ['¿La urgencia es real o es marketing?',       'arsenal_inicial'],
  // 19 ago: puertas nuevas — la marca y el alcance internacional
  ['¿Gano iTouch es lo mismo que Gano Excel?',   'arsenal_inicial'],
  ['¿en qué países puedo desarrollar esto?',     'arsenal_inicial'],  // 19 ago: ADV_OBJ_03 salió con la etapa fundacional; ahora responde EAM_03
  ['¿Yo tengo que enseñarles?',                  'arsenal_avanzado'],

  // — Todo lo que atrapa `patrones_manejo`, con el arsenal donde vive la respuesta.
  //   Verificado contra la base el 9 ago 2026: 7 de 9 están en arsenal_inicial.
  ['¿Esto es MLM?',                              'arsenal_inicial'],  // NET_01 / FREQ_13
  ['¿Necesito experiencia?',                     'arsenal_inicial'],  // PERFIL_01
  ['Yo no sé vender',                            'arsenal_inicial'],  // PERFIL_01
  // ADV_TECH_01 se titula "¿Puedo pausar mi negocio si me enfermo o viajo?" —
  // el vector acertó y la etiqueta estaba mal. FREQ_18 es sobre permanencia y
  // salida, que es otra pregunta.
  ['¿Puedo pausar?',                             'arsenal_avanzado'], // ADV_TECH_01
  ['¿Cómo son los pagos?',                       'arsenal_inicial'],  // FREQ_17
  ['¿Funciona en mi país?',                      'arsenal_inicial'],  // FREQ_19 / DIASPORA_01
  ['¿Qué soporte tengo?',                        'arsenal_inicial'],  // FREQ_08
];

// ─── Capa 1: los patrones, extraídos de route.ts ──────────────────────────────
const SRC = fs.readFileSync('src/app/api/nexus/route.ts', 'utf8');

function extraerArray(nombre) {
  const i = SRC.indexOf(`const ${nombre} = [`);
  if (i < 0) return [];
  const j = SRC.indexOf('\n  ];', i);
  return [...SRC.slice(i, j).matchAll(/^\s*\/((?:[^/\\\n]|\\.)+)\/([gimsuy]*)\s*,/gm)]
    .map(m => { try { return new RegExp(m[1], m[2].replace('g', '')); } catch { return null; } })
    .filter(Boolean);
}

const P = Object.fromEntries(
  ['patrones_productos', 'patrones_beneficios_productos', 'patrones_12_niveles',
   'patrones_compensacion', 'patrones_paquetes', 'patrones_inicial',
   'patrones_manejo', 'patrones_cierre'].map(n => [n, extraerArray(n)]),
);

const vacios = Object.entries(P).filter(([, v]) => v.length === 0).map(([k]) => k);
if (vacios.length) {
  console.warn(`⚠️  No se pudo extraer: ${vacios.join(', ')} — ¿cambió la forma del array en route.ts?\n`);
}

const pega = (n, q) => P[n].some(r => r.test(q));

// PRIORIDAD 1 — no es un array, es un regex suelto en route.ts. Se extrae por su
// nombre para que la batería no invente fallos que en producción no ocurren.
const RE_GEN5 = (() => {
  const m = SRC.match(/const esGEN5oCompensacion = \/(.+?)\/([gimsuy]*)\.test/s);
  if (!m) { console.warn('⚠️  No se pudo extraer esGEN5oCompensacion\n'); return null; }
  try { return new RegExp(m[1], m[2].replace('g', '')); } catch { return null; }
})();

// PRIORIDAD 1.7 — proceso de inicio (19 ago 2026). Dos regex en una línea:
// el positivo y la exclusión (bono / gen5 / binario), ambos extraídos de route.ts.
const RE_PROCESO = (() => {
  const m = SRC.match(/const esProcesoDeInicio = \/(.+?)\/([gimsuy]*)\.test\(messageLower\)\s*&&\s*!\/(.+?)\/([gimsuy]*)\.test/s);
  if (!m) { console.warn('⚠️  No se pudo extraer esProcesoDeInicio\n'); return null; }
  try { return { si: new RegExp(m[1], m[2].replace('g', '')), no: new RegExp(m[3], m[4].replace('g', '')) }; } catch { return null; }
})();

function porPatrones(q) {
  const m = q.toLowerCase();
  if (RE_GEN5 && RE_GEN5.test(m)) return 'arsenal_compensacion';
  if (RE_PROCESO && RE_PROCESO.si.test(m) && !RE_PROCESO.no.test(m)) return 'arsenal_inicial';
  if (pega('patrones_productos', m) || pega('patrones_beneficios_productos', m)) return 'catalogo_productos';
  if (pega('patrones_12_niveles', m)) return 'arsenal_12_niveles';
  if (pega('patrones_compensacion', m)) return 'arsenal_compensacion';
  if (pega('patrones_paquetes', m)) return 'arsenal_avanzado';
  // --sin-manejo: A/B para decidir si `patrones_manejo` debe retirarse. Enruta a
  // arsenal_avanzado porque los arsenales `manejo` y `cierre` se consolidaron ahí,
  // pero las respuestas de casi todo lo que atrapa viven hoy en arsenal_inicial.
  const i = pega('patrones_inicial', m);
  const g = SIN_MANEJO ? false : pega('patrones_manejo', m);
  const c = SIN_CIERRE ? false : pega('patrones_cierre', m);
  if (i && !g && !c) return 'arsenal_inicial';
  if (g || c) return 'arsenal_avanzado';
  return null;
}

// ─── Capa 2: el vector, sobre fragmentos ──────────────────────────────────────
const ARSENALES_PADRE = ['arsenal_inicial', 'arsenal_avanzado', 'arsenal_compensacion',
                         'arsenal_12_niveles', 'catalogo_productos', 'arsenal_ganocafe',
                         'arsenal_marca_personal'];
const ARSENALES_POR_TENANT = {
  creatuactivo_marketing: ['arsenal_inicial', 'arsenal_avanzado', 'arsenal_compensacion', 'arsenal_12_niveles', 'catalogo_productos'],
  whatsapp:               ['arsenal_inicial', 'arsenal_avanzado', 'arsenal_compensacion', 'arsenal_12_niveles', 'catalogo_productos'],
  ecommerce:              ['arsenal_ganocafe', 'catalogo_productos'],
  marca_personal:         ['arsenal_marca_personal'],
};

const arsenalPadre = (cat) => {
  const c = ARSENALES_PADRE.filter(p => cat.startsWith(p + '_'));
  return c.length ? c.reduce((a, b) => (b.length > a.length ? b : a)) : null;
};

const cos = (a, b) => {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
};
const vec = v => (typeof v === 'string' ? JSON.parse(v) : v);

async function embeber(textos) {
  const out = [];
  for (let i = 0; i < textos.length; i += 64) {
    const r = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.VOYAGE_API_KEY}` },
      body: JSON.stringify({ input: textos.slice(i, i + 64), model: 'voyage-3-lite', output_dimension: 512, input_type: 'query' }),
    });
    const j = await r.json();
    if (!j.data) { console.error('Voyage:', JSON.stringify(j).slice(0, 300)); process.exit(1); }
    out.push(...j.data.map(d => d.embedding));
  }
  return out;
}

// ─── Corrida ──────────────────────────────────────────────────────────────────
const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await supa.from('nexus_documents')
  .select('category, embedding_512, metadata')
  .eq('tenant_id', TENANT).not('embedding_512', 'is', null);

const permitidos = ARSENALES_POR_TENANT[TENANT] ?? ARSENALES_POR_TENANT.creatuactivo_marketing;
const F = (data || [])
  .filter(d => d.metadata?.is_fragment === true)
  .map(d => ({ c: d.category, p: arsenalPadre(d.category), e: vec(d.embedding_512) }))
  .filter(f => f.p && permitidos.includes(f.p));

console.log(`\ntenant: ${TENANT}  ·  fragmentos candidatos: ${F.length}  ·  umbral: ${UMBRAL}\n`);

const E = await embeber(CASOS.map(c => c[0]));
let ok = 0, mal = 0, nulo = 0, ignorados = 0;
const fallos = [];

CASOS.forEach(([q, esperado], i) => {
  let ruta = porPatrones(q), via = 'patrón';
  let top = null;
  if (!ruta) {
    top = F.map(f => ({ c: f.c, p: f.p, s: cos(E[i], f.e) })).sort((a, b) => b.s - a.s)[0];
    ruta = top && top.s >= UMBRAL ? top.p : null;
    via = 'vector';
  }

  if (esperado === null) { ignorados++; }
  else if (ruta === esperado) ok++;
  else if (ruta === null) { nulo++; fallos.push([q, esperado, 'null']); }
  else { mal++; fallos.push([q, esperado, ruta]); }

  const marca = esperado === null ? '  ' : ruta === esperado ? '✅' : ruta === null ? '⬜' : '❌';
  const extra = DETALLE && top ? `  ${top.s.toFixed(3)} ${top.c}` : '';
  console.log(`${marca} ${q.padEnd(46)} ${(ruta || 'null').padEnd(22)} ${via}${extra}`);
});

const evaluados = ok + mal + nulo;
console.log(`\n${'─'.repeat(64)}`);
console.log(`acierta ${ok}/${evaluados}  ·  enruta mal ${mal}  ·  cae a null ${nulo}  ·  ${ignorados} sin expectativa`);
if (fallos.length) {
  console.log('\nFallos:');
  fallos.forEach(([q, e, r]) => console.log(`  · "${q}"  esperado ${e}, obtuvo ${r}`));
  console.log('\nnull es el PEOR desenlace, no el neutro: el pipeline salta el bloque');
  console.log('de fragmentos y el modelo responde de memoria.');
}
process.exit(fallos.length ? 1 : 0);
