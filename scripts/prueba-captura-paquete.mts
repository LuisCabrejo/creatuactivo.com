/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿La captura de paquete toma una ELECCIÓN — y solo eso?
 *
 *   npx tsx scripts/prueba-captura-paquete.mts   (exit 1 si falla)
 *
 * Sin red y sin modelo. Lee `packageMap` tal cual está en route.ts y lo recorre
 * como `captureProspectData`: gana la primera etiqueta que coincide.
 *
 * Nació del caso Yesid Triana (29 sep 2026): «El mayor porcentaje de las
 * personas sobreviven con un salario mínimo» lo dejó con «paquete ESP-3» en el
 * Radar del socio, justo después de decir que $110.900 le pesaba. Los NEGATIVOS
 * pesan tanto como los positivos: una captura falsa pinta de venta pendiente a
 * quien acaba de decir que no puede pagar.
 */
import { readFileSync } from 'node:fs';
import { mencionaPaqueteComoEleccion } from '../src/lib/captura-paquete.ts';

const fuente = readFileSync('src/app/api/nexus/route.ts', 'utf8');
const m = fuente.match(/const packageMap: Record<string, string> = (\{[\s\S]*?\n  \});/);
if (!m) throw new Error('No se encontró packageMap en route.ts');
const packageMap = new Function(`return ${m[1]}`)() as Record<string, string>;

const capturar = (mensaje: string): string | null => {
  const lower = mensaje.toLowerCase().trim();
  for (const [etiqueta, valor] of Object.entries(packageMap)) {
    if (mencionaPaqueteComoEleccion(lower, etiqueta)) return valor;
  }
  return null;
};

const CASOS: { frase: string; espera: string | null; nota?: string }[] = [
  // ── Negativos: el adjetivo califica otra cosa, o la etiqueta es pedazo de otra ─
  { frase: 'Si, pero . El mayor porcentaje de las personas, sobreviven a partir de un salario mínimo vital', espera: null,
    nota: 'Yesid, 29 sep 2026' },
  { frase: 'ese es el mejor momento para empezar', espera: null },
  { frase: 'el primero que me escribió fue Luis', espera: null },
  { frase: 'me cobraron los mil pesos del envío', espera: null },
  { frase: 'quiero llegar al nivel 12', espera: null, nota: '«nivel 1» dentro de «nivel 12»' },
  { frase: 'el top de ventas del mes', espera: null },
  { frase: 'lo básico es la comida', espera: null },

  // ── Positivos: las elecciones de verdad se siguen tomando ─────────────────────
  { frase: 'quiero el mayor', espera: 'ESP-3' },
  { frase: 'me voy por el más grande de los tres', espera: 'ESP-3' },
  { frase: 'el más completo, por favor', espera: 'ESP-3' },
  { frase: 'el visionario', espera: 'ESP-3' },
  { frase: 'arranco con el esp-3', espera: 'ESP-3' },
  { frase: 'el de mil dólares', espera: 'ESP-3' },
  { frase: 'en nivel 3', espera: 'ESP-3' },
  { frase: 'el de 17%', espera: 'ESP-3' },
  { frase: 'empiezo con el básico, por favor', espera: 'ESP-1' },
  { frase: 'el primero', espera: 'ESP-1' },
  { frase: 'el de 900.000', espera: 'ESP-1' },
  { frase: 'la opción 2', espera: 'ESP-2' },
];

let fallos = 0;
console.log(`📦 ¿La captura de paquete toma una elección — y solo eso?  (${CASOS.length} casos, ${Object.keys(packageMap).length} etiquetas)\n`);
for (const c of CASOS) {
  const r = capturar(c.frase);
  const ok = r === c.espera;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} «${c.frase}» → ${r ?? '(nada)'}${ok ? '' : ` — esperaba ${c.espera ?? '(nada)'}`}${c.nota ? `   — ${c.nota}` : ''}`);
}
console.log(`\n${'─'.repeat(70)}`);
if (fallos) { console.log(`🔴 ${fallos} caso(s) fallaron.`); process.exit(1); }
console.log('✅ Todos los casos pasan.');
