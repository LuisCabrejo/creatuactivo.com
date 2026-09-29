/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿Los avisos al socio miden la ventana de 24 h por lo que ÉL escribió?
 *
 *   npx tsx scripts/prueba-ventana-aviso.mts   (exit 1 si falla)
 *
 * Sin red: una base falsa devuelve las filas de `nexus_conversations`. Nació del
 * 28-29 sep 2026: el mensaje de los lunes queda guardado como fila, la versión
 * vieja de `dentroDeVentana` (wa-onboarding) lo contaba como si el socio hubiera
 * escrito, y los cuatro avisos de «nuevo prospecto» del Director salieron fuera
 * de ventana — Meta los rechazó con 131047 y él no supo de nadie.
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// wa-onboarding va con require: ver la nota en prueba-typos.mts sobre la «ñ».
const { dentroDeVentana } = require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');

const horasAtras = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
type Fila = { created_at: string; messages: { role: string; content: string }[] };
const baseFalsa = (filas: Fila[]) => {
  const q = { select: () => q, in: () => q, eq: () => q, order: () => q, limit: async () => ({ data: filas, error: null }) };
  return { from: () => q };
};
const lunes = (h: number): Fila => ({ created_at: horasAtras(h), messages: [{ role: 'assistant', content: 'Hola Luis 👋, espero que esté genial…' }] });
const suyo = (h: number): Fila => ({ created_at: horasAtras(h), messages: [{ role: 'user', content: 'Hola' }, { role: 'assistant', content: '…' }] });

const CASOS: { nombre: string; filas: Fila[]; espera: boolean }[] = [
  { nombre: 'mensaje de los lunes hace 16 h, él escribió hace 8 días (caso 29 sep)', filas: [lunes(16), suyo(192)], espera: false },
  { nombre: 'mensaje de los lunes hace 2 h, nunca escribió', filas: [lunes(2)], espera: false },
  { nombre: 'él escribió hace 3 h', filas: [suyo(3)], espera: true },
  { nombre: 'lunes hace 1 h, él escribió hace 5 h', filas: [lunes(1), suyo(5)], espera: true },
  { nombre: 'él escribió hace 23,9 h (dentro del margen de 10 min)', filas: [suyo(23.9)], espera: false },
  { nombre: 'sin filas', filas: [], espera: false },
];

let fallos = 0;
console.log(`🪟 ¿La ventana del aviso cuenta solo lo que escribió el socio?  (${CASOS.length} casos)\n`);
for (const c of CASOS) {
  const r = await dentroDeVentana(baseFalsa(c.filas), '+57 320 341 5438');
  const ok = r === c.espera;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${r ? 'abierta ' : 'cerrada '} ${c.nombre}${ok ? '' : ` — esperaba ${c.espera ? 'abierta' : 'cerrada'}`}`);
}
console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`🔴 ${fallos} caso(s) fallaron.`); process.exit(1); }
console.log('✅ Todos los casos pasan.');
