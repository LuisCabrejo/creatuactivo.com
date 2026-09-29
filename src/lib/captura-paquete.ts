/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿La etiqueta de paquete aparece en el mensaje como una ELECCIÓN?
 *
 * `packageMap` (captureProspectData, route.ts) se cotejaba con `includes`, y dos
 * cosas se colaban (29 sep 2026):
 *
 *  1. Pedazos de otra palabra: «nivel 1» dentro de «nivel 12». Se exige frontera
 *     a los dos lados.
 *  2. Adjetivos de otra cosa: Yesid Triana escribió «**El mayor** porcentaje de
 *     las personas sobreviven con un salario mínimo» —diciendo que la plata no le
 *     alcanza— y quedó con «paquete ESP-3» en el Radar del socio. Las etiquetas que
 *     son artículo + adjetivo («el mayor», «el mejor», «el primero», «los mil»)
 *     solo nombran un paquete cuando no califican a otro sustantivo: al final de la
 *     frase, ante puntuación, o seguidas de palabras que siguen hablando del
 *     paquete («de los tres», «por favor», «dólares»).
 *
 * Una captura que falta le cuesta poco: el cierre del canal lo hace
 * `gestionarCierre` leyendo el mensaje entero. Una captura falsa marca como venta
 * pendiente a quien acaba de decir que no puede pagar.
 *
 * Vigilado por `npx tsx scripts/prueba-captura-paquete.mts`.
 */

const LETRA = 'a-z0-9áéíóúñü';
const ANTES = new RegExp(`[${LETRA}]$`, 'i');
const DESPUES = new RegExp(`^[${LETRA}]`, 'i');

/** Los nombres del paquete no son adjetivos: «el visionario» basta solo. */
const NOMBRE_DE_PAQUETE = /visionario|empresarial|inicial|estrat[eé]gico/i;

/** Lo que puede seguir a «el mayor» sin que el adjetivo pase a calificar otra cosa. */
const SIGUE_HABLANDO_DEL_PAQUETE =
  /^\s*($|[.,;:!?¡¿)(…"'-])|^\s+(paquete|de\s+(los|todos|ellos|esos|esas)|por\s*favor|porfa|pues|entonces|ese|esa|mismo|para\s+m[ií]|me\s+(sirve|interesa|gusta|conviene|llama|quedo)|quiero|est[aá]\s+bien|creo|d[oó]lares|usd|y\s|o\s)/i;

function esDescriptor(etiqueta: string): boolean {
  return /^(el|la|los)\s/i.test(etiqueta)
    && !/\d/.test(etiqueta)
    && !NOMBRE_DE_PAQUETE.test(etiqueta)
    && etiqueta.trim().split(/\s+/).length <= 3;
}

export function mencionaPaqueteComoEleccion(mensajeLower: string, etiqueta: string): boolean {
  const descriptor = esDescriptor(etiqueta);
  for (let i = mensajeLower.indexOf(etiqueta); i !== -1; i = mensajeLower.indexOf(etiqueta, i + 1)) {
    const fin = i + etiqueta.length;
    if (i > 0 && ANTES.test(mensajeLower[i - 1]) && !/[$]/.test(etiqueta[0])) continue;
    if (DESPUES.test(mensajeLower.slice(fin, fin + 1)) && !/[%$]$/.test(etiqueta)) continue;
    if (descriptor && !SIGUE_HABLANDO_DEL_PAQUETE.test(mensajeLower.slice(fin))) continue;
    return true;
  }
  return false;
}
