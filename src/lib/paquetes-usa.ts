/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los paquetes de Estados Unidos, para que Queswa los cotice con las cifras de
 * allá (26 nov 2026). Hasta ese día, a un número +1 se le daban los de Colombia
 * convertidos a la tasa fija ($200 / $500 / $1,000 USD) y el contenido de los
 * paquetes de Colombia, con productos que allá no se venden (Ganorico, Piel&Brillo).
 *
 * Fuente: knowledge_base/paises/USA_2026.md — lista ESP 2026 de Gano Excel USA
 * (§3 y §3.1), confirmada con la presentación del liderazgo de EE. UU. (§1.1, §7).
 * Los demás países fuera de Colombia siguen con la cifra en dólares de Colombia:
 * no hay lista oficial de cada uno.
 *
 * ⚠️ El Kit de Inicio NO existe en Estados Unidos (USA_2026.md §1.3). Su cifra
 * sigue saliendo de route.ts y del conductor mientras el Director decide cuál es
 * la entrada menor de allá: no se agrega aquí.
 */

export type CodigoEsp = 'ESP-1' | 'ESP-2' | 'ESP-3';

/** Precio de cada paquete en Estados Unidos. */
export const PRECIO_ESP_US: Record<CodigoEsp, string> = {
  'ESP-1': '$205 USD',
  'ESP-2': '$510 USD',
  'ESP-3': '$1,020 USD',
};

/** Unidades de producto de cada paquete en Estados Unidos (USA_2026.md §3.1). */
export const UNIDADES_ESP_US: Record<CodigoEsp, number> = {
  'ESP-1': 9,
  'ESP-2': 19,
  'ESP-3': 40,
};

/** Lo que trae cada paquete, en una línea, para el cierre de la tabla dictada. */
export const MIX_ESP_US: Record<CodigoEsp, string> = {
  'ESP-1': 'Lo seleccionamos así para que su negocio arranque con las bebidas que más se piden y cuidado personal.',
  'ESP-2': 'Lo seleccionamos así para que su negocio arranque con un mix completo: bebidas enriquecidas, suplementos premium y cuidado personal.',
  'ESP-3': 'Lo seleccionamos así para que su negocio arranque con un mix completo: bebidas enriquecidas, suplementos premium y cuidado personal.',
};

// Contenido de cada paquete (USA_2026.md §3.1). Los nombres van en español, como
// en el catálogo del canal; las cápsulas llevan el nombre de su ingrediente, que
// es como se venden allá (Spirit, Mind y Body son el subtítulo de la caja).
const FILAS: Record<CodigoEsp, [string, number][]> = {
  'ESP-1': [
    ['Ganocafé 3 en 1', 2],
    ['Ganocafé Clásico', 2],
    ['Ganocafé Tongkat Ali', 1],
    ['Ganocafé Mocha', 1],
    ['Gano Rooibos', 1],
    ['Gano Fresh · Pasta de Dientes', 1],
    ['Jabón Gano Sense (paquete de 2)', 1],
  ],
  'ESP-2': [
    ['Ganocafé 3 en 1', 4],
    ['Ganocafé Clásico', 4],
    ['Ganocafé Tongkat Ali', 2],
    ['Ganocafé Mocha', 1],
    ['Gano Schokolade', 1],
    ['Gano Rooibos', 1],
    ["Gano C'real", 1],
    ['Gano Fresh · Pasta de Dientes', 1],
    ['Jabón Gano Sense (paquete de 2)', 1],
    ['Cápsulas Ganoderma', 1],
    ['Cápsulas Excellium', 1],
    ['Cápsulas Cordyceps', 1],
  ],
  'ESP-3': [
    ['Ganocafé 3 en 1', 9],
    ['Ganocafé Clásico', 9],
    ['Ganocafé Tongkat Ali', 6],
    ['Ganocafé Mocha', 3],
    ['Gano Schokolade', 3],
    ['Gano Rooibos', 3],
    ["Gano C'real", 2],
    ['Gano Fresh · Pasta de Dientes', 1],
    ['Jabón Gano Sense (paquete de 2)', 1],
    ['Cápsulas Ganoderma', 1],
    ['Cápsulas Excellium', 1],
    ['Cápsulas Cordyceps', 1],
  ],
};

const NOMBRE: Record<CodigoEsp, string> = {
  'ESP-1': 'ESP-1 Inicial',
  'ESP-2': 'ESP-2 Empresarial',
  'ESP-3': 'ESP-3 Visionario',
};

/** La tabla de un paquete de Estados Unidos, con el mismo formato que las de Colombia en route.ts. */
function tablaEsp(codigo: CodigoEsp): string {
  const filas = FILAS[codigo];
  const total = filas.reduce((a, [, n]) => a + n, 0);
  return [
    `**Contenido ${NOMBRE[codigo]} (${PRECIO_ESP_US[codigo]}) — Estados Unidos, lista ESP 2026:**`,
    '| Producto | Cantidad |',
    '|---|---|',
    ...filas.map(([p, n]) => `| ${p} | ${n} |`),
    `| **Total** | **${total}** |`,
  ].join('\n');
}

export const COMPOSICIONES_US: Record<CodigoEsp, string> = {
  'ESP-1': tablaEsp('ESP-1'),
  'ESP-2': tablaEsp('ESP-2'),
  'ESP-3': tablaEsp('ESP-3'),
};
