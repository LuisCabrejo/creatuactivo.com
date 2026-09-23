/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El bucle del candado dictado — caso Oswaldo Romero (22 sep 2026).
 *
 *   npx tsx scripts/prueba-bucle-candado.mts        (exit 1 si falla)
 *
 * ── QUÉ PASÓ ─────────────────────────────────────────────────────────────────
 *
 * Oswaldo llegó por el enlace del Director a las 19:29, recorrió los tres
 * botones de la apertura y a las 19:47 preguntó con cuál paquete empezar.
 * Recibió `FREQ_30` bajo candado. Y lo volvió a recibir, palabra por palabra,
 * en los tres turnos siguientes:
 *
 *   «Sistema»              → el mismo párrafo
 *   «Con el del principio» → el mismo párrafo   ← ya había ELEGIDO
 *   «Que paquetes hay»     → el mismo párrafo   ← y aquí se fue
 *
 * Estaba caliente, con interés 21. El candado lo emite el backend sin pasar por
 * el modelo —así sale literal, que es lo que se quiere—, y el precio de eso es
 * que nada miraba el turno anterior: el modelo no podía arreglarlo porque nunca
 * vio el mensaje. Cuatro respuestas idénticas es una pared, no una conversación.
 *
 * ⚠️ Lo que NO se arregla aquí: que «Con el del principio» se lea como la
 * elección del paquete más bajo. Eso es enrutamiento de cierre y va aparte.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { candadoYaDicho } from '../src/lib/queswa-conductor.ts';

let fallos = 0;
const es = (cond: unknown, msg: string) => {
  console.log(`${cond ? '✅' : '❌'} ${msg}`);
  if (!cond) fallos++;
};

// El cuerpo tal como lo dicta el backend: candado + pregunta de seguimiento.
const FREQ_30 = 'Con el que le resulte cómodo hoy. Más allá del tamaño del paquete, lo importante es iniciar: el negocio no está en el paquete sino en el sistema que usted construye, y de paquete se puede subir después.\n\n¿Con cuál arranca?';

console.log('── 1. El turno que se repite se reconoce ──');
es(candadoYaDicho(FREQ_30, FREQ_30), 'el mismo texto, dos turnos seguidos');
// WhatsApp guarda el markdown del fragmento, y el canal convierte ** en *.
es(candadoYaDicho(FREQ_30.replace(/\*\*/g, '*'), FREQ_30), 'con el markdown del canal cambiado');
es(candadoYaDicho(`  ${FREQ_30.replace(/\n+/g, ' ')}  `, FREQ_30), 'con los saltos de línea colapsados');
// La pregunta de seguimiento puede variar sin que el cuerpo cambie.
es(candadoYaDicho(FREQ_30, FREQ_30.replace('¿Con cuál arranca?', '¿Con cuál prefiere arrancar?')),
   'aunque la pregunta de seguimiento sea otra: el cuerpo es el mismo');

console.log('\n── 2. Lo que NO es una repetición ──');
es(!candadoYaDicho('', FREQ_30), 'el primer turno del hilo (no hay mensaje anterior)');
es(!candadoYaDicho('¿Le muestro la estrategia con la que se construye ese sistema, paso a paso?', FREQ_30),
   'otro texto del bot antes');
es(!candadoYaDicho(FREQ_30, 'Con gusto.'), 'un cuerpo corto no se compara — dos «Con gusto.» seguidos son normales');
es(!candadoYaDicho(FREQ_30, 'Hay tres paquetes empresariales, cada uno con su inventario de productos: ESP-1 Inicial, ESP-2 Empresarial y ESP-3 Visionario.'),
   'la tabla de paquetes SÍ puede salir después del candado — es otra respuesta');

console.log('\n── 3. Los cuatro turnos de Oswaldo, en orden ──');
// Se simula el hilo: cada turno ve lo que el bot dijo en el anterior.
const turnos = ['Si', 'Sistema', 'Con el del principio', 'Que paquetes hay'];
let ultimoBot = '¿Por dónde seguimos: los números del plan, cómo arrancar, o qué trae cada paquete?';
let dictados = 0;
for (const t of turnos) {
  const repite = candadoYaDicho(ultimoBot, FREQ_30);
  if (!repite) { dictados++; ultimoBot = FREQ_30; }
  console.log(`   «${t}» → ${repite ? 'lo redacta el modelo (con el fragmento delante)' : 'se dicta el candado'}`);
}
es(dictados === 1, `el candado se dicta UNA vez en los cuatro turnos (fueron ${dictados})`);

console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`❌ ${fallos} comprobación(es) fallaron`); process.exit(1); }
console.log('✅ El candado no se repite');
