/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Ciclos de pago de Gano Excel — cálculo determinístico.
 *
 * La semana comercial va de lunes a domingo y es un ciclo NUMERADO. Lo que un
 * canal mueve en un ciclo se liquida el viernes de la SEGUNDA semana después
 * del cierre — un viernes de por medio: cierre domingo + 12 días.
 *
 * ANCLA (dato del Director, 20 ago 2026): el ciclo 924 va del lunes 17 al
 * domingo 23 de agosto de 2026 y se paga el viernes 4 de septiembre de 2026.
 * Todo lo demás se deriva de ahí por aritmética de semanas — nada de tablas
 * congeladas: COMP_PV_03 traía ciclos de enero de 2025 impresos en el chat.
 *
 * Zona horaria: Colombia (UTC-5, sin horario de verano) — el "hoy" se calcula
 * restando 5 horas al reloj del servidor, que corre en UTC.
 */

const DIA = 86_400_000;
const SEMANA = 7 * DIA;

/** Lunes 17 de agosto de 2026, 00:00 Bogotá, expresado en ms UTC "de calendario". */
const LUNES_ANCLA = Date.UTC(2026, 7, 17);
const CICLO_ANCLA = 924;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export interface CicloGano {
  numero: number
  /** ms UTC del lunes 00:00 (calendario Bogotá) */
  lunes: number
  domingo: number
  viernesPago: number
}

/** El instante actual proyectado al calendario de Bogotá, como ms UTC. */
function ahoraBogota(ahora: Date): number {
  return ahora.getTime() - 5 * 3_600_000;
}

/** Medianoche del día (calendario Bogotá) que contiene el instante dado. */
function medianoche(msBogota: number): number {
  return Math.floor(msBogota / DIA) * DIA;
}

export function cicloDeFecha(ahora: Date = new Date()): CicloGano {
  const hoy = medianoche(ahoraBogota(ahora));
  const semanas = Math.floor((hoy - LUNES_ANCLA) / SEMANA);
  return cicloPorNumero(CICLO_ANCLA + semanas);
}

export function cicloPorNumero(numero: number): CicloGano {
  const lunes = LUNES_ANCLA + (numero - CICLO_ANCLA) * SEMANA;
  return {
    numero,
    lunes,
    domingo: lunes + 6 * DIA,
    // domingo + 12 días = el segundo viernes tras el cierre (17 ago → 4 sep ✓)
    viernesPago: lunes + 18 * DIA,
  };
}

/** "17 de agosto" — con año solo si difiere del año de referencia. */
export function fechaCorta(ms: number, anioReferencia?: number): string {
  const d = new Date(ms);
  const base = `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
  return anioReferencia !== undefined && d.getUTCFullYear() !== anioReferencia
    ? `${base} de ${d.getUTCFullYear()}` : base;
}

/**
 * La respuesta dictada sobre ciclos. `numeroPedido` cuando la persona pregunta
 * por un ciclo concreto ("¿cuándo pagan el ciclo 922?"); sin él, el actual.
 *
 * Tres datos y una sola pregunta de cierre: el ciclo en curso, cuándo se paga,
 * y qué se paga el viernes que viene — que es lo que de verdad se quiere saber.
 */
export function respuestaCiclo(ahora: Date = new Date(), numeroPedido?: number): string {
  const anio = new Date(ahoraBogota(ahora)).getUTCFullYear();
  const actual = cicloDeFecha(ahora);

  if (numeroPedido !== undefined && numeroPedido !== actual.numero) {
    const c = cicloPorNumero(numeroPedido);
    const verbo = c.viernesPago < medianoche(ahoraBogota(ahora)) ? 'se pagó' : 'se paga';
    return `El ciclo ${c.numero} va del lunes ${fechaCorta(c.lunes, anio)} al domingo ${fechaCorta(c.domingo, anio)}, y ${verbo} el viernes ${fechaCorta(c.viernesPago, anio)}.

El ciclo en el que estamos es el ${actual.numero}.

¿Le muestro de dónde sale esa plata?`;
  }

  // El viernes que viene (calendario Bogotá) y el ciclo que se liquida ese día:
  // viernesPago = lunes + 18d → el ciclo pagado el viernes V empezó en V − 18d.
  const hoy = medianoche(ahoraBogota(ahora));
  const dia = new Date(hoy).getUTCDay(); // 0 = domingo … 5 = viernes
  const viernesProximo = hoy + ((5 - dia + 7) % 7 || 7) * DIA;
  const cicloQuePagan = cicloPorNumero(actual.numero - (actual.viernesPago - viernesProximo) / SEMANA);

  return `Estamos en el *ciclo ${actual.numero}*, que va del lunes ${fechaCorta(actual.lunes, anio)} al domingo ${fechaCorta(actual.domingo, anio)}.

Lo que su canal mueva en este ciclo se liquida el *viernes ${fechaCorta(actual.viernesPago, anio)}* — cada ciclo se paga el segundo viernes después de su cierre.

Y el viernes que viene, ${fechaCorta(viernesProximo, anio)}, se paga lo del ciclo ${cicloQuePagan.numero} (${fechaCorta(cicloQuePagan.lunes, anio)} al ${fechaCorta(cicloQuePagan.domingo, anio)}).

¿Le muestro de dónde sale esa plata?`;
}
