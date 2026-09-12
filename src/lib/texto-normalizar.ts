/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Normalización de texto — la fuente única (12 sep 2026)
 *
 * Había NUEVE copias de esto repartidas por el canal, escritas de nueve maneras
 * para hacer tres cosas. El costo no es la duplicación: es que **se endurecen por
 * separado**. El 5 sep se endureció el detector de aceptación del catálogo para
 * que aguantara «Sii» y «claro que sí» (caso Betsabe); el gemelo del conductor
 * —que gobierna el hilo de los 12 Niveles, el simulador y la vinculación— se
 * quedó con la versión vieja y lo descubrimos siete días después, con un turno
 * real ya perdido. El arreglo vivía al lado del nodo más valioso y no lo cubría.
 *
 * ⚠️ **`ñ` se convierte en `n`, y eso es deliberado.** El rango de diacríticos
 * combinantes se la lleva con las tildes, y está bien: la gente escribe «senora»,
 * «ano» y «companero» desde el teclado del teléfono, y un patrón que exija la
 * tilde de la eñe no dispara. Quien escriba un patrón contra texto normalizado
 * debe escribirlo SIN eñe — `ano`, no `año`.
 *
 * ⚠️ **El rango va escapado (`̀-ͯ`), nunca literal.** Cuatro de las
 * nueve copias lo traían escrito como caracteres combinantes de verdad, que en el
 * fuente son invisibles y cualquier editor —o un copiar y pegar— se los come sin
 * avisar. El día que pase, el regex deja de quitar tildes y nadie ve por qué.
 *
 * ⛔ Lo que NO vive aquí, a propósito: `generateLocalEmbedding` de
 * `vectorSearch.ts`. Parece lo mismo pero hace otro trabajo —trocear texto para
 * un vector, no cotejar un mensaje contra un patrón—, usa `\w` en vez del
 * alfabeto, y cuelga del camino de embeddings locales que ya está muerto.
 */

/** Diacríticos combinantes. Escapado a propósito — ver la cabecera. */
const DIACRITICOS = /[̀-ͯ]/g;

/**
 * Solo quita tildes; respeta mayúsculas y puntuación.
 * Para cuando la caja del texto importa y los diacríticos estorban.
 */
export function sinDiacriticos(texto: string): string {
  return (texto || '').normalize('NFD').replace(DIACRITICOS, '');
}

/**
 * COTEJO SUAVE — minúsculas y sin tildes, conservando puntuación y espacios.
 *
 * Es la forma que asumen los patrones de los guardarraíles, la ambivalencia, la
 * pareja y la lista del socio: ahí la puntuación es señal (un «?» distingue una
 * pregunta de una afirmación) y borrarla cambiaría el diagnóstico.
 */
export function normalizarSuave(texto: string): string {
  return sinDiacriticos((texto || '').toLowerCase());
}

/**
 * COTEJO DURO — suave, más la puntuación convertida en ESPACIO y los espacios
 * colapsados. Así llega un mensaje de WhatsApp cuando lo que se busca es una
 * palabra suelta: «¿ganocafé-3en1?» y «ganocafe 3en1» tienen que cotejar igual.
 *
 * ⚠️ La puntuación se vuelve espacio, no se borra: borrarla pega las palabras
 * vecinas y crea una que nadie escribió.
 */
export function normalizarDuro(texto: string): string {
  return normalizarSuave(texto)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * SLUG — para construir un identificador, no para cotejar.
 *
 * ⚠️ Aquí la puntuación SÍ se borra en vez de volverse espacio, y la diferencia
 * no es cosmética: es la que decide si «O'Brien» queda `obrien` o `o-brien`.
 * `constructor_id` es la llave de texto que comparten el canal, el Dashboard y la
 * página del reel, así que cambiarle la forma le rompe el enlace a quien ya lo
 * tenga. Si alguna vez se «arregla», se migran las filas primero.
 *
 * @param conservarGuion deja pasar los guiones que el nombre ya traía.
 */
export function normalizarParaSlug(texto: string, conservarGuion = false): string {
  return normalizarSuave(texto)
    .replace(conservarGuion ? /[^a-z0-9\s-]/g : /[^a-z0-9\s]/g, '')
    .trim();
}
