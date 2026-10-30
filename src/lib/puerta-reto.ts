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

/**
 * El video más reciente del reto (30 oct 2026). Hasta ese día, el prompt cargaba
 * «Los dos videos más recientes» y el modelo resolvía «vi su video de hoy» con
 * ellos; el Director los sacó el 26 oct («en el prompt no pueden quedar los
 * guiones, les agregaría peso») y cada video vive solo en el arsenal (`RETO_DNN`).
 * Sin el bloque, el modelo no sabe cuál es el del día: lo dice este puntero, y
 * la puerta lo sirve directo (`PUERTAS_INICIAL`, antes que `RETO_01`).
 *
 * ⛔ Con cada video nuevo del reto: su fragmento `RETO_DNN` al arsenal y este
 * puntero a él, con la fecha en que se publicó. Nada más, y nada en el prompt.
 *
 * «Su último video» se sirve siempre. «El video de hoy» o «el de ayer» solo si el
 * puntero tiene dos días o menos: con uno más viejo, la persona habla de otro
 * video (el que le compartió su socio, la presentación) y servirle el del reto
 * sería contestarle otra cosa; sigue la búsqueda normal.
 *
 * Tolera el dedo torpe en «último» y «video» (últmo · útlimo · vido · vdieo),
 * medido en `scripts/prueba-typos.mts`.
 *
 * Los videos con nombre propio no entran: «el último video de los 12 niveles» o
 * «el video de cómo funciona» tienen su respuesta y su puerta.
 */
export const RETO_MAS_RECIENTE = { fragmento: 'arsenal_inicial_RETO_D51', fecha: '2026-10-27' };

export const RE_VIDEO_ULTIMO = /(?<![a-záéíóúñ])(?:[uú](?:l+t+|t+l+)[ií]?mo|m[aá]s\s+reciente|nuevo)\s+(?:v+[ií]d+(?:eo|io|e|o)|vdi?eo)(?![a-záéíóúñ])/i;

export const RE_VIDEO_DE_HOY = /(?<![a-záéíóúñ])(?:v+[ií]d+(?:eo|io|e|o)|vdi?eo)\s+(?:del\s+r[eé]t+o\s+)?(?:(?:de|del)\s+)?(?:(?:que\s+)?(?:subi[oó]|public[oó]|mont[oó]|sac[oó])\s+)?(?:hoy|ayer|esta\s+ma[ñn]ana|anoche)(?![a-záéíóúñ])/i;

export const RE_VIDEO_CON_NOMBRE = /c[oó]mo\s+funciona|c[oó]mo\s+entra|(12|doce)\s+niveles|servilleta|presentaci[oó]n|qu[eé]\s+debo\s+hacer|estrategia/i;

const diaBogota = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });

/** ¿Pregunta por el video más reciente del reto? (`hoy` se pasa en las pruebas). */
export function preguntaPorElVideoReciente(texto: string, hoy: Date = new Date()): boolean {
  if (RE_VIDEO_CON_NOMBRE.test(texto)) return false;
  if (RE_VIDEO_ULTIMO.test(texto)) return true;
  if (!RE_VIDEO_DE_HOY.test(texto)) return false;
  const dias = (Date.parse(diaBogota(hoy)) - Date.parse(RETO_MAS_RECIENTE.fecha)) / 86_400_000;
  return dias >= 0 && dias <= 2;
}
