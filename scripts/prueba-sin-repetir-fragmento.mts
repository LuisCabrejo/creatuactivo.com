/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El anillo de ofertas — caso María Angel (21 sep 2026).
 *
 *   npx tsx scripts/prueba-sin-repetir-fragmento.mts        (exit 1 si falla)
 *
 * ── QUÉ PASÓ ─────────────────────────────────────────────────────────────────
 *
 * María, socia, dijo «Si» OCHO veces seguidas entre las 8:03 y las 9:03. Cada
 * fragmento cerraba ofreciendo el siguiente, y el grafo de esas ofertas tenía
 * un ciclo que nadie dibujó:
 *
 *   GEN5 → Binario → condiciones de cobro → recompra → PV → 100 PV → GEN5 …
 *
 * Los turnos 10 y 11 fueron los turnos 4 y 5. Habría girado mientras ella
 * siguiera diciendo que sí.
 *
 * ⛔ LO QUE NO SE HIZO, y por qué (Director, 23 sep 2026): pasarle al modelo
 * los fragmentos ya servidos como lista de lo que no debe repetir. Nombrar algo
 * sube su probabilidad, venga o no con un «no» delante — es la misma regla que
 * sacó el `[Concepto Nuclear]` del fragmento en vez de pedirle que lo ignorara.
 * La exclusión vive en la RECUPERACIÓN: el fragmento no entra al contexto, así
 * que no hay nada que repetir y no hay nada que instruir.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { sinLoYaServido, fragmentosServidos } from '../src/lib/queswa-conductor.ts';

let fallos = 0;
const es = (cond: unknown, msg: string) => {
  console.log(`${cond ? '✅' : '❌'} ${msg}`);
  if (!cond) fallos++;
};
const frag = (category: string) => ({ category, similarity: 0 });
const cats = (xs: { category: string }[]) => xs.map((x) => x.category);

console.log('── 1. Sin historial, la recuperación no cambia en NADA ──');
// La garantía que importa: con la lista vacía devuelve el MISMO arreglo, así que
// el camino por defecto —toda consulta en frío— es idéntico al de antes.
const candidatos = [frag('arsenal_compensacion_COMP_BIN_08'), frag('arsenal_compensacion_COMP_GEN5'), frag('arsenal_inicial_FREQ_03')];
es(sinLoYaServido(candidatos, []) === candidatos, 'con la lista vacía devuelve el mismo arreglo, sin copiar ni filtrar');
es(cats(sinLoYaServido([], ['arsenal_inicial_WHY_01'])) .length === 0, 'sin candidatos no hace nada');

console.log('\n── 2. El anillo de María: el turno 10 ya no recibe el GEN5 ──');
// Lo que el hilo había servido cuando ella dijo el octavo «Si».
const servidosMaria = [
  'arsenal_compensacion_COMP_GEN5',   // turno 4
  'arsenal_compensacion_COMP_BIN_08', // turno 5
  'arsenal_inicial_FREQ_20',          // turno 6 — condiciones de cobro
  'arsenal_compensacion_COMP_PV_06',  // turno 8
];
const turno10 = sinLoYaServido(
  [frag('arsenal_compensacion_COMP_GEN5'), frag('arsenal_compensacion_COMP_PAQ_04'), frag('arsenal_inicial_FREQ_03')],
  servidosMaria,
);
es(!cats(turno10).includes('arsenal_compensacion_COMP_GEN5'), 'el GEN5, servido en el turno 4, sale de los candidatos');
es(turno10.length === 2 && cats(turno10)[0] === 'arsenal_compensacion_COMP_PAQ_04', 'y el segundo candidato pasa a encabezar: material NUEVO');

console.log('\n── 3. El bucle de Oswaldo: el candado deja de ganar cuatro veces ──');
// FREQ_30 dictado en el turno 7; en el 8 el vector lo volvía a poner primero.
const turnoSiguiente = sinLoYaServido(
  [frag('arsenal_inicial_FREQ_30'), frag('arsenal_inicial_FREQ_03'), frag('arsenal_compensacion_COMP_PAQ_01')],
  ['arsenal_inicial_FREQ_30'],
);
es(cats(turnoSiguiente)[0] === 'arsenal_inicial_FREQ_03', 'FREQ_30 sale y encabeza la tabla de los tres paquetes');

console.log('\n── 4. Las dos guardas, las dos hacia servir de más ──');
for (const pide of ['repítame eso', 'muéstreme otra vez el binario', 'de nuevo por favor', 'vuelva a explicar lo del GEN5']) {
  es(sinLoYaServido(candidatos, ['arsenal_compensacion_COMP_BIN_08'], pide).length === 3,
     `«${pide}» → se le sirve igual, lo está pidiendo`);
}
const todoServido = sinLoYaServido(candidatos, cats(candidatos));
es(todoServido.length === 3, 'si al excluir no queda ninguno, no se excluye nada — un turno sin material es peor');

console.log('\n── 5. Lo que NO se toca ──');
es(sinLoYaServido(candidatos, ['PIN_CIFRAS_BACKEND_DICTATOR', 'CICLO_CALCULADO_BACKEND']).length === 3,
   'los marcadores del backend no son candidatos de búsqueda y no excluyen nada');
es(cats(sinLoYaServido(candidatos, ['arsenal_inicial_WHY_02'])).length === 3,
   'un fragmento servido que no está entre los candidatos no cambia el orden');

console.log('\n── 6. Leer lo servido: la RUTA del arsenal nunca cuenta como fragmento ──');
// `documents_used` guardaba `/knowledge_base/arsenal_conversacional_compensacion.txt`
// para todo el camino vectorial. Excluir por eso habría sacado el arsenal ENTERO.
const filas = [
  { metadata: { documents_used: ['/knowledge_base/arsenal_conversacional_compensacion.txt', 'arsenal_compensacion_COMP_GEN5_08'] } },
  { metadata: { documents_used: ['arsenal_inicial_FREQ_30'] } },
  { metadata: { documents_used: ['PIN_CIFRAS_BACKEND_DICTATOR', 'CICLO_CALCULADO_BACKEND', 'RADICACION_BACKEND'] } },
  { metadata: { documents_used: ['catalogo_productos_BEB_01'] } },
  { metadata: null },
  { metadata: { documents_used: 'no es un arreglo' } },
];
const leidos = fragmentosServidos(filas as never);
es(!leidos.some((c) => c.includes('/')), 'ninguna ruta de archivo entra a la lista');
es(!leidos.some((c) => c.startsWith('arsenal_conversacional')), 'el arsenal entero NUNCA se excluye: solo fragmentos');
es(!leidos.some((c) => /^(PIN_|CICLO_|RADICACION_)/.test(c)), 'los marcadores del backend quedan fuera');
es(leidos.includes('arsenal_compensacion_COMP_GEN5_08') && leidos.includes('arsenal_inicial_FREQ_30') && leidos.includes('catalogo_productos_BEB_01'),
   'los tres fragmentos reales sí entran');
es(leidos.length === 3, `y solo esos tres (fueron ${leidos.length})`);
es(fragmentosServidos([] as never).length === 0, 'un hilo nuevo no trae nada');

console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`❌ ${fallos} comprobación(es) fallaron`); process.exit(1); }
console.log('✅ El anillo no gira, y la consulta en frío no cambió');
