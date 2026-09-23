/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La pregunta de cierre con DOS SALIDAS.
 *
 *   npx tsx scripts/prueba-pregunta-dos-salidas.mts        (exit 1 si falla)
 *
 * El fallo que más gente nos costó en septiembre. Medido sobre 819 turnos de
 * personas reales: el abandono normal es del 15 %, y tras un «sí» que cayó al
 * vector sube al 71 %. De esos 41 casos, 16 eran preguntas de dos salidas y 15
 * mataron el hilo.
 *
 * ⚠️ Esta batería mide LAS DOS DIRECCIONES, como las de salud y negocio: que
 * cace las frases reales Y que no toque ni una de las aprobadas. Bloquear una
 * pregunta buena le cuesta una venta al socio, que también es daño.
 *
 * Las frases de abajo NO son inventadas: salen del volcado del mes.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { detectarPreguntaDeDosSalidas, podarPreguntaDeDosSalidas } from '../src/lib/guardarrail-pregunta.ts';

let fallos = 0;
const es = (cond: unknown, msg: string) => { console.log(`${cond ? '✅' : '❌'} ${msg}`); if (!cond) fallos++; };

// ── 1. Las que mataron hilos de verdad, del volcado del 23 sep ───────────────
console.log('── 1. Las frases reales que mataron el hilo ──');
const REALES = [
  ['¿Cuál de los dos tiene en su pedido?', 5],
  ['¿Cuál de los dos va más con su rutina?', 3],
  ['¿Cuál de los dos va más con su forma de tomar café?', 2],
  ['¿Cuál va más con su forma de tomar el café?', 1],
  ['¿Cuál se acerca más a como toma usted el café?', 1],
  ['¿prefiere el tinto solo o le gusta con crema y dulce?', 1],
  ['¿Cuál de los dos va más con su estilo?', 1],
  ['¿Cuál se acerca más a como toma el café normalmente?', 1],
] as const;
for (const [q, veces] of REALES) {
  const cuerpo = `El Ganocafé 3 en 1 viene endulzado y con crema, listo en un minuto. El Clásico es café negro, más robusto, sin dulce. Los dos llevan el mismo extracto de Ganoderma.\n\n${q}`;
  es(detectarPreguntaDeDosSalidas(cuerpo) === q, `se caza · ${veces} vez(ces) en el mes · ${q}`);
}

console.log('\n── 2. Otras formas de la misma falla ──');
for (const q of [
  '¿Le muestro los números, o prefiere ver primero los productos?',
  '¿Quiere que le cuente cómo se pide o prefiere el catálogo?',
  '¿Le paso el enlace o se lo explico por aquí?',
  '¿Seguimos con el simulador o le muestro los paquetes?',
  // Tercera forma: el verbo va DESPUÉS del «o». Apareció al repetir una
  // conversación real (23 sep 2026) y a la rama anterior se le escapaba.
  '¿Toma café en las mañanas, o prefiere algo sin cafeína?',
  '¿Sigue con los productos, o prefiere ver el negocio?',
  '¿Lo vemos ahora o prefiere mañana?',
]) {
  const cuerpo = `Aquí tiene el detalle completo de lo que preguntó, con su precio y su presentación, para que lo vea con calma.\n\n${q}`;
  es(detectarPreguntaDeDosSalidas(cuerpo) === q, `se caza · ${q}`);
}

// ── 3. Las aprobadas NO se tocan ─────────────────────────────────────────────
console.log('\n── 3. Las preguntas aprobadas pasan intactas ──');
for (const q of [
  '¿Le muestro cómo se construye ese sistema, paso a paso?',
  '¿Le muestro las tres formas de empezar?',
  '¿Con cuál arranca?',                                  // FREQ_30: abierta, no son dos caminos
  '¿Le cuento qué es la Regalía de Equipo?',
  '¿Le muestro qué haría usted en el día a día?',
  '¿Le muestro cuánto deja el Binario cuando su sistema crece?',
  '¿Le muestro lo que suman los paquetes de su primera generación?',
  '¿Le muestro las tres condiciones para cobrar el Binario?',
  '¿Le muestro cómo se cumple la recompra con una caja a la semana?',
  '¿Le muestro el catálogo completo con precios?',
  '¿Le redacto el mensaje para enviárselo a alguien?',
  '¿Le muestro qué trae cada uno?',
]) {
  const cuerpo = `Con gusto, y vale la pena la distinción. Lo que se distribuye es Ganoderma, con extracto propio, en bebidas, suplementos y cuidado personal.\n\n${q}`;
  es(detectarPreguntaDeDosSalidas(cuerpo) === null, `pasa · ${q}`);
}

console.log('\n── 4. La disyuntiva en medio del cuerpo es prosa, no una oferta ──');
const PROSA = [
  'Gano Excel fabrica, almacena y despacha cada pedido a la puerta del cliente, y eso funciona igual con diez clientes o con diez mil.\n\n¿Le muestro las tres formas de empezar?',
  'Puede pagar por consignación o por transferencia, como le quede más cómodo.\n\n¿Le muestro cómo se construye ese sistema, paso a paso?',
  'El ingreso entra los viernes, tenga usted diez clientes o cien.',
];
for (const t of PROSA) es(detectarPreguntaDeDosSalidas(t) === null, `no se toca · «${t.slice(0, 56)}…»`);

// ── 5. La poda deja el cuerpo ────────────────────────────────────────────────
console.log('\n── 5. La poda deja el cuerpo en pie ──');
const CON_MALA = 'El Ganocafé 3 en 1 viene endulzado y con crema, listo en un minuto. El Clásico es café negro, más robusto y sin dulce.\n\n¿Cuál de los dos va más con su rutina?';
const podado = podarPreguntaDeDosSalidas(CON_MALA);
es(!podado.includes('¿Cuál de los dos'), 'la pregunta sale');
es(podado.includes('El Clásico es café negro'), 'el cuerpo se conserva entero');
es(!/\s$/.test(podado), 'sin espacios colgando al final');
es(detectarPreguntaDeDosSalidas(podado) === null, 'lo que queda ya pasa el detector');

console.log('\n── 6. Un turno que ERA la pregunta se deja intacto ──');
// Podarlo dejaría a la persona sin respuesta, que es peor que una pregunta mala.
const SOLO_PREGUNTA = '¿Cuál de los dos va más con su rutina?';
es(podarPreguntaDeDosSalidas(SOLO_PREGUNTA) === SOLO_PREGUNTA, 'se entrega igual, y queda marcado para la cola');
const CORTO = 'Claro.\n\n¿Cuál de los dos prefiere?';
es(podarPreguntaDeDosSalidas(CORTO) === CORTO, 'un cuerpo demasiado corto tampoco se poda');

console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`❌ ${fallos} comprobación(es) fallaron`); process.exit(1); }
console.log('✅ Caza las dos salidas y no toca ninguna aprobada');
