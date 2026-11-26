/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * La Presentación por país (Director, 24-26 nov 2026). Un solo deck
 * (src/app/servilleta/page.tsx) con una dirección por país: Google posiciona
 * direcciones, no botones, y su robot rastrea casi siempre desde IP de Estados
 * Unidos, así que cambiar el contenido por la IP en una misma dirección le
 * mostraría a Colombia la versión de allá. Cada dirección declara la otra con
 * hreflang (es-CO / es-US).
 *
 * El país lo decide la DIRECCIÓN, nunca la IP: la IP es un punto de partida, no
 * la verdad (doctrina de la diáspora: un colombiano en Miami que se registra por
 * Colombia ve la versión de Colombia). El enlace del socio elige la del país de
 * su WhatsApp ([slug]/[destino]), y el botón del HUD cambia entre las dos.
 *
 * Lo que cambia por país vive en el deck y en la guía, junto a la versión de
 * Colombia. Los datos de Estados Unidos salen de knowledge_base/paises/USA_2026.md.
 */

export type PaisServilleta = 'CO' | 'US';

export const RUTA_SERVILLETA: Record<PaisServilleta, string> = {
  CO: '/servilleta',
  US: '/servilleta/estados-unidos',
};

/** El país de la Presentación según la dirección en la que se abrió. */
export function paisDeRuta(pathname: string | null | undefined): PaisServilleta {
  return pathname?.startsWith(RUTA_SERVILLETA.US) ? 'US' : 'CO';
}

/** El país de la Presentación para un socio, por el país de su WhatsApp
 *  (`paisDeContactoWA`). Solo Estados Unidos tiene versión propia; el resto ve
 *  la de Colombia, en dólares si su conexión no es de Colombia. */
export function paisServilletaDeSocio(paisWhatsApp: string | null | undefined): PaisServilleta {
  return paisWhatsApp === 'US' ? 'US' : 'CO';
}

/** hreflang de las dos direcciones, para el `alternates.languages` de cada una. */
export const IDIOMAS_SERVILLETA = {
  'es-CO': RUTA_SERVILLETA.CO,
  'es-US': RUTA_SERVILLETA.US,
  'x-default': RUTA_SERVILLETA.CO,
};
