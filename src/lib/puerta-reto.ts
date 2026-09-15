/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados. Software propietario y confidencial.
 *
 * La puerta del reto de los 90 días (14 sep 2026).
 *
 * Luis documenta en sus historias un reto público: crear en 90 días una empresa
 * que otras personas puedan tener como suya. Quien lo ve le escribe a Queswa
 * diciendo «el reto», y hasta hoy esa palabra la atrapaba `/reto/i` en
 * `patrones_compensacion` — herencia del Reto de los 12 días, que se retiró con
 * su funnel —: la persona recibía el plan de compensación y el modelo negaba que
 * el reto existiera («no es un programa oficial», «hay un cruce de
 * conversaciones»).
 *
 * Medido el 14 sep sobre diez paráfrasis: 4 de 10 caían en compensación por la
 * palabra. Y mandarlas al arsenal inicial no bastaba: «cómo va el reto, ya van en
 * el día 8» no trae `RETO_01` ni entre los seis primeros. Por eso es PUERTA
 * (`PUERTAS_INICIAL` en route.ts), no patrón de clasificación.
 *
 * ⚠️ «Reto» también es palabra común —«vender es un reto para mí», «el mayor reto
 * es el tiempo»—, así que la llave exige lo que la vuelve EL reto (un
 * determinante, o los 90 días) y la exclusión saca el uso genérico y los retos
 * viejos que tienen otro destino (12 niveles, 12 o 5 días, diciembre).
 *
 * ⚠️ «El plan de los 90 días» NO entra, a propósito: así oyen los prospectos de
 * los socios la estrategia de los 12 Niveles, y el índice de NIVELES_01 lo atiende.
 *
 * La palabra tolera el dedo torpe (réto · rteo · retto) sin atrapar «retó», «resto»
 * ni «recto»; la exclusión la tolera igual, o «el mayor réto» abriría la puerta.
 *
 * Cada regex va en UNA línea: `scripts/benchmark-clasificador.mjs` los lee de este
 * archivo para modelar la puerta. Casos de tolerancia a typos en
 * `scripts/prueba-typos.mts`.
 */

export const RE_RETO = /(?<![a-záéíóúñ])(el|del|al|su|tu|ese|este|mismo)\s+(?:r[eé]t+o|rteo)(?![a-záéíóúñ])|(?<![a-záéíóúñ])(?:r[eé]t+o|rteo)\s+de\s+(los\s+)?(90|noventa)(?![0-9])|(empresa|negocio|compa[ñn][ií]a)\s+en\s+(90|noventa)\s+d[ií]as/i;

export const RE_RETO_NO = /(?:r[eé]t+o|rteo)\s+(de\s+)?(los\s+)?(12|doce|5|cinco)\s*(niveles|d[ií]as)|(12|doce)\s+niveles|diciembre|diagn[oó]stico|(es|ser[aá]|ser[ií]a|fue)\s+(un|todo\s+un|mi|nuestro)\s+(gran\s+|mayor\s+)?(?:r[eé]t+o|rteo)|(?:r[eé]t+o|rteo)\s+(es|ser[aá]|ser[ií]a|m[aá]s\s+grande|mayor|para\s+m[ií])(?![a-záéíóúñ])|(mayor|gran|principal|verdadero|primer)\s+(?:r[eé]t+o|rteo)/i;

/** ¿El mensaje habla del reto de los 90 días de Luis? */
export function mencionaElReto(texto: string): boolean {
  return RE_RETO.test(texto) && !RE_RETO_NO.test(texto);
}
