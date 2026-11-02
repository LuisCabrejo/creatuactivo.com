/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados. Software propietario y confidencial.
 *
 * La puerta de «¿por qué con ustedes y no con otro equipo?» (2 nov 2026).
 *
 * `FREQ_14` responde esa pregunta con lo que nos diferencia de cualquier otra
 * forma de iniciar con Gano Excel: creatuactivo.com y queswa.app (v6.87). Gana
 * en el vector cuando la persona pregunta a secas («¿por qué con ustedes y no con
 * otro equipo?», 0,560), pero en cuanto nombra a Gano Excel —que es como lo dice
 * quien ya conoce la marca— la búsqueda se va a los fragmentos de Gano:
 * «¿Por qué unirme con ustedes y no con otro equipo de Gano Excel?» traía
 * `CIENCIA_04` (0,529), `CIENCIA_05` y `CRED_05`, y `FREQ_14` ni entraba al top 4.
 * Sin su material, el modelo compuso «infraestructura», «convencer» y «el sistema
 * trabaja por usted» (prueba en producción, 2 nov 2026).
 *
 * Es PUERTA y no una línea en el índice porque meterle «Gano Excel» al índice lo
 * volvería un imán para cualquier pregunta sobre Gano.
 *
 * La llave son dos cosas juntas:
 *   1. OTRO EQUIPO: «otro/otra/otros/cualquier/demás» y, a lo sumo dos palabras
 *      después, equipo · grupo · patrocinador · líder · organización. Sin
 *      «distribuidor» ni «red»: «¿y si otro distribuidor me quita el cliente?» es
 *      de `FREQ_37`.
 *   2. LA ELECCIÓN: «ustedes», «y no», «en vez de», «en lugar de», «diferencia»,
 *      «ventaja», «mejor», «elegir/escoger» o «por qué».
 * O la forma corta, sin nombrar al otro: «¿por qué con ustedes?».
 *
 * Se aparta ante quien YA está en otro equipo («soy/estoy/pertenezco… en Gano o
 * en otro equipo», «tengo mi código», «¿me puedo cambiar de equipo?»): eso es
 * del nodo 2.51 (caso Aldo), no una comparación. La exclusión es propia y no
 * reusa `RE_ACTIVO_EN_GANO`: esa expresión toma CUALQUIER «otro equipo de Gano»
 * como alguien activo, y el conductor importa esta puerta para que el 2.51 se
 * aparte ante la pregunta comparativa (ver `atenderDistribuidorActivo`).
 *
 * Casos de tolerancia a typos en `scripts/prueba-typos.mts`.
 */

import { normalizarDuro } from './texto-normalizar';
import { parecida } from './puerta-costo-tecnologia';

const OTRO = ['otro', 'otra', 'otros', 'otras', 'cualquier', 'cualquiera', 'demas'];
// «Equipo» y «patrocinador» toleran un tropiezo; «grupo» y «líder» solo exactos:
// a una letra están «grupo»/«gripo»… pero también «lider»/«lidex», y «grupo» con
// tolerancia sería «gripe» o «grapo».
const EQUIPO = ['equipo', 'equipos', 'patrocinador', 'patrocinadores', 'organizacion', 'organizaciones'];
const EQUIPO_EXACTO = ['grupo', 'grupos', 'lider', 'lideres'];
const ELECCION = /\bustedes\b|\by\s+no\b|\ben\s+vez\b|\ben\s+lugar\b|\bdiferen|\bventaja|\bmejor|\belegir|\bescoger|\bpor\s*que\b/;
// Sobre el texto normalizado (sin tildes ni puntuación).
const YA_ESTA_EN_OTRO = new RegExp([
  String.raw`\b(ya\s+)?(soy|estoy|estuve|trabajo|milito|pertenezco|hago\s+parte)\b[^?!]{0,30}\b(gano|otro\s+equipo|otra\s+linea|otro\s+grupo|otra\s+organizacion|otro\s+patrocinador)\b`,
  String.raw`\b(tengo|manejo)\s+(mi\s+|un\s+)?(codigo|equipo|red|linea)\b`,
  String.raw`\b(cambiar(me)?|pasar(me)?|trasladar(me)?|mover(me)?)\s+(de|a|al)\s+(equipo|linea|patrocinador)\b`,
  String.raw`\bcambio\s+de\s+(equipo|linea|patrocinador)\b`,
  String.raw`\bme\s+puedo\s+(pasar|cambiar)\b`,
].join('|'));

function nombraOtroEquipo(palabras: string[]): boolean {
  for (let i = 0; i < palabras.length; i++) {
    if (!OTRO.includes(palabras[i])) continue;
    for (let j = i + 1; j <= Math.min(i + 3, palabras.length - 1); j++) {
      if (parecida(palabras[j], EQUIPO) || EQUIPO_EXACTO.includes(palabras[j])) return true;
    }
  }
  return false;
}

export function preguntaPorQueConUstedes(texto: string): boolean {
  const t = normalizarDuro(texto);
  if (YA_ESTA_EN_OTRO.test(t)) return false;
  if (/\bpor\s*que\s+(con\s+)?ustedes\b/.test(t)) return true;
  return nombraOtroEquipo(t.split(' ')) && ELECCION.test(t);
}
