/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Las plantillas de WhatsApp de una convocatoria de /vip (taller del 16 nov 2026),
 * copy aprobado por el Director el 15 nov 2026. Las somete y las envía el panel de
 * la convocatoria (/vip/{evento}/panel → /api/mesa/whatsapp), con el token que vive
 * en Vercel: así se opera desde el celular, sin la Mac.
 *
 * - confirmacion_evento_v1 (UTILITY): a quien se inscribió, su puesto confirmado y
 *   el enlace de la reunión en un botón. Molde de acceso_centro_mando_v2, la única
 *   UTILITY de la cuenta: entrega pura, enlace en botón, nada promocional.
 * - invitacion_taller_v1 (MARKETING, por lo que es): el flyer, la invitación y el
 *   botón «Reservar mi puesto». A números +1 Meta no entrega MARKETING.
 *
 * ⚠️ Una plantilla que cambia lleva nombre nuevo (_v2): Meta no deja cambiar la
 * categoría de una aprobada y reserva el nombre de una eliminada. El script
 * scripts/someter-plantilla-confirmacion-evento.mjs somete la misma confirmación
 * desde la Mac; si una cambia, cambian las dos.
 */

export const PLANTILLA_CONFIRMACION = 'confirmacion_evento_v1';
export const PLANTILLA_INVITACION = 'invitacion_taller_v1';

/** Lo que cada convocatoria pone en sus plantillas. La llave es Mesa.id. */
export interface DatosConvocatoriaWa {
  /** {{2}} de la confirmación: «el taller en línea». */
  eventoTexto: string;
  /** {{3}} de la confirmación: «lunes 16 de noviembre a las 8:00 a. m.». */
  cuandoTexto: string;
  /** El código de la reunión de Meet (va como sufijo del botón). */
  codigoMeet: string;
  /** El flyer, en una URL pública (encabezado de la invitación). */
  flyer: string;
  /** La clave de /vip/{clave}. */
  claveVip: string;
}

export const CONVOCATORIAS_WA: Record<string, DatosConvocatoriaWa> = {
  'taller-dos-socios-2026-11-16': {
    eventoTexto: 'el taller en línea',
    cuandoTexto: 'lunes 16 de noviembre a las 8:00 a. m.',
    codigoMeet: 'fgz-qdxk-mhr',
    flyer: 'https://creatuactivo.com/images/eventos/flyer-taller-dos-socios-20261116.png',
    claveVip: 'taller',
  },
};

export function plantillaConfirmacion(): Record<string, unknown> {
  return {
    name: PLANTILLA_CONFIRMACION,
    language: 'es',
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        // La fecha va en medio de la frase: al final dejaba «a. m..».
        text: 'Hola, {{1}}. Su puesto en {{2}} del {{3}} quedó confirmado. Entre con la cámara encendida.',
        example: { body_text: [['Julieth', 'el taller en línea', 'lunes 16 de noviembre a las 8:00 a. m.']] },
      },
      {
        type: 'BUTTONS',
        buttons: [
          {
            type: 'URL',
            text: 'Entrar a la reunión',
            url: 'https://meet.google.com/{{1}}',
            example: ['https://meet.google.com/fgz-qdxk-mhr'],
          },
        ],
      },
    ],
  };
}

/** La invitación. Sin `handle` (si la subida del flyer falla) sale sin imagen. */
export function plantillaInvitacion(handle?: string): Record<string, unknown> {
  return {
    name: PLANTILLA_INVITACION,
    language: 'es',
    category: 'MARKETING',
    components: [
      ...(handle ? [{ type: 'HEADER', format: 'IMAGE', example: { header_handle: [handle] } }] : []),
      {
        type: 'BODY',
        text:
          'Hola, {{1}}. El lunes 16 de noviembre, de 8:00 a 10:00 a. m., tenemos un taller privado en línea: ' +
          'su plan para sumar dos socios nuevos, con una clínica en vivo. ' +
          'Los cupos son limitados y se entra con cámara encendida.',
        example: { body_text: [['Julieth']] },
      },
      {
        type: 'BUTTONS',
        buttons: [{ type: 'URL', text: 'Reservar mi puesto', url: 'https://creatuactivo.com/vip/taller' }],
      },
    ],
  };
}

/** «ana maría pérez» → «Ana». */
export function primerNombreWa(nombre: string | null | undefined): string {
  const p = (nombre || '').trim().split(/\s+/)[0] || '';
  return p ? p.charAt(0).toLocaleUpperCase('es') + p.slice(1).toLocaleLowerCase('es') : '';
}
