/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * LOS 17 PRODUCTOS DE ESTADOS UNIDOS PARA EL CANAL (27 nov 2026).
 *
 * Con esta tabla Queswa lee y confirma el pedido que llega del catálogo de un socio
 * inscrito en Gano Excel USA (src/app/productos/catalogo-usa.ts): «2 x Gano Café
 * Classic» es el Classic de allá a $33 USD, no el Ganocafé Clásico de Colombia en
 * pesos. Nombre, precio, presentación y foto salen del catálogo, así que un cambio
 * de precio se hace una sola vez, allá. Aquí solo viven los alias: cómo nombra la
 * gente cada producto en el chat (sin tildes, en minúscula; los de menos de cuatro
 * letras no cuentan para leer un pedido).
 *
 * Solo la usa el pedido (wa-pedido.ts, con `pais: 'US'`). Las fotos y las familias
 * del canal siguen siendo las de Colombia.
 */

import { productDataUS } from '@/app/productos/catalogo-usa';
import type { ProductoWA } from '@/lib/wa-productos';

const ALIAS_US: Record<string, string[]> = {
  '3-in-1': ['3 in 1', '3-in-1', '3in1', '3 en 1', 'tres en uno', 'capuchino', 'cappuccino'],
  'classic': ['classic', 'clasico', 'cafe negro'],
  'tongkat-ali': ['tongkat', 'tonkat', 'tongat'],
  'latte-light': ['latte light', 'late light', 'latte'],
  'mocha': ['gano cafe mocha', 'mocha', 'moka'],
  'mocha-light': ['mocha light', 'moka light'],
  'schokolade': ['schokolade', 'schokolad', 'chocolate'],
  'rooibos-tea': ['rooibos', 'te rojo', 'el te'],
  'creal': ['c real', 'creal', 'cereal'],
  'reskine': ['reskine', 'colageno'],
  'ganoderma': ['spirit ganoderma', 'spirit', 'capsulas de ganoderma', 'ganoderma en capsulas'],
  'excellium': ['mind excellium', 'excellium', 'excelium'],
  'cordyceps': ['body cordyceps', 'cordyceps', 'cordiceps'],
  'gano-plus': ['gano plus', 'ganoplus'],
  'ganosoap': ['sense soap', 'jabon', 'soap'],
  'toothpaste': ['fresh toothpaste', 'toothpaste', 'pasta de dientes', 'pasta dental', 'crema dental'],
  'reishi-touch': ['reishi touch', 'locion'],
};

export const PRODUCTOS_WA_US: ProductoWA[] = Object.entries(productDataUS).map(([slug, p]) => ({
  slug,
  nombre: p.name,
  precioCOP: 0,
  precioUSD: p.price,
  presentacion: p.presentacion.charAt(0).toLowerCase() + p.presentacion.slice(1),
  invima: '',
  imagen: p.image,
  alias: ALIAS_US[slug] ?? [],
}));
