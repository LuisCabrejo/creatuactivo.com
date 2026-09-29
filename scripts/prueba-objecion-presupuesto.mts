/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿La objeción de PRESUPUESTO se distingue de la pregunta de PRECIO?
 *
 *   npx tsx scripts/prueba-objecion-presupuesto.mts   (exit 1 si falla)
 *
 * Sin red y sin modelo. Cuando el mensaje es una objeción, el candado que ganó la
 * búsqueda baja a material y el modelo responde leyendo el turno (route.ts,
 * `_esObjecionPresupuesto`). Cuando es una pregunta de precio, el candado se
 * sigue dictando literal — la tabla de precios es exactamente lo que se pidió.
 *
 * Caso Yesid Triana (29 sep 2026): «¿no afecta el presupuesto de una persona en
 * productos de primera necesidad?» recibió dictado «Claro que sí, y es la puerta
 * más sencilla… ¿Le ayudo a abrir su código?».
 */
import { readFileSync } from 'node:fs';
import { config } from 'dotenv'; config({ path: '.env.local', quiet: true });
import { RE_OBJECION_PRESUPUESTO } from '../src/lib/queswa-conductor.ts';

const CASOS: { frase: string; objecion: boolean; nota?: string }[] = [
  // ── Objeciones: el candado baja a material ────────────────────────────────
  { frase: 'Con el costo de vida disparado. El costo de una caja de ganocafé, No afecta sú presupuesto a Una persona en productos de 1era necesidad ?', objecion: true, nota: 'Yesid, 29 sep 2026' },
  { frase: '110.900  Mé afecta a mi, en mis necesidades , salud, comida, servicios, ectra', objecion: true, nota: 'Yesid' },
  { frase: 'Si, pero . El mayor porcentaje de las personas, sobreviven a partir de un salario mínimo vital', objecion: true, nota: 'Yesid' },
  { frase: 'eso está muy caro para mí', objecion: true },
  { frase: 'no me alcanza la plata', objecion: true },
  { frase: 'no tengo con qué pagar eso ahora', objecion: true },
  { frase: 'uno a duras penas llega a fin de mes', objecion: true },
  { frase: 'estoy apretado este mes', objecion: true },
  { frase: 'eso sale caro o q', objecion: true, nota: 'la única objeción de precio real del tráfico (sep 2026)' },

  // ── Preguntas de precio y otras: el candado se sigue dictando ─────────────
  { frase: 'cuánto cuesta el kit de inicio', objecion: false },
  { frase: 'cuál es el precio del ganocafé', objecion: false },
  { frase: 'cuál es el más barato', objecion: false },
  { frase: 'tiene descuento el cliente preferencial?', objecion: false },
  { frase: '¿me afecta el café si tengo gastritis?', objecion: false, nota: 'es salud, no bolsillo' },
  { frase: 'cuánto hay que invertir para empezar', objecion: false },
];

// ── Las objeciones que se ANOTAN en la ficha (captureProspectData, route.ts) ──
// «real» suelto marcaba «confianza» a quien preguntó por el Gano C'Real y a Yesid
// por «una óptica real»; «no puedo pagarlo» contaba como falta de tiempo. Los
// patrones se leen de route.ts, así que la prueba no se desincroniza.
const fuente = readFileSync('src/app/api/nexus/route.ts', 'utf8');
const leer = (nombre: string) => {
  const m = fuente.match(new RegExp(`const ${nombre} = \\/((?:[^/\\\\\\n]|\\\\.)+)\\/([gimsuy]*);`));
  if (!m) throw new Error(`No se encontró ${nombre} en route.ts`);
  return new RegExp(m[1], m[2]);
};
const RE = { precio: leer('_reObjecionPrecio'), tiempo: leer('_reObjecionTiempo'), confianza: leer('_reObjecionConfianza') };
const anotadas = (t: string) => {
  const l = t.toLowerCase();
  const r: string[] = [];
  if (RE.precio.test(l) || RE_OBJECION_PRESUPUESTO.test(l)) r.push('precio');
  if (RE.tiempo.test(l)) r.push('tiempo');
  if (RE.confianza.test(l)) r.push('confianza');
  return r.join(',');
};
const FICHA: { frase: string; espera: string; nota?: string }[] = [
  { frase: 'No es q sea negativo. Es ver de una óptica Real. No folcloriko', espera: '', nota: 'Yesid — no es desconfianza' },
  { frase: "¿Qué es la espirulina Gano C'Real?", espera: '', nota: 'nombre del producto' },
  { frase: '110.900  Mé afecta a mi, en mis necesidades , salud, comida, servicios, ectra', espera: 'precio', nota: 'Yesid — esta sí' },
  { frase: 'es mucho dinero, no puedo pagarlo', espera: 'precio', nota: 'era «precio,tiempo»' },
  { frase: 'eso sale caro o q', espera: 'precio' },
  { frase: 'realmente me interesa', espera: '' },
  { frase: 'Carolina me pasó el enlace', espera: '', nota: '«caro» dentro de Carolina' },
  { frase: '¿esto es real?', espera: 'confianza' },
  { frase: 'me da miedo que sea una estafa', espera: 'confianza' },
  { frase: 'no tengo tiempo para otra cosa', espera: 'tiempo' },
  { frase: 'no puedo, estoy muy ocupado', espera: 'tiempo' },
];

let fallos = 0;
console.log(`💸 ¿Objeción de presupuesto o pregunta de precio?  (${CASOS.length} casos)\n`);
for (const c of CASOS) {
  const r = RE_OBJECION_PRESUPUESTO.test(c.frase);
  const ok = r === c.objecion;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${r ? 'objeción ' : 'pregunta '} «${c.frase}»${ok ? '' : ` — esperaba ${c.objecion ? 'objeción' : 'pregunta'}`}${c.nota ? `   — ${c.nota}` : ''}`);
}
console.log(`\n📝 Objeciones que se anotan en la ficha  (${FICHA.length} casos)\n`);
for (const c of FICHA) {
  const r = anotadas(c.frase);
  const ok = r === c.espera;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} «${c.frase}» → ${r || '(ninguna)'}${ok ? '' : ` — esperaba ${c.espera || '(ninguna)'}`}${c.nota ? `   — ${c.nota}` : ''}`);
}
console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`🔴 ${fallos} caso(s) fallaron.`); process.exit(1); }
console.log('✅ Todos los casos pasan.');
