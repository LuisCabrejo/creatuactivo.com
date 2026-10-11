/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Deriva el simulador en DÓLARES del simulador en pesos (Director, 11 oct 2026:
 * «para quien está afuera es mejor dólar»). Adazuni Maldonado (San Diego, 10 oct)
 * vio en la tarjeta «≈ $378.000 COP al mes» y enseguida Queswa le escribió
 * «$84 USD al mes»: dos monedas para la misma cifra, y la primera, para quien
 * vive en EE. UU., se lee como trescientos setenta y ocho mil dólares.
 *
 * ⛔ El JSON en dólares NO se edita a mano: la fuente es el de pesos, y este
 * script lo traduce cifra por cifra. Así los dos simuladores no pueden decir
 * cosas distintas. Se cambia el de pesos y se vuelve a correr esto.
 *
 * La conversión es la de Gano Excel (4.500 pesos por dólar, fija) y el formato
 * es el de `usd()` en src/lib/wa-simulador.ts —el que ya usa el texto que
 * Queswa escribe después de la tarjeta—: coma de miles, y centavos solo por
 * debajo de cien dólares ($5.60, no $6). Tarjeta y texto dan la misma cifra.
 *
 * Uso:
 *   node scripts/generar-flow-simulador-usd.mjs           # escribe el JSON en dólares
 *   node scripts/generar-flow-simulador-usd.mjs --ver     # además imprime cada cambio
 */

import fs from 'fs';

const ORIGEN  = 'docs/handoff/queswa/flows/simulador-de-ingresos.flow.json';
const DESTINO = 'docs/handoff/queswa/flows/simulador-de-ingresos-usd.flow.json';
const COP_POR_USD = 4_500;

const usd = (pesos) => {
  const d = pesos / COP_POR_USD;
  const decimales = d < 100 && !Number.isInteger(d) ? 2 : 0;
  return d.toLocaleString('en-US', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
};

const ver = process.argv.includes('--ver');
const cambios = [];

// Una cifra en pesos con punto de miles: «$675.000», «$1.125.000». La unidad
// «COP» que la acompaña pasa a «USD»; las líneas que no la llevan (el desglose
// por generación, la cifra semanal) siguen sin llevarla, igual que en pesos.
function traducir(texto) {
  let t = texto.replace(/\$(\d{1,3}(?:\.\d{3})+|\d+)(\s*COP)?/g, (_, n, cop) => {
    const pesos = Number(n.replace(/\./g, ''));
    return `$${usd(pesos)}${cop ? ' USD' : ''}`;
  });
  // Léxico vigente (sistema de distribución, sep 2026): la nota de los 12
  // Niveles todavía dice «canal». El de pesos se queda como está hasta que se
  // publique con id nuevo; el nuevo nace bien.
  t = t.replace(/\bel canal\b/g, 'el sistema').replace(/\bcada canal\b/g, 'cada sistema');
  if (t !== texto) cambios.push([texto, t]);
  return t;
}

function recorrer(n) {
  if (Array.isArray(n)) return n.map(recorrer);
  if (n && typeof n === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(n)) {
      // Las condiciones comparan VALORES del formulario ('10', '1000'): no son plata.
      out[k] = typeof v === 'string' && k !== 'condition' && k !== 'id' && k !== 'name' ? traducir(v) : recorrer(v);
    }
    return out;
  }
  return n;
}

const flow = JSON.parse(fs.readFileSync(ORIGEN, 'utf8'));
const enDolares = recorrer(flow);
const salida = JSON.stringify(enDolares, null, 2) + '\n';

// Ningún peso puede quedar vivo en el de dólares.
const restos = salida.match(/COP|\$\d{1,3}\.\d{3}/g);
if (restos) {
  console.error(`❌ Quedaron cifras en pesos en el JSON en dólares: ${[...new Set(restos)].join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(DESTINO, salida);
console.log(`✅ ${DESTINO} · ${cambios.length} textos traducidos desde ${ORIGEN}`);
if (ver) for (const [a, b] of cambios) console.log(`\n— ${a.replace(/\n/g, ' ⏎ ')}\n+ ${b.replace(/\n/g, ' ⏎ ')}`);
