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
  { re: /ese mismo viernes/gi,                    motivo: 'FALSO: la comisión llega dos ciclos después (COMP_BIN_05)',            desde: '7 ago 2026' },
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

/**
 * Un fragmento tiene TRES regiones y solo dos importan:
 *
 *   1. La línea `###` — los disparadores, escritos con las palabras del
 *      PROSPECTO ("¿esto es por meter personas?"). Ahí la frase vetada es
 *      legítima: es cómo la persona pregunta, no cómo nosotros respondemos.
 *      Se descarta entera.
 *   2. El `[Concepto Nuclear]` y las instrucciones internas — texto dirigido al
 *      modelo. Nadie lo lee en una conversación, y por eso un error aquí
 *      sobrevive años. Es la región crítica.
 *   3. El cuerpo — lo que llega al prospecto.
 */
const partir = (contenido) => {
  // Se quita solo la primera LÍNEA del `###`, no su párrafo.
  //
  // ⚠️ Aquí estuvo ciego el detector hasta el 8 ago 2026: en estos arsenales el
  // `[Concepto Nuclear]` va pegado al `###` con un solo salto de línea, así que
  // partir por párrafos metía los dos en el mismo bloque y el bloque entero se
  // descartaba por empezar con `###`. Resultado: reportaba "0 cabeceras" sin
  // haber mirado casi ninguna. Es el mismo fallo silencioso que el detector
  // existe para cazar — plausible por fuera, vacío por dentro.
  const lineas = contenido.split('\n');
  const sinDisparador = (lineas[0].trimStart().startsWith('###') ? lineas.slice(1) : lineas).join('\n');
  const bloques = sinDisparador.split('\n\n');
  const instrucciones = [];
  const cuerpo = [];

  for (const b of bloques) {
    if (b.startsWith('###')) continue;                                  // disparadores
    if (/^\s*(\*\*)?\[|^\s*⚠️\s*\*\*QUESWA|^\s*\*\*\[INSTRUCC/i.test(b)) instrucciones.push(b);
    else cuerpo.push(b);
  }

  return { cabecera: instrucciones.join('\n\n'), cuerpo: cuerpo.join('\n\n') };
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

// ─────────────────────────────────────────────────────────────────────────
// El patrón general, que vale más que cualquier lista de palabras: una
// cabecera que CITA la frase que rechaza se la está entregando al modelo.
// La lista de arriba solo atrapa los casos ya conocidos; esto atrapa los que
// todavía no sabemos que existen — y en una sola semana ocurrió cinco veces
// (WHY_PROD_01, WHY_02, COMP_GEN5_01, el pin del Binario, WHY_03).
//
// La regla es simple y no admite excepción: **la instrucción se enuncia en
// afirmativo.** Se dice dónde SÍ va el vocabulario, nunca cuál evitar.
// ─────────────────────────────────────────────────────────────────────────
// El marcador de rechazo tiene que llevar **intención de habla** (no decir, no
// usar, prohibido…). Un simple "no" es demasiado común: casi todo [Concepto
// Nuclear] contrasta con algo, y eso es copy legítimo, no un dictado.
// "nunca" y "en vez de" van sueltos a propósito: el caso que se escapó no era
// una prohibición, era la frase vieja puesta como EJEMPLO del villano —
// *"el día que usted se detiene"*— dentro de una regla que la rechazaba. Da
// igual cómo se enmarque: una frase entre comillas en la cabecera es copy que
// el modelo puede usar. Solo se cita lo que sí queremos que diga.
// ⚠️ El cierre es `(?![a-záéíóúñ])` y NO `\b`: en JavaScript las vocales
// acentuadas no son caracteres de palabra, así que `\b` no cierra después de
// una — `/\bse retiró\b/` NUNCA coincide. Ese marcador llevaba muerto desde que
// existe el patrón (encontrado el 22 ago 2026), y era justo el que atrapaba el
// caso más común: la frase vieja citada en la cabecera al explicar que se
// retiró. Mismo fallo que tumbó tres puertas del clasificador con "bianrio" y
// "sí" con tilde. Por eso también van `jam[áa]s`, `versi[óo]n` y `dec[íi]a`:
// quien escribe la cabecera puede omitir la tilde.
const RE_RECHAZO = /\b(PROHIBID[OA]|vetad[oa]s?|NO\s+(decir|usar|escribir|nombrar|mencionar|puede\s+\w+\s+ni\s+decir)|nunca|jam[áa]s|en vez de|ya no se|evit(ar|e)|retirad[oa]s?|se retir[óo]|versi[óo]n anterior|dec[íi]a)(?![a-záéíóúñ])/i;
// Solo comillas de verdad. Los asteriscos son negrita de markdown y aparecen en
// cada cabecera para enfatizar — tomarlos por cita marca todo y no sirve.
const RE_CITA = /["“][^"”\n]{4,80}["”]|«[^»\n]{4,80}»/;

// ⚠️ LA EXCEPCIÓN, y se sostiene sola: si la frase citada **también aparece en
// el CUERPO** del mismo fragmento, no puede ser una frase que la cabecera esté
// prohibiendo — es la formulación aprobada, puesta como ejemplo de lo que SÍ se
// dice. En el caso genuinamente malo el cuerpo nunca la contiene, porque de eso
// se trata: la cabecera nombra lo que el cuerpo calla.
//
// Sin esta excepción el script marcaba `catalogo_productos_CIENCIA_02`, cuya
// cabecera dice *La función se nombra en conjunto y en afirmativo ("juntos
// apoyan el sistema inmune") — nunca colgada a un compuesto individual*. El
// «nunca» gobierna un criterio de estructura, no la cita; y la cita es
// exactamente lo que el cuerpo dice. "Corregir" esa cabecera habría borrado una
// instrucción correcta — y una alarma permanente que nadie puede apagar es una
// alarma que se deja de mirar (22 ago 2026).
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');

const dictados = [];
for (const frag of fragmentos) {
  const { cabecera, cuerpo } = partir(frag.content);
  const cuerpoNorm = normalizar(cuerpo);
  for (const frase of cabecera.split(/(?<=[.;])\s+/)) {
    if (!RE_RECHAZO.test(frase)) continue;
    const cita = frase.match(RE_CITA);
    if (!cita) continue;
    // El texto de adentro de las comillas, sin los delimitadores.
    const citado = normalizar(cita[0].slice(1, -1));
    if (cuerpoNorm.includes(citado)) continue;   // la dice el cuerpo → es la aprobada
    dictados.push({ category: frag.category, frase: frase.trim().slice(0, 150) });
    break;
  }
}

if (dictados.length) {
  console.log('\n🔴 CABECERAS QUE CITAN LO QUE RECHAZAN');
  console.log('   La frase citada viaja al modelo dentro del fragmento: es un dictado, no una regla.');
  for (const d of dictados) {
    console.log(`\n   ${d.category}`);
    if (detalle) console.log(`      «${d.frase}…»`);
  }
  if (!detalle) console.log('\n   (--detalle muestra la frase de cada una)');
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`${dictados.length} cabeceras citan lo que rechazan`);
console.log(`${fragmentos.length} fragmentos revisados · ${totalCabecera} en cabecera · ${totalCuerpo} en cuerpo`);
console.log('Correr con --detalle para ver cuáles.');
console.log('Las cabeceras son las urgentes: la regla se enuncia en AFIRMATIVO.');
