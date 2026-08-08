/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Busca frases vetadas dentro de los fragmentos que el motor le entrega al modelo.
 *
 * POR QUÉ EXISTE: una cabecera `[Concepto Nuclear]` que dice "NO decir X" le
 * entrega la frase X al modelo en cada consulta — la cabecera viaja DENTRO del
 * fragmento recuperado. El error se cometió tres veces en la misma semana (7–8
 * ago 2026: WHY_PROD_01, WHY_02 y el pin del Binario), siempre por la misma
 * razón: escribir la prohibición citando lo prohibido. La regla se enuncia en
 * AFIRMATIVO — dónde SÍ va el vocabulario— y este script lo verifica.
 *
 * También encuentra la fuga inversa: la frase vetada viva en el cuerpo de una
 * respuesta, que es lo que el prospecto acaba leyendo.
 *
 * USO:
 *   node scripts/auditar-frases-vetadas.mjs            # resumen
 *   node scripts/auditar-frases-vetadas.mjs --detalle  # cada hallazgo con su línea
 *
 * ⚠️ NO es un linter de estilo: solo reporta. Varias frases están vetadas para
 * el copy de cara al prospecto pero son legítimas en un disparador (la pregunta
 * del prospecto con SUS palabras) — por eso los títulos se excluyen y el juicio
 * final es humano.
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * Cada entrada: la frase, y por qué está vetada (para que el reporte enseñe y no
 * solo señale). El `donde` distingue las que solo importan de cara al prospecto.
 */
const VETADAS = [
  { re: /consumo diario|h[áa]bitos de consumo/gi, motivo: 'estante de supermercado — el precio se compara contra un café corriente', desde: '8 ago 2026' },
  { re: /meter (personas|gente)/gi,               motivo: 'el miedo literal al multinivel; se dice qué SÍ paga el plan',            desde: '7 ago 2026' },
  { re: /\bperseguir\b/gi,                        motivo: 'planta una objeción que el prospecto no trajo',                          desde: 'jun 2026' },
  { re: /\bfiltrar\b|\bfiltro\b/gi,               motivo: 'Queswa conversa y reconoce a quien está listo; no descarta',             desde: 'jun 2026' },
  { re: /flujo de caja/gi,                        motivo: 'jerga contable; se dice "ingreso" o "la plata"',                         desde: '7 ago 2026' },
  { re: /directamente proporcional|matem[áa]ticamente/gi, motivo: 'suena inteligente, no empático',                                 desde: 'jul 2026' },
  { re: /ingreso pasivo|libertad financiera|oportunidad de negocio/gi, motivo: 'delata el registro MLM',                            desde: 'histórico' },
  { re: /M[áa]quina H[íi]brida|\bcapas\b/gi,      motivo: 'etiqueta interna; de cara al prospecto son los pilares',                 desde: 'histórico' },
];

const detalle = process.argv.includes('--detalle');

const { data, error } = await supabase
  .from('nexus_documents')
  .select('category, title, content, tenant_id, metadata')
  .eq('tenant_id', 'creatuactivo_marketing');

if (error) {
  console.error('❌', error.message);
  process.exit(1);
}

const fragmentos = data.filter((d) => d.metadata?.is_fragment === true);

// La cabecera es la primera línea del fragmento — ahí vive el [Concepto Nuclear],
// que es texto para el modelo, no para el prospecto, y por eso el error pasa
// desapercibido: nadie lo lee en una conversación.
const partir = (contenido) => {
  const salto = contenido.indexOf('\n');
  return salto === -1
    ? { cabecera: contenido, cuerpo: '' }
    : { cabecera: contenido.slice(0, salto), cuerpo: contenido.slice(salto + 1) };
};

let totalCabecera = 0;
let totalCuerpo = 0;

for (const { re, motivo, desde } of VETADAS) {
  const enCabecera = [];
  const enCuerpo = [];

  for (const frag of fragmentos) {
    const { cabecera, cuerpo } = partir(frag.content);
    // El título es la pregunta del prospecto en SUS palabras: ahí la frase vetada
    // es un disparador legítimo, no copy nuestro.
    if (new RegExp(re.source, 'i').test(cabecera)) enCabecera.push(frag.category);
    if (new RegExp(re.source, 'i').test(cuerpo))   enCuerpo.push(frag.category);
  }

  totalCabecera += enCabecera.length;
  totalCuerpo += enCuerpo.length;

  if (!enCabecera.length && !enCuerpo.length) continue;

  console.log(`\n"${re.source.split('|')[0].replace(/\\b/g, '')}"  — vetada ${desde}`);
  console.log(`   ${motivo}`);
  if (enCabecera.length) {
    console.log(`   🔴 ${enCabecera.length} en CABECERA (se la entregamos al modelo mientras se la prohibimos)`);
    if (detalle) enCabecera.forEach((c) => console.log(`        ${c}`));
  }
  if (enCuerpo.length) {
    console.log(`   🟡 ${enCuerpo.length} en CUERPO (lo lee el prospecto)`);
    if (detalle) enCuerpo.forEach((c) => console.log(`        ${c}`));
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`${fragmentos.length} fragmentos revisados · ${totalCabecera} en cabecera · ${totalCuerpo} en cuerpo`);
console.log('Correr con --detalle para ver cuáles.');
console.log('Las cabeceras son las urgentes: la regla se enuncia en AFIRMATIVO.');
