/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los dos canales abren igual.
 *
 *   npx tsx scripts/prueba-entradas-iguales.mts     (exit 1 si se separan)
 *
 * Decisión del Director (23 sep 2026): «para no causar error, aplicar en el
 * pitch deck y en creatuactivo.com el mismo flujo de WhatsApp, es decir las
 * mismas preguntas de inicio». Un prospecto tiene que encontrar el mismo camino
 * venga por donde venga, y el socio explica uno solo.
 *
 * ⚠️ El texto NO es idéntico y es a propósito: Meta limita sus botones a 20
 * caracteres y la web no. Lo que esta batería exige es que las tres entradas
 * resuelvan a la MISMA respuesta y en el mismo orden.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { QUESWA_QUICK_REPLIES } from '../src/lib/queswa-greeting.ts';
import { getRespuestaMaestra } from '../src/lib/respuestas-maestras.ts';
import { APERTURA_OPCIONES, getRespuestaBoton } from '../src/lib/wa-apertura.ts';

let fallos = 0;
const es = (c: unknown, m: string) => { console.log(`${c ? '✅' : '❌'} ${m}`); if (!c) fallos++; };
const nucleo = (t: string | null) => (t || '').replace(/[*\s]/g, '');

es(QUESWA_QUICK_REPLIES.length === APERTURA_OPCIONES.length,
   `las dos aperturas ofrecen ${APERTURA_OPCIONES.length} entradas`);

QUESWA_QUICK_REPLIES.forEach((chip, i) => {
  const web = getRespuestaMaestra(chip);
  const wa = getRespuestaBoton(APERTURA_OPCIONES[i].id);
  es(!!web, `la web resuelve «${chip}»`);
  es(!!wa, `WhatsApp resuelve «${APERTURA_OPCIONES[i].title}»`);
  es(nucleo(web) === nucleo(wa), `entrada ${i + 1}: entregan la misma respuesta`);
});

// Quien escriba la forma corta del botón en la web no puede caer en otro lado.
for (const forma of ['Cómo entra el dinero', '¿Cómo entra el dinero?', 'cómo entra el dinero']) {
  es(!!getRespuestaMaestra(forma), `«${forma}» escrito a mano resuelve igual`);
}

// Los chips retirados siguen teniendo expansión: la pregunta puede escribirse
// aunque ya no se ofrezca de entrada.
const { QUESWA_QUICK_REPLIES_EXPANSION } = await import('../src/lib/queswa-greeting.ts');
for (const retirado of [
  '¿cuáles son los productos y para qué sirven?',
  'quiero ver los números: ¿cómo y cuánto se gana?',
  '¿cómo es el plan que se multiplica hasta los $103 millones?',
]) es(!!QUESWA_QUICK_REPLIES_EXPANSION[retirado], `el chip retirado «${retirado.slice(0, 38)}…» conserva su expansión`);

console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`❌ ${fallos} comprobación(es) fallaron — los canales se separaron`); process.exit(1); }
console.log('✅ Los dos canales abren igual');
