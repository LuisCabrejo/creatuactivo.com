// Lo que el catálogo web ya dice de cada producto —cómo se toma, en qué momento,
// el ritual y lo que se nota—, puesto como DATO en el turno del motor.
//
// Por qué (5 nov 2026, evaluación del canal): BEB_06 cierra con «¿Le muestro cómo
// se integra en la rutina?», y RUTINA_01, que es el destino, no nombra el
// Reskine. Ante el «sí», Sonnet 4.6 inventó «el agua fría preserva el
// colágeno», y Sonnet 5.5 y Opus 5.5 dijeron «no tengo la forma de
// preparación». El dato estaba en `productos/catalogo-datos.ts` («Directo del
// sachet, sin agua ni vaso»): el modelo no lo veía. Lo mismo con «¿y qué
// beneficios tiene cada uno?» después de la lista de bebidas.
//
// Los textos son los del catálogo público (aprobado en v7.15), así que no hay
// copy nuevo aquí: solo se le pasan al modelo. La conversación la decide el
// modelo; los datos, el código.
import { productData } from '@/app/productos/catalogo-datos';
import { detectarProducto, type ProductoWA } from '@/lib/wa-productos';

/** Las líneas de uso de un producto, o '' si el catálogo web no lo tiene. */
export function fichaDeUso(p: ProductoWA, completa = true): string {
  const d = productData[p.slug];
  if (!d) return '';
  const lineas = [
    d.usage && `Cómo se toma o se usa: ${d.usage}`,
    completa && d.momentoConsumo && `Momento del día: ${d.momentoConsumo}`,
    completa && d.ritual?.length && `Ritual: ${d.ritual.join('; ')}`,
    d.benefits?.length && `Lo que se nota: ${d.benefits.join('; ')}`,
  ].filter(Boolean) as string[];
  return lineas.join('\n  ');
}

/**
 * Los productos que nombra un mensaje del bot. Las listas y las tablas llevan
 * uno por renglón; la prosa puede llevar dos («el Ganocafé 3 en 1… y el
 * Ganocafé Clásico», BEB_DIF_01), y `detectarProducto` devuelve null cuando una
 * frase nombra dos: ese renglón se parte en tramos y se lee cada uno.
 */
export function productosNombrados(texto: string, tope = 10): ProductoWA[] {
  const vistos = new Map<string, ProductoWA>();
  const anotar = (p: ProductoWA | null) => { if (p && !p.promocion && !vistos.has(p.slug)) vistos.set(p.slug, p); };
  for (const linea of (texto || '').split('\n')) {
    const p = detectarProducto(linea);
    if (p) anotar(p);
    else for (const tramo of linea.split(/[,;:.]|\s+y\s+/)) anotar(detectarProducto(tramo));
    if (vistos.size >= tope) break;
  }
  return [...vistos.values()].slice(0, tope);
}

/**
 * El dato de uso del producto del que viene la conversación, cuando la persona
 * no lo nombra en su mensaje («Sí», «¿y cómo se toma?», «¿y cada uno?»). Lee
 * solo la última respuesta de Queswa: más atrás, el tema ya pudo cambiar.
 * Devuelve '' si esa respuesta no nombra productos.
 */
export function pinProductoDelHilo(ultimoBot: string): string {
  const prods = productosNombrados(ultimoBot);
  if (prods.length === 0) return '';
  if (prods.length === 1) {
    const ficha = fichaDeUso(prods[0]);
    if (!ficha) return '';
    return `
💠 DATOS DEL PRODUCTO DEL QUE VIENEN HABLANDO (del catálogo; úselos si la pregunta es sobre él):
• ${prods[0].nombre}
  ${ficha}`;
  }
  const filas = prods
    .map((p) => { const f = fichaDeUso(p, false); return f ? `• ${p.nombre}\n  ${f}` : ''; })
    .filter(Boolean);
  if (filas.length < 2) return '';
  return `
💠 DATOS DE LOS PRODUCTOS DE SU ÚLTIMA RESPUESTA (del catálogo; úselos si preguntan por ellos):
${filas.join('\n')}`;
}
