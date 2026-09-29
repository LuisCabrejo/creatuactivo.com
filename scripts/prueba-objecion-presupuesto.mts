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

  // ── Preguntas de precio y otras: el candado se sigue dictando ─────────────
  { frase: 'cuánto cuesta el kit de inicio', objecion: false },
  { frase: 'cuál es el precio del ganocafé', objecion: false },
  { frase: 'cuál es el más barato', objecion: false },
  { frase: 'tiene descuento el cliente preferencial?', objecion: false },
  { frase: '¿me afecta el café si tengo gastritis?', objecion: false, nota: 'es salud, no bolsillo' },
  { frase: 'cuánto hay que invertir para empezar', objecion: false },
];

let fallos = 0;
console.log(`💸 ¿Objeción de presupuesto o pregunta de precio?  (${CASOS.length} casos)\n`);
for (const c of CASOS) {
  const r = RE_OBJECION_PRESUPUESTO.test(c.frase);
  const ok = r === c.objecion;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${r ? 'objeción ' : 'pregunta '} «${c.frase}»${ok ? '' : ` — esperaba ${c.objecion ? 'objeción' : 'pregunta'}`}${c.nota ? `   — ${c.nota}` : ''}`);
}
console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`🔴 ${fallos} caso(s) fallaron.`); process.exit(1); }
console.log('✅ Todos los casos pasan.');
